"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { saveLocalForm } from "@/utils/localForms";

/**
 * Where a prompt typed on the landing page is sent.
 * Pointed at /dashboard with ?prompt= to trigger AI generation.
 */
export const AI_CREATE_ROUTE = "/dashboard";
export const PENDING_PROMPT_KEY = "formu:pending-prompt";

/** Single source of truth — replaces copy-pasted form building logic */
export function useStartBuilding() {
  const { data: session } = useSession();
  const router = useRouter();

  const startBlank = useCallback(() => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    saveLocalForm({
      id,
      title: "Untitled Form",
      description: "",
      slug: `form-${Math.random().toString(36).substring(2, 8)}`,
      visibility: "draft" as const,
      schemaJson: {
        fields: [
          {
            id: crypto.randomUUID(),
            type: "text" as const,
            label: "Untitled Question",
            required: false,
            placeholder: "Type your answer here...",
          },
        ],
      },
      userId: session?.user?.id || "local-user",
      createdAt: now,
      updatedAt: now,
    });
    router.push(`/dashboard/my-forms/${id}/edit`);
  }, [session, router]);

  const startWithPrompt = useCallback(
    (prompt: string) => {
      const p = prompt.trim();
      if (!p) return startBlank();
      try {
        sessionStorage.setItem(PENDING_PROMPT_KEY, p);
      } catch {
        /* storage can be unavailable (private mode) — the query param still carries it */
      }
      router.push(`${AI_CREATE_ROUTE}?prompt=${encodeURIComponent(p)}`);
    },
    [router, startBlank]
  );

  return { startBlank, startWithPrompt };
}
