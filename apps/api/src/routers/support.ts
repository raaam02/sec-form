import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { sendContactMail, sendFeedbackMail } from "../mailer";
import { TRPCError } from "@trpc/server";

export const supportRouter = router({
  sendContactInquiry: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        subject: z.string().min(1, "Subject is required"),
        message: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await sendContactMail(
          input.name,
          input.email,
          input.subject,
          input.message
        );
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to send email inquiry.",
        });
      }
    }),

  submitFeedback: publicProcedure
    .input(
      z.object({
        message: z.string().min(1, "Message is required"),
        name: z.string().optional().nullable(),
        email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await sendFeedbackMail(
          input.message,
          input.name,
          input.email
        );
        return { success: true };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to submit feedback.",
        });
      }
    }),
});
