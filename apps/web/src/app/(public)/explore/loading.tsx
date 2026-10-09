import { LoadingSpinner } from "@sec-form/ui";

export default function ExploreLoading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <LoadingSpinner className="w-8 h-8" color="text-primary" />
      <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading templates…</p>
    </div>
  );
}
