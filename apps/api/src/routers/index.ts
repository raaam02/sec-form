import { router } from "../trpc";
import { authRouter } from "./auth";
import { formsRouter } from "./forms";
import { submissionsRouter } from "./submissions";
import { analyticsRouter } from "./analytics";
import { aiRouter } from "./ai";

export const appRouter = router({
  auth: authRouter,
  forms: formsRouter,
  submissions: submissionsRouter,
  analytics: analyticsRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
export default appRouter;
