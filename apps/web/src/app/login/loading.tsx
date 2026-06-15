import { LoadingSpinner } from "@sec-form/ui";

export default function LoginLoading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
      <LoadingSpinner className="w-8 h-8" color="text-primary" />
    </div>
  );
}
