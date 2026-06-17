import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@sec-form/api/src/routers";
import superjson from "superjson";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/trpc`
        : "http://localhost:4000/trpc",
    }),
  ],
});
