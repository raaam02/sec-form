import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { sendContactMail } from "../mailer";
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
});
