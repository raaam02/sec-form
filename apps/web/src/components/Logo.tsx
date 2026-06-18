import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
  };

  const textSizes = {
    sm: "text-[16px]",
    md: "text-[19px]",
    lg: "text-[23px]",
  };

  const svgSizes = {
    sm: "h-4.5 w-4.5",
    md: "h-5.5 w-5.5",
    lg: "h-6.5 w-6.5",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`flex items-center justify-center bg-gradient-to-tr from-primary via-rose-500 to-violet-600 shadow-md shadow-primary/20 shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${svgSizes[size]} text-white`}
        >
          {/* Outer document board */}
          <path
            d="M5 4C5 2.89543 5.89543 2 7 2H13.5L19 7.5V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Folded corner */}
          <path
            d="M13.5 2V7.5H19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Form Line 1 */}
          <path
            d="M9 12H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Form Line 2 */}
          <path
            d="M9 16H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Field checkbox / checkmark */}
          <path
            d="M8.5 7.5L9.5 8.5L11.5 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Solid Sparkle (Gemini AI indicator) emerging from top-right */}
          <path
            d="M19 1L19.3 2.2C19.35 2.4 19.6 2.6 19.8 2.7L21 3L19.8 3.3C19.6 3.4 19.35 3.6 19.3 3.8L19 5L18.7 3.8C18.65 3.6 18.4 3.4 18.2 3.3L17 3L18.2 2.7C18.4 2.6 18.65 2.4 18.7 2.2L19 1Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {showText && (
        <span className={`font-outfit font-black tracking-tight text-foreground ${textSizes[size]}`}>
          Formu<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-rose-500 to-violet-600">.AI</span>
        </span>
      )}
    </div>
  );
}
