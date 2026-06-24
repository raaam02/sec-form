import { router, protectedProcedure, publicProcedure } from "../trpc";
import { CreateFormInput, UpdateFormInput } from "@sec-form/validators";
import { forms, formViews, submissions, plans } from "@sec-form/db";
import { eq, and, ne, count } from "@sec-form/db";
import { z } from "zod";
import crypto from "crypto";
import { BUILTIN_THEMES } from "@sec-form/shared";
import { TRPCError } from "@trpc/server";

const PUBLIC_FORM_LIMIT = 5;

export const formsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userForms = await ctx.db.query.forms.findMany({
      where: eq(forms.userId, ctx.user.id),
      orderBy: (forms, { desc }) => [desc(forms.updatedAt)],
    });

    const formsWithCounts = await Promise.all(userForms.map(async (form) => {
      const viewsCount = await ctx.db.select({ count: count() }).from(formViews).where(eq(formViews.formId, form.id));
      const subsCount = await ctx.db.select({ count: count() }).from(submissions).where(eq(submissions.formId, form.id));
      return {
        ...form,
        totalViews: Number(viewsCount[0]?.count || 0),
        totalResponses: Number(subsCount[0]?.count || 0),
      };
    }));

    return formsWithCounts;
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)),
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      return form;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      let form;
      const isUuid = input.slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      if (isUuid) {
        form = await ctx.db.query.forms.findFirst({
          where: eq(forms.id, input.slug),
        });
      } else {
        form = await ctx.db.query.forms.findFirst({
          where: eq(forms.slug, input.slug),
        });
      }

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      // Check visibility rules
      if (form.visibility === "draft") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This form is a draft and is not open for public submissions.",
        });
      }

      // Track view asynchronously
      try {
        await ctx.db.insert(formViews).values({
          id: crypto.randomUUID() as any,
          formId: form.id,
        });
      } catch (e) {
        console.error("Failed to record view:", e);
      }

      return form;
    }),

  create: protectedProcedure
    .input(CreateFormInput)
    .mutation(async ({ input, ctx }) => {
      const slugBase = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      let slug = slugBase || "untitled-form";

      // Ensure slug uniqueness
      let exists = await ctx.db.query.forms.findFirst({
        where: eq(forms.slug, slug),
      });
      while (exists) {
        slug = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;
        exists = await ctx.db.query.forms.findFirst({
          where: eq(forms.slug, slug),
        });
      }

      const defaultSchema = {
        fields: [
          {
            id: crypto.randomUUID(),
            type: "text" as const,
            label: "Untitled Question",
            required: false,
            placeholder: "",
          },
        ],
      };

      const defaultTheme = BUILTIN_THEMES[0]; // Minimal Theme

      const [newForm] = await ctx.db
        .insert(forms)
        .values({
          id: crypto.randomUUID() as any,
          userId: ctx.user.id,
          title: input.title,
          description: input.description || "",
          slug,
          schemaJson: defaultSchema,
          themeJson: defaultTheme,
          isPublished: false,
          visibility: "draft",
        })
        .returning();

      return newForm;
    }),

  update: protectedProcedure
    .input(UpdateFormInput)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;

      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.id, id), eq(forms.userId, ctx.user.id)),
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found or you don't have access",
        });
      }

      // Check active public forms limit
      if (updates.visibility === "public") {
        const publicFormsCount = await ctx.db
          .select({ count: count() })
          .from(forms)
          .where(
            and(
              eq(forms.userId, ctx.user.id),
              eq(forms.visibility, "public"),
              ne(forms.id, id)
            )
          );
        
        const countVal = Number(publicFormsCount[0]?.count || 0);
        
        // Fetch user plan details dynamically
        const userPlan = await ctx.db.query.plans.findFirst({
          where: eq(plans.id, ctx.user.planId || "free"),
        });
        const limit = userPlan?.maxPublicForms ?? PUBLIC_FORM_LIMIT;

        if (countVal >= limit) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `LIMIT_REACHED: You have reached the limit of ${limit} active public forms.`,
          });
        }
      }

      // Sync published flag if visibility is changing
      let isPublished = form.isPublished;
      if (updates.visibility) {
        isPublished = updates.visibility !== "draft";
      }

      // If user is editing slug, verify uniqueness
      if (updates.slug && updates.slug !== form.slug) {
        const slugExists = await ctx.db.query.forms.findFirst({
          where: and(eq(forms.slug, updates.slug), ne(forms.id, id)),
        });
        if (slugExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This custom slug is already taken. Please choose another.",
          });
        }
      }

      const [updatedForm] = await ctx.db
        .update(forms)
        .set({
          ...updates,
          isPublished,
          updatedAt: new Date(),
        })
        .where(eq(forms.id, id))
        .returning();

      return updatedForm;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.id, input.id), eq(forms.userId, ctx.user.id)),
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      await ctx.db.delete(forms).where(eq(forms.id, input.id));
      return { success: true };
    }),

  listExplore: publicProcedure.query(async ({ ctx }) => {
    // Return published public forms (unlisted is excluded)
    return ctx.db.query.forms.findMany({
      where: and(eq(forms.isPublished, true), eq(forms.visibility, "public")),
      orderBy: (forms, { desc }) => [desc(forms.createdAt)],
    });
  }),
});
