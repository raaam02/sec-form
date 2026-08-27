import { router, protectedProcedure } from "../trpc";
import { forms, submissions, formViews } from "@sec-form/db";
import { eq, and, count } from "@sec-form/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { cache } from "../redis";

export const analyticsRouter = router({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    // 1. Get all forms for user
    const userForms = await ctx.db.query.forms.findMany({
      where: eq(forms.userId, ctx.user.id),
    });

    const formIds = userForms.map(f => f.id);

    if (formIds.length === 0) {
      return {
        totalForms: 0,
        totalViews: 0,
        totalSubmissions: 0,
        averageConversionRate: 0,
        timeline: [],
        topForms: [],
      };
    }

    // 2. Fetch views and submissions across all forms with timeline aggregation
    let totalViewsCount = 0;
    let totalSubmissionsCount = 0;
    const topForms = [];

    const dailyTimeline: Record<string, { date: string; submissions: number; views: number }> = {};
    const datesList = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      datesList.push(dateStr);
      dailyTimeline[dateStr] = { date: dateStr, submissions: 0, views: 0 };
    }

    for (const form of userForms) {
      const viewsList = await ctx.db.query.formViews.findMany({
        where: eq(formViews.formId, form.id),
      });
      const submissionsList = await ctx.db.query.submissions.findMany({
        where: eq(submissions.formId, form.id),
      });

      const viewsCount = viewsList.length;
      const submissionsCount = submissionsList.length;

      totalViewsCount += viewsCount;
      totalSubmissionsCount += submissionsCount;

      topForms.push({
        id: form.id,
        title: form.title,
        views: viewsCount,
        submissions: submissionsCount,
      });

      for (const view of viewsList) {
        const dateStr = view.createdAt.toISOString().split("T")[0];
        if (dailyTimeline[dateStr]) {
          dailyTimeline[dateStr].views += 1;
        }
      }

      for (const sub of submissionsList) {
        const dateStr = sub.createdAt.toISOString().split("T")[0];
        if (dailyTimeline[dateStr]) {
          dailyTimeline[dateStr].submissions += 1;
        }
      }
    }

    const timelineData = datesList.map((d) => dailyTimeline[d]);
    const sortedTopForms = topForms.sort((a, b) => b.submissions - a.submissions).slice(0, 5);
    const conversionRate = totalViewsCount > 0 ? (totalSubmissionsCount / totalViewsCount) * 100 : 0;

    return {
      totalForms: formIds.length,
      totalViews: totalViewsCount,
      totalSubmissions: totalSubmissionsCount,
      averageConversionRate: Math.round(conversionRate * 10) / 10,
      timeline: timelineData,
      topForms: sortedTopForms,
    };
  }),

  getFormAnalytics: protectedProcedure
    .input(z.object({ formId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { formId } = input;

      // 1. Check Redis Cache
      const cacheKey = `analytics:form:${formId}`;
      try {
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (e) {
        console.warn("Failed reading analytics cache:", e);
      }

      // Verify Ownership
      const form = await ctx.db.query.forms.findFirst({
        where: and(eq(forms.id, formId), eq(forms.userId, ctx.user.id)),
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      // 2. Get views and submissions totals
      const viewsList = await ctx.db.query.formViews.findMany({
        where: eq(formViews.formId, formId),
      });

      const submissionsList = await ctx.db.query.submissions.findMany({
        where: eq(submissions.formId, formId),
      });

      const totalViews = viewsList.length;
      const totalResponses = submissionsList.length;
      const conversionRate = totalViews > 0 ? (totalResponses / totalViews) * 100 : 0;

      // 3. Aggregate 30-day timeline (responses vs views)
      const dailyTimeline: Record<string, { date: string; submissions: number; views: number }> = {};
      const datesList = [];

      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
        datesList.push(dateStr);
        dailyTimeline[dateStr] = { date: dateStr, submissions: 0, views: 0 };
      }

      // Populate views in timeline
      for (const view of viewsList) {
        const dateStr = view.createdAt.toISOString().split("T")[0];
        if (dailyTimeline[dateStr]) {
          dailyTimeline[dateStr].views += 1;
        }
      }

      // Populate submissions in timeline
      for (const sub of submissionsList) {
        const dateStr = sub.createdAt.toISOString().split("T")[0];
        if (dailyTimeline[dateStr]) {
          dailyTimeline[dateStr].submissions += 1;
        }
      }

      const timelineData = datesList.map((d) => dailyTimeline[d]);

      // 4. Fields submission breakdown (e.g. average ratings, select options distribution)
      const fieldBreakdown: Record<string, any> = {};
      const schemaData = form.schemaJson as any;
      const fields = schemaData.fields || [];

      for (const field of fields) {
        if (field.type === "rating") {
          let sum = 0;
          let count = 0;
          for (const sub of submissionsList) {
            const answers = sub.answersJson as any;
            const ratingVal = Number(answers[field.id]);
            if (ratingVal && !isNaN(ratingVal)) {
              sum += ratingVal;
              count += 1;
            }
          }
          fieldBreakdown[field.id] = {
            type: "rating",
            average: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
            totalCount: count,
          };
        } else if (field.type === "select" || field.type === "radio") {
          const distribution: Record<string, number> = {};
          if (field.options) {
            field.options.forEach((opt: string) => {
              distribution[opt] = 0;
            });
          }
          
          for (const sub of submissionsList) {
            const answers = sub.answersJson as any;
            const val = answers[field.id];
            if (val && typeof val === "string") {
              distribution[val] = (distribution[val] || 0) + 1;
            }
          }
          fieldBreakdown[field.id] = {
            type: "select",
            distribution,
          };
        }
      }

      const result = {
        totalViews,
        totalResponses,
        conversionRate: Math.round(conversionRate * 10) / 10,
        timeline: timelineData,
        fieldBreakdown,
      };

      // Cache the result for 5 minutes (300 seconds)
      try {
        await cache.set(cacheKey, JSON.stringify(result), 300);
      } catch (e) {
        console.warn("Failed writing analytics cache:", e);
      }

      return result;
    }),
});
