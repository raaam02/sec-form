import React from "react";

// Simple Loading Spinner used in builder, analytics, and landing pages
export function LoadingSpinner({ className = "w-6 h-6", color = "text-indigo-600" }: { className?: string; color?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${color}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}

// Simple Error Boundary fallback helper component
export function ErrorFallback({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex flex-col gap-2">
      <span className="font-semibold">Something went wrong</span>
      <p>{message}</p>
    </div>
  );
}
