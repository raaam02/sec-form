import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import crypto from "crypto";
import * as schema from "./schema";
import { FORM_TEMPLATES, BUILTIN_THEMES } from "../../shared/src";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding database...");
  const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/secform";
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    // 1. Clean existing data (safely using cascade references)
    await db.delete(schema.users);
    await db.delete(schema.plans);
    await db.delete(schema.aiModels);
    console.log("Cleared existing database tables.");

    // Seed Subscription Plans
    const initialPlans = [
      {
        id: "free",
        name: "Free",
        description: "Perfect for small personal projects and hobbyists.",
        prices: { USD: 0, INR: 0 },
        features: ["5 Active Forms", "Standard Form Layouts", "Basic AI Responses", "Community Support"],
        maxPublicForms: 5,
      },
      {
        id: "pro",
        name: "Professional",
        description: "For creators and small businesses needing more capacity.",
        prices: { USD: 29, INR: 2400 },
        features: ["50 Active Forms", "Full Theme & Color Customization", "Allowed Embed Domains", "Advanced AI Insights"],
        maxPublicForms: 50,
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "For organizations requiring custom scale and high limits.",
        prices: { USD: 99, INR: 8000 },
        features: ["Unlimited Active Forms", "Dedicated Support & SLAs", "Custom Integration Limits", "Priority System Performance"],
        maxPublicForms: 999999,
      },
    ];
    await db.insert(schema.plans).values(initialPlans as any);
    console.log("Seeded subscription plans.");

    // Seed AI Models
    const initialModels = [
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        isActive: true,
        isDefault: true,
        provider: "google",
      },
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        isActive: true,
        isDefault: false,
        provider: "google",
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        isActive: true,
        isDefault: false,
        provider: "google",
      },
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        isActive: true,
        isDefault: false,
        provider: "google",
      },
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        isActive: true,
        isDefault: false,
        provider: "google",
      },
    ];
    await db.insert(schema.aiModels).values(initialModels as any);
    console.log("Seeded default AI models.");

    // 2. Create Demo User
    const passwordHash = hashPassword("demo123");
    const [demoUser] = await db
      .insert(schema.users)
      .values({
        id: crypto.randomUUID() as any,
        name: "Demo User",
        email: "demo@demo.com",
        passwordHash,
        image: "https://api.dicebear.com/7.x/adventurer/svg?seed=DemoUser",
        role: "user",
      })
      .returning();

    console.log(`Created demo user: ${demoUser.email}`);

    // Create Admin User
    const adminPasswordHash = hashPassword("admin123");
    const [adminUser] = await db
      .insert(schema.users)
      .values({
        id: crypto.randomUUID() as any,
        name: "Admin User",
        email: "admin@admin.com",
        passwordHash: adminPasswordHash,
        image: "https://api.dicebear.com/7.x/adventurer/svg?seed=AdminUser",
        role: "admin",
      })
      .returning();

    console.log(`Created admin user: ${adminUser.email}`);

    // 3. Create Forms from Templates
    const createdForms = [];
    for (const t of FORM_TEMPLATES) {
      const selectedTheme = BUILTIN_THEMES.find((theme) => theme.id === t.themeId) || BUILTIN_THEMES[0];
      const formId = crypto.randomUUID();
      
      const [form] = await db
        .insert(schema.forms)
        .values({
          id: formId as any,
          userId: demoUser.id,
          title: t.title,
          description: t.description,
          slug: t.id, // Custom slug equal to template id
          schemaJson: { fields: t.fields },
          themeJson: selectedTheme,
          isPublished: true,
          visibility: t.id === "newsletter-signup" ? "unlisted" : "public", // Mix of public and unlisted
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          updatedAt: new Date(),
        })
        .returning();
      
      createdForms.push({
        form,
        template: t
      });
      console.log(`Created form: "${form.title}" [Slug: /f/${form.slug}]`);
    }

    // 4. Generate Views & Submissions across 30 days
    const mockFirstNames = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mila", "Noah", "Olivia", "Paul", "Quinn", "Ryan", "Sophia", "Tom"];
    const mockLastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
    
    let totalSubmissions = 0;
    let totalViews = 0;

    for (const { form, template } of createdForms) {
      const targetSubmissionsCount = 20 + Math.floor(Math.random() * 10); // 20 to 30 submissions per form
      const targetViewsCount = targetSubmissionsCount + 15 + Math.floor(Math.random() * 40); // 35 to 85 views per form

      console.log(`Generating ${targetSubmissionsCount} submissions and ${targetViewsCount} views for "${form.title}"...`);

      // We will spread views and submissions across the last 30 days
      const daysAgoList = Array.from({ length: 30 }, (_, i) => i).reverse(); // 29, 28, ..., 0

      // Seed Views
      const viewValues = [];
      for (let v = 0; v < targetViewsCount; v++) {
        const randomDayAgo = daysAgoList[Math.floor(Math.random() * daysAgoList.length)];
        const viewDate = new Date();
        viewDate.setDate(viewDate.getDate() - randomDayAgo);
        viewDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        viewValues.push({
          id: crypto.randomUUID() as any,
          formId: form.id,
          createdAt: viewDate,
        });
      }
      if (viewValues.length > 0) {
        await db.insert(schema.formViews).values(viewValues);
        totalViews += viewValues.length;
      }

      // Seed Submissions
      const submissionValues = [];
      for (let s = 0; s < targetSubmissionsCount; s++) {
        const randomDayAgo = daysAgoList[Math.floor(Math.random() * daysAgoList.length)];
        const subDate = new Date();
        subDate.setDate(subDate.getDate() - randomDayAgo);
        subDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        const firstName = mockFirstNames[Math.floor(Math.random() * mockFirstNames.length)];
        const lastName = mockLastNames[Math.floor(Math.random() * mockLastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

        // Generate answers JSON matching template field IDs
        const answers: Record<string, any> = {};

        for (const field of template.fields) {
          if (field.id.includes("name")) {
            answers[field.id] = `${firstName} ${lastName}`;
          } else if (field.id.includes("email")) {
            answers[field.id] = email;
          } else if (field.id.includes("phone")) {
            answers[field.id] = `+1 (555) ${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`;
          } else if (field.id.includes("rating")) {
            answers[field.id] = 3 + Math.floor(Math.random() * 3); // ratings 3, 4, or 5
          } else if (field.id.includes("hear") && field.options && field.options.length > 0) {
            answers[field.id] = field.options[Math.floor(Math.random() * field.options.length)];
          } else if ((field.id.includes("features") || field.id.includes("interests") || field.id.includes("dietary")) && field.options && field.options.length > 0) {
            const count = 1 + Math.floor(Math.random() * 2);
            const selected = [];
            const tempOpts = [...field.options];
            for (let c = 0; c < Math.min(count, tempOpts.length); c++) {
              const idx = Math.floor(Math.random() * tempOpts.length);
              selected.push(tempOpts.splice(idx, 1)[0]);
            }
            answers[field.id] = selected;
          } else if ((field.id.includes("ticket") || field.id.includes("tshirt") || field.id.includes("role") || field.id.includes("order")) && field.options && field.options.length > 0) {
            answers[field.id] = field.options[Math.floor(Math.random() * field.options.length)];
          } else if (field.id.includes("feedback") || field.id.includes("cover") || field.id.includes("comments") || field.id.includes("role")) {
            const reviews = [
              "Great experience overall! The interface is super clean.",
              "Really enjoyed using this service. Highly recommended.",
              "Had a minor bug when trying to load templates, but refresh fixed it. Overall great.",
              "The design is fantastic, and customer service resolved my issue in 5 minutes.",
              "Nice product, although it would be helpful to have more payment gateway integration options.",
              "Excellent quality, prompt service, will definitely visit again!",
              "Could be improved in terms of loading speed, but features are complete."
            ];
            answers[field.id] = reviews[Math.floor(Math.random() * reviews.length)];
          } else if (field.id.includes("experience")) {
            answers[field.id] = Math.floor(Math.random() * 10);
          } else if (field.id.includes("subscribe") || field.id.includes("consent")) {
            answers[field.id] = Math.random() > 0.3; // 70% yes
          } else if (field.id.includes("date")) {
            const d = new Date();
            d.setDate(d.getDate() + Math.floor(Math.random() * 14)); // future date
            answers[field.id] = d.toISOString().split("T")[0];
          } else {
            answers[field.id] = "Sample text response";
          }
        }

        submissionValues.push({
          id: crypto.randomUUID() as any,
          formId: form.id,
          answersJson: answers,
          createdAt: subDate,
        });
      }
      if (submissionValues.length > 0) {
        await db.insert(schema.submissions).values(submissionValues);
        totalSubmissions += submissionValues.length;
      }
    }

    console.log(`Database seeding completed successfully!`);
    console.log(`Total Forms seeded: ${createdForms.length}`);
    console.log(`Total Views generated: ${totalViews}`);
    console.log(`Total Submissions generated: ${totalSubmissions}`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
