import { router } from "../trpc";
import { authRouter } from "./auth";
import { formsRouter } from "./forms";
import { submissionsRouter } from "./submissions";
import { analyticsRouter } from "./analytics";
import { aiRouter } from "./ai";
import { adminRouter } from "./admin";
import { supportRouter } from "./support";

export const appRouter = router({
  auth: authRouter,
  forms: formsRouter,
  submissions: submissionsRouter,
  analytics: analyticsRouter,
  ai: aiRouter,
  admin: adminRouter,
  support: supportRouter,
});

export type AppRouter = typeof appRouter;
export default appRouter;
