import { router, protectedProcedure, middleware, publicProcedure } from "../trpc";
import { aiModels, users, forms, submissions, plans, eq, sql, desc } from "@sec-form/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const isAdminMiddleware = middleware(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You must be an administrator to perform this action.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const adminProcedure = protectedProcedure.use(isAdminMiddleware);

export const adminRouter = router({
  getModels: adminProcedure.query(async ({ ctx }) => {
    const models = await ctx.db.query.aiModels.findMany({
      orderBy: (m, { asc }) => [asc(m.name)],
    });
    return models;
  }),

  getSystemStatus: adminProcedure.query(async ({ ctx }) => {
    return {
      hasApiKey: !!process.env.GEMINI_API_KEY,
      mockFallback: !process.env.GEMINI_API_KEY,
    };
  }),

  toggleModelActive: adminProcedure
    .input(
      z.object({
        id: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const model = await ctx.db.query.aiModels.findFirst({
        where: eq(aiModels.id, input.id),
      });

      if (!model) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Model not found",
        });
      }

      if (model.isDefault && !input.isActive) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Cannot deactivate the default active model. Set another model as default first.",
        });
      }

      await ctx.db
        .update(aiModels)
        .set({
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(eq(aiModels.id, input.id));

      return { success: true };
    }),

  setDefaultModel: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const model = await ctx.db.query.aiModels.findFirst({
        where: eq(aiModels.id, input.id),
      });

      if (!model) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Model not found",
        });
      }

      if (!model.isActive) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Cannot set an inactive model as default. Activate it first.",
        });
      }

      // Reset other defaults
      await ctx.db
        .update(aiModels)
        .set({
          isDefault: false,
          updatedAt: new Date(),
        });

      // Set this one as default
      await ctx.db
        .update(aiModels)
        .set({
          isDefault: true,
          updatedAt: new Date(),
        })
        .where(eq(aiModels.id, input.id));

      return { success: true };
    }),

  getUsers: adminProcedure.query(async ({ ctx }) => {
    const usersList = await ctx.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        planId: users.planId,
        image: users.image,
        createdAt: users.createdAt,
        formCount: sql<number>`count(distinct ${forms.id})`.mapWith(Number),
        responseCount: sql<number>`count(distinct ${submissions.id})`.mapWith(Number),
      })
      .from(users)
      .leftJoin(forms, eq(forms.userId, users.id))
      .leftJoin(submissions, eq(submissions.formId, forms.id))
      .groupBy(users.id, users.name, users.email, users.role, users.planId, users.image, users.createdAt)
      .orderBy(desc(users.createdAt));

    return usersList;
  }),

  updateUserPlan: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        planId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const plan = await ctx.db.query.plans.findFirst({
        where: eq(plans.id, input.planId),
      });

      if (!plan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }

      await ctx.db
        .update(users)
        .set({
          planId: input.planId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  getPlans: publicProcedure.query(async ({ ctx }) => {
    const allPlans = await ctx.db.query.plans.findMany({
      orderBy: (p, { asc }) => [asc(p.maxPublicForms)],
    });
    return allPlans;
  }),
});
