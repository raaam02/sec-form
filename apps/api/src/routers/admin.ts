import { router, protectedProcedure, middleware } from "../trpc";
import { aiModels } from "@sec-form/db";
import { eq } from "@sec-form/db";
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
});
