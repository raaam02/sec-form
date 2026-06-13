import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { db, users } from "@sec-form/db";
import { eq } from "@sec-form/db";
import superjson from "superjson";

export interface Context {
  db: typeof db;
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  ip: string;
}

export async function createContext({ req, res }: trpcExpress.CreateExpressContextOptions): Promise<Context> {
  let user = null;
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  // Support reading developer bypass header during local work/seeding
  const userIdHeader = req.headers["x-user-id"];
  if (userIdHeader && typeof userIdHeader === "string") {
    try {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, userIdHeader),
      });
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name || undefined,
        };
      }
    } catch (e) {
      console.warn("Failed fetching user context via x-user-id header:", e);
    }
  }

  // Support reading NextAuth session tokens passed inside the Authorization header
  const authHeader = req.headers.authorization;
  if (!user && authHeader && authHeader.startsWith("Bearer ")) {
    const sessionToken = authHeader.split(" ")[1];
    try {
      // Find session with user relation
      const session = await db.query.sessions.findFirst({
        where: (s, { eq }) => eq(s.sessionToken, sessionToken),
        with: {
          user: true
        }
      });
      
      if (session && session.user && new Date(session.expires) > new Date()) {
        user = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || undefined,
        };
      }
    } catch (e) {
      console.warn("Auth check failed:", e);
    }
  }

  return {
    db,
    user,
    ip,
  };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Authentication checking middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated to perform this request.",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const middleware = t.middleware;
