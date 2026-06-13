import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import crypto from "crypto";
import { users, sessions } from "@sec-form/db";
import { eq } from "@sec-form/db";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
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
});
