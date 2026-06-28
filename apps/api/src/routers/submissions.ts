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

      // 1. Rate Limiting Check (max 5 submissions per IP per form per minute)
      const rateLimitKey = `rate:form:${formId}:ip:${ctx.ip}`;
      try {
        const submissionCount = await cache.incrAndExpire(rateLimitKey, 60);
        if (submissionCount > 5) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many submissions. Please wait a minute before trying again.",
          });
        }
      } catch (e: any) {
        if (e instanceof TRPCError) throw e;
        console.warn("Rate limit check failed, skipping:", e);
      }

      // 2. Fetch Form
      const form = await ctx.db.query.forms.findFirst({
        where: eq(forms.id, formId),
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
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
      
      try {
        const dynamicValidator = buildSubmissionValidator(fields);
        // Parse answers against dynamic validator
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
          formId,
          answersJson,
          createdAt: new Date(),
        })
        .returning();

      // Trigger Telegram notification if enabled
      checkAndSendTelegramNotification(form, answersJson).catch((e) =>
        console.error("[TelegramService] Failed to send tRPC submission notification:", e)
      );

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
      
      let message = `*New Submission for:* ${formTitle}\n`;
      message += `-----------------------------------------\n\n`;
      
      for (const field of fields) {
        const val = answers[field.id];
        if (val !== undefined && val !== null) {
          const displayValue = Array.isArray(val) ? val.join(", ") : String(val);
          message += `*${field.label}*\n${displayValue}\n\n`;
        }
      }
      
      message += `-----------------------------------------\n`;
      message += `_Sent via Formu.AI (Local Sandbox)_`;
      
      const { sendTelegramMessage } = await import("../services/telegramService");
      await sendTelegramMessage(chatId, message);
      
      return { success: true };
    })
});
