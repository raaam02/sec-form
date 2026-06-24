import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      planId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string | null;
    planId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    planId?: string | null;
  }
}
