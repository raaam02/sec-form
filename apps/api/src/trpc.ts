import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { db, users } from "@sec-form/db";
import { eq } from "@sec-form/db";
import superjson from "superjson";
import crypto from "crypto";

export interface Context {
  db: typeof db;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    planId: string;
  } | null;
  ip: string;
}

export async function createContext({ req, res }: trpcExpress.CreateExpressContextOptions): Promise<Context> {
  let user = null;
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  // Support reading developer bypass header during local work/seeding
  const userIdHeader = req.headers["x-user-id"];
  if (userIdHeader && typeof userIdHeader === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userIdHeader)) {
    try {
      let dbUser = await db.query.users.findFirst({
        where: eq(users.id, userIdHeader),
      });

      // Special fallback for the demo user if using the hardcoded credentials fallback ID
      if (!dbUser && userIdHeader === "00000000-0000-0000-0000-000000000000") {
        dbUser = await db.query.users.findFirst({
          where: eq(users.email, "demo@demo.com"),
        });

        // If the database has not been seeded at all, auto-create the demo user with this ID
        if (!dbUser) {
          const passwordHash = crypto.createHash("sha256").update("demo123").digest("hex");
          const [newDemoUser] = await db
            .insert(users)
            .values({
              id: "00000000-0000-0000-0000-000000000000",
              name: "Demo User",
              email: "demo@demo.com",
              passwordHash,
              image: "https://api.dicebear.com/7.x/adventurer/svg?seed=DemoUser",
              role: "user",
            })
            .returning();
          dbUser = newDemoUser;
          console.log("Auto-created fallback demo user in database.");
        }
      }

      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name || undefined,
          role: dbUser.role,
          planId: dbUser.planId,
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
          role: session.user.role,
          planId: session.user.planId,
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
