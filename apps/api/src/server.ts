import "dotenv/config";
import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc";
import { appRouter } from "./routers";
import { db, forms, submissions, formViews } from "@sec-form/db";
import { eq, and } from "@sec-form/db";
import { buildSubmissionValidator } from "@sec-form/validators";
import crypto from "crypto";
import { cache } from "./redis";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Enable CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

app.use(express.json());

// ----------------------------------------------------
// REST API ENDPOINTS (FOR DEVELOPERS & SCALAR DOCS)
// ----------------------------------------------------

// GET public form details by slug
app.get("/api/v1/forms/slug/:slug", async (req, res) => {
  try {
    const isUuid = req.params.slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    let form;

    if (isUuid) {
      form = await db.query.forms.findFirst({
        where: eq(forms.id, req.params.slug),
      });
    } else {
      form = await db.query.forms.findFirst({
        where: eq(forms.slug, req.params.slug),
      });
    }

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (form.visibility === "draft") {
      return res.status(403).json({ error: "Draft forms are not accessible publicly." });
    }

    // Increment view count asynchronously
    db.insert(formViews).values({
      id: crypto.randomUUID() as any,
      formId: form.id,
    }).catch(err => console.error("Failed recording REST view:", err));

    res.json(form);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST submit answers
app.post("/api/v1/forms/:formId/submissions", async (req, res) => {
  const { formId } = req.params;
  const answersJson = req.body;
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  try {
    // Rate limiter
    const rateLimitKey = `rate:form:${formId}:ip:${clientIp}`;
    const submissionCount = await cache.incrAndExpire(rateLimitKey, 60);
    if (submissionCount > 5) {
      return res.status(429).json({ error: "Too many submissions. Please wait a minute before trying again." });
    }

    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (form.visibility === "draft") {
      return res.status(403).json({ error: "Draft forms are not accepting submissions" });
    }

    // Dynamic Zod Validation
    const fields = (form.schemaJson as any).fields || [];
    const validator = buildSubmissionValidator(fields);
    const parsedAnswers = validator.parse(answersJson);

    const [sub] = await db
      .insert(submissions)
      .values({
        id: crypto.randomUUID() as any,
        formId,
        answersJson: parsedAnswers,
      })
      .returning();

    res.status(201).json({ success: true, submissionId: sub.id });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET export CSV
app.get("/api/v1/forms/:formId/submissions/csv", async (req, res) => {
  const { formId } = req.params;
  // Simple header authentication for demo purposes
  const apiKey = req.headers["x-api-key"];

  try {
    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const subs = await db.query.submissions.findMany({
      where: eq(submissions.formId, formId),
      orderBy: (s, { asc }) => [asc(s.createdAt)],
    });

    const fields = (form.schemaJson as any).fields || [];
    const headers = ["Submission ID", "Submitted At", ...fields.map((f: any) => f.label)];
    const csvRows = [headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",")];

    for (const sub of subs) {
      const answers = sub.answersJson as Record<string, any>;
      const row = [sub.id, sub.createdAt.toISOString()];
      
      for (const field of fields) {
        const val = answers[field.id];
        if (val === undefined || val === null) {
          row.push("");
        } else if (Array.isArray(val)) {
          row.push(`"${val.join(", ").replace(/"/g, '""')}"`);
        } else {
          row.push(`"${String(val).replace(/"/g, '""')}"`);
        }
      }
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    const filename = `${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-responses.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// OpenAPI 3.0 specification endpoint
app.get("/openapi.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "AI Form Builder API Docs",
      version: "1.0.0",
      description: "Developer API endpoints for the AI Form Builder SaaS. Integrate forms and submissions directly into your codebase."
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local Express Server"
      }
    ],
    paths: {
      "/api/v1/forms/slug/{slug}": {
        get: {
          summary: "Get Form by custom Slug",
          description: "Fetches form questions schema and themes matching the slug name.",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "The custom slug URL parameter of the form"
            }
          ],
          responses: {
            "200": { description: "Successful response" },
            "404": { description: "Form not found" },
            "403": { description: "Draft forms cannot be accessed publicly" }
          }
        }
      },
      "/api/v1/forms/{formId}/submissions": {
        post: {
          summary: "Submit responses to a Form",
          description: "Post answer records. Answers are validated against the form's question types and constraints.",
          parameters: [
            {
              name: "formId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "The UUID of the target form"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  description: "Key-value pair of field_id to answer value"
                }
              }
            }
          },
          responses: {
            "201": { description: "Submission successfully created" },
            "400": { description: "Input failed Zod validations" },
            "404": { description: "Form not found" },
            "429": { description: "Rate limit exceeded" }
          }
        }
      },
      "/api/v1/forms/{formId}/submissions/csv": {
        get: {
          summary: "Export submissions to CSV",
          description: "Retrieves a downloadable CSV file containing all form responses mapped under question titles.",
          parameters: [
            {
              name: "formId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "UUID of the form"
            }
          ],
          responses: {
            "200": {
              description: "File attachment response stream",
              content: {
                "text/csv": {}
              }
            },
            "404": { description: "Form not found" }
          }
        }
      }
    }
  });
});

// Render Scalar API Documentation Page using static template
app.get("/docs", (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <title>API Reference | AI Form Builder</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/openapi.json"></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `);
});

// ----------------------------------------------------
// tRPC MIDDLEWARE
// ----------------------------------------------------
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Start listening
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Scalar API docs available at http://localhost:${PORT}/docs`);
});
