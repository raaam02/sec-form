import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db, users } from "@sec-form/db";
import { eq } from "@sec-form/db";
import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-secret",
    }),
    Credentials({
      name: "Demo Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@demo.com" },
        password: { label: "Password", type: "password", value: "demo123" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const emailStr = credentials.email as string;
        const passStr = credentials.password as string;

        try {
          // Verify user in the PostgreSQL database
          const user = await db.query.users.findFirst({
            where: eq(users.email, emailStr)
          });

          if (user) {
            const passwordHash = hashPassword(passStr);
            if (user.passwordHash === passwordHash) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image
              };
            }
          }
        } catch (e) {
          console.warn("Database lookup failed during authorization, checking default credentials fallback:", e);
        }

        // Hackathon-ready fallback in case database is not populated yet
        if (emailStr === "demo@demo.com" && passStr === "demo123") {
          return {
            id: "00000000-0000-0000-0000-000000000000", // Will be overridden or synced later
            name: "Demo User",
            email: "demo@demo.com",
            image: "https://api.dicebear.com/7.x/adventurer/svg?seed=DemoUser"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
});
