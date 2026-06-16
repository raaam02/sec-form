"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import { httpBatchLink } from "@trpc/client";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";
import { trpc, getBaseUrl } from "../utils/trpc";

import { ThemeProvider } from "./ThemeProvider";
import { GlobalShortcutProvider } from "./providers/GlobalShortcutProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
          mutations: {
            onError: (error: any) => {
              toast.error(error.message || "An error occurred");
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error: any) => {
            toast.error(error.message || "An error occurred");
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            // Toast is handled in defaultOptions.mutations.onError, or we can do it here.
            // Let's rely on defaultOptions.mutations for mutations.
          },
        }),
      })
  );
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc-proxy`,
        }),
      ],
    })
  );

  return (
    <ThemeProvider>
      <GlobalShortcutProvider>
        <SessionProvider>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider delayDuration={300}>
                {children}
              </TooltipProvider>
            </QueryClientProvider>
          </trpc.Provider>
        </SessionProvider>
      </GlobalShortcutProvider>
    </ThemeProvider>
  );
}
export default Providers;
