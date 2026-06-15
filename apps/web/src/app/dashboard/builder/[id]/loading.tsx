import { LoadingSpinner } from "@sec-form/ui";

/**
 * Next.js route-level loading UI.
 * Shown immediately when navigating to /dashboard/builder/[id]
 * while the page server component is fetching.
 */
export default function BuilderLoading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background gap-4">
      <LoadingSpinner className="w-10 h-10" color="text-primary" />
      <p className="text-sm text-muted-foreground font-medium animate-pulse">Opening builder…</p>
    </div>
  );
}
