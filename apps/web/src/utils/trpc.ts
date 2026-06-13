import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@sec-form/api/src/routers";

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // Browser uses relative pathing
  // Server-side calls target the local Next.js client URL
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
export default trpc;
