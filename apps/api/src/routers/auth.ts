import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import crypto from "crypto";
import { users, sessions } from "@sec-form/db";
import { eq } from "@sec-form/db";
import { cache } from "../redis";
import { sendOtpMail } from "../mailer";
import { TRPCError } from "@trpc/server";

import * as userService from "../services/userService";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  signUp: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await userService.findUserByEmail(normalizedEmail);
      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A user with this email already exists",
        });
      }

      const hashedPassword = userService.hashPassword(password);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Cache the pending signup details
      const pendingKey = `signup:pending:${normalizedEmail}`;
      await cache.set(pendingKey, JSON.stringify({ name, email: normalizedEmail, hashedPassword }), 600);

      // Cache the OTP for 10 minutes
      const otpKey = `otp:signup:${normalizedEmail}`;
      await cache.set(otpKey, otp, 600);

      // Send the email
      await sendOtpMail(normalizedEmail, otp, name);

      return { success: true, needsOtp: true, email: normalizedEmail };
    }),

  verifySignup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6),
      })
    )
    .mutation(async ({ input }) => {
      const { email, otp } = input;
      const normalizedEmail = email.toLowerCase().trim();
      const otpKey = `otp:signup:${normalizedEmail}`;
      const cachedOtp = await cache.get(otpKey);

      if (!cachedOtp) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification code has expired or is invalid. Please request a new one.",
        });
      }

      if (cachedOtp !== otp) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid verification code.",
        });
      }

      const pendingKey = `signup:pending:${normalizedEmail}`;
      const pendingDataStr = await cache.get(pendingKey);
      if (!pendingDataStr) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Signup session expired. Please start the signup process again.",
        });
      }

      const { name, hashedPassword } = JSON.parse(pendingDataStr);

      const existing = await userService.findUserByEmail(normalizedEmail);
      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A user with this email already exists",
        });
      }

      await userService.createUser(name, normalizedEmail, hashedPassword);

      // Clean up cache
      await cache.del(otpKey);
      await cache.del(pendingKey);

      return { success: true };
    }),

  resendSignupOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;
      const normalizedEmail = email.toLowerCase().trim();
      const pendingKey = `signup:pending:${normalizedEmail}`;
      const pendingDataStr = await cache.get(pendingKey);
      if (!pendingDataStr) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Signup session expired. Please start the signup process again.",
        });
      }

      const { name } = JSON.parse(pendingDataStr);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Cache the OTP for 10 minutes
      const otpKey = `otp:signup:${normalizedEmail}`;
      await cache.set(otpKey, otp, 600);

      // Send the email
      await sendOtpMail(normalizedEmail, otp, name);

      return { success: true };
    }),

  authorize: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const verifiedUser = await userService.verifyCredentials(email, password);
      if (!verifiedUser) {
        return null;
      }
      return verifiedUser;
    }),

  oauthSync: publicProcedure
    .input(
      z.object({
        name: z.string().nullable().optional(),
        email: z.string().email(),
        image: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, image } = input;
      const synced = await userService.syncOAuthUser(name || "", email, image || "");
      return {
        id: synced.id,
        name: synced.name,
        email: synced.email,
        image: synced.image,
        role: synced.role,
      };
    }),

  userRole: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const user = await userService.findUserByEmail(input.email);
      if (!user) return null;
      return {
        id: user.id,
        role: user.role,
      };
    }),
  
  loginDemo: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      
      const dbUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!dbUser) {
        throw new Error("User not found");
      }

      // Verify password hash
      const hash = hashPassword(password);
      if (dbUser.passwordHash !== hash) {
        throw new Error("Invalid password");
      }

      // Generate a mock/custom session token
      const sessionToken = crypto.randomUUID();
      const expires = new Date();
      expires.setDate(expires.getDate() + 30); // expires in 30 days

      await ctx.db.insert(sessions).values({
        sessionToken,
        userId: dbUser.id,
        expires,
      });

      return {
        sessionToken,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
        },
      };
    }),

  requestPasswordResetOtp: protectedProcedure
    .mutation(async ({ ctx }) => {
      const dbUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Cache the OTP for 5 minutes
      const otpKey = `otp:user:${ctx.user.id}`;
      await cache.set(otpKey, otp, 300);

      // Send the email
      await sendOtpMail(dbUser.email, otp, dbUser.name || "User");

      return {
        success: true,
        email: dbUser.email,
      };
    }),

  resetPasswordWithOtp: protectedProcedure
    .input(
      z.object({
        otp: z.string().length(6),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { otp, newPassword, confirmPassword } = input;

      if (newPassword !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }

      const otpKey = `otp:user:${ctx.user.id}`;
      const cachedOtp = await cache.get(otpKey);

      if (!cachedOtp) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification code has expired or is invalid. Please request a new one.",
        });
      }

      if (cachedOtp !== otp) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid verification code.",
        });
      }

      // Hash and update password
      const passwordHash = hashPassword(newPassword);
      await ctx.db
        .update(users)
        .set({
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      // Invalidate/delete the used OTP
      await cache.del(otpKey);

      return { success: true };
    }),
});
