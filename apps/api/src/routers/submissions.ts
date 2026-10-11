import { router, protectedProcedure, publicProcedure } from "../trpc";
import { SubmitResponseInput, buildSubmissionValidator } from "@sec-form/validators";
import { forms, submissions } from "@sec-form/db";
import { eq, and } from "@sec-form/db";
import { z } from "zod";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { cache } from "../redis";
import { checkAndSendTelegramNotification } from "../services/telegramService";

export const submissionsRouter = router({
  submit: publicProcedure
    .input(SubmitResponseInput)
    .mutation(async ({ input, ctx }) => {
      const { formId, answersJson } = input;

      // 1. Rate Limiting Check (max 15 submissions per IP per form per minute, never blocks)
      const rateLimitKey = `rate:form:${formId}:ip:${ctx.ip}`;
      try {
        const submissionCount = await cache.incrAndExpire(rateLimitKey, 60);
        if (submissionCount > 15) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many submissions. Please wait a minute before trying again.",
          });
        }
      } catch (e: any) {
        if (e instanceof TRPCError) throw e;
        console.warn("Rate limit check failed, skipping:", e);
      }

      // 2. Fetch Form with metadata cache
      const formCacheKey = `form:meta:${formId}`;
      let form: any = null;
      try {
        const cached = await cache.get(formCacheKey);
        if (cached) form = JSON.parse(cached);
      } catch {}

      if (!form) {
        form = await ctx.db.query.forms.findFirst({
          where: eq(forms.id, formId),
        });

        if (!form) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Form not found",
          });
        }

        cache.set(formCacheKey, JSON.stringify(form), 60).catch(() => {});
        if (form.slug) {
          cache.set(`form:meta:${form.slug}`, JSON.stringify(form), 60).catch(() => {});
        }
      }

      // Check visibility: only public forms accept submissions
      if (form.visibility !== "public") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This form is not public and does not accept responses.",
        });
      }

      // 3. Compile validation Zod schema and check answers (against published schema)
      const schemaData = (form.publishedSchemaJson || form.schemaJson) as any;
      const fields = schemaData.fields || [];

      // Check user-configured domain restriction if enabled by form owner
      const allowedDomains: string[] = schemaData.allowedDomains || [];
      if (allowedDomains.length > 0 && ctx.origin) {
        try {
          const originHost = new URL(ctx.origin).hostname.toLowerCase();
          const isAllowed = allowedDomains.some((d) => {
            const clean = d.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].split(":")[0];
            return originHost === clean || originHost.endsWith("." + clean);
          });
          if (!isAllowed) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: `Domain restriction: Submissions from '${originHost}' are not allowed for this form.`,
            });
          }
        } catch (e: any) {
          if (e instanceof TRPCError) throw e;
        }
      }
      
      try {
        const dynamicValidator = buildSubmissionValidator(fields);
        dynamicValidator.parse(answersJson);
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message || "Invalid submission data",
          cause: err,
        });
      }

      // 4. Save Submission
      const [newSubmission] = await ctx.db
        .insert(submissions)
        .values({
          id: crypto.randomUUID() as any,
          formId: form.id,
          answersJson,
          createdAt: new Date(),
        })
        .returning();

      // 5. Asynchronous background tasks (cache invalidation + Telegram)
      setImmediate(async () => {
        if (form.userId) {
          cache.del(`analytics:dashboard:${form.userId}`).catch(() => {});
          cache.del(`forms:list:${form.userId}`).catch(() => {});
        }
        cache.del(`analytics:form:${form.id}`).catch(() => {});

        checkAndSendTelegramNotification(form, answersJson).catch((e) =>
          console.error("[TelegramService] Failed to send tRPC submission notification:", e)
        );
      });

      return { success: true, submissionId: newSubmission.id };
    }),

  list: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Confirm ownership
      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)),
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      return ctx.db.query.submissions.findMany({
        where: eq(submissions.formId, input.formId),
        orderBy: (s, { desc }) => [desc(s.createdAt)],
      });
    }),

  exportCSV: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)),
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      const formSubmissions = await ctx.db.query.submissions.findMany({
        where: eq(submissions.formId, input.formId),
        orderBy: (s, { asc }) => [asc(s.createdAt)],
      });

      const schemaData = form.schemaJson as any;
      const fields = schemaData.fields || [];

      // Compile CSV headers
      const headers = ["Submission ID", "Submitted At"];
      for (const field of fields) {
        headers.push(field.label);
      }

      const csvRows = [headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",")];

      for (const sub of formSubmissions) {
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

      return {
        csv: csvRows.join("\n"),
        filename: `${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-responses.csv`
      };
    }),

  sendTelegramNotification: publicProcedure
    .input(z.object({
      chatId: z.string(),
      formTitle: z.string(),
      fields: z.array(z.any()),
      answers: z.record(z.any())
    }))
    .mutation(async ({ input }) => {
      const { chatId, formTitle, fields, answers } = input;
      
      await checkAndSendTelegramNotification(
        {
          title: formTitle,
          schemaJson: {
            fields,
            telegram: { enabled: true, chatId }
          }
        },
        answers
      );
      
      return { success: true };
    })
});
