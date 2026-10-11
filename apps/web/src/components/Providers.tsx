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
import { AuthModalProvider } from "./auth/AuthModalContext";
import { AuthModal } from "./auth/AuthModal";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            // 60-second stale time prevents redundant API refetches on every page/tab navigation
            staleTime: 60 * 1000,
            // Keep unused data in memory cache for 5 minutes
            cacheTime: 5 * 60 * 1000,
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
            // Handled via defaultOptions.mutations.onError
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
          maxURLLength: 2083,
        }),
      ],
    })
  );

  return (
    <ThemeProvider>
      <GlobalShortcutProvider>
        <SessionProvider refetchOnWindowFocus={false} refetchWhenOffline={false}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider delayDuration={300}>
                <AuthModalProvider>
                  {children}
                  <AuthModal />
                </AuthModalProvider>
              </TooltipProvider>
            </QueryClientProvider>
          </trpc.Provider>
        </SessionProvider>
      </GlobalShortcutProvider>
    </ThemeProvider>
  );
}
export default Providers;
