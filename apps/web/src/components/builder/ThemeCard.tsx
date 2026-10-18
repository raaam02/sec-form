"use client";

import React from "react";
import { ThemeConfig } from "@sec-form/shared";
import { ThemeFormPreview } from "./ThemeFormPreview";
import { cn } from "@/lib/utils";

export interface ThemeCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Standalone ThemeCard component showing an authentic miniature live form preview,
 * color swatches, aesthetic category tag, and springy active selection badge.
 * Reuses ThemeFormPreview for the miniature canvas preview.
 */
export function ThemeCard({
  theme,
  isActive,
  onClick,
  size = "sm",
  className,
}: ThemeCardProps) {
  const isDarkTheme =
    theme.category === "dark" ||
    (theme.backgroundColor &&
      (theme.backgroundColor.startsWith("#0") ||
        theme.backgroundColor.startsWith("#1")));

  const btnBg = theme.buttonBgColor || theme.primaryColor;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border p-2 text-left cursor-pointer select-none outline-none transition-all duration-200",
        isActive
          ? "border-primary bg-primary/[0.04] ring-2 ring-primary/60 shadow-sm"
          : "border-border/70 bg-card/60 hover:border-foreground/30 hover:bg-card hover:shadow-xs hover:-translate-y-0.5",
        className
      )}
    >
      {/* 1. Miniature Form Canvas Preview (Reused Component) */}
      <ThemeFormPreview
        theme={theme}
        size={size}
        isActive={isActive}
        showActiveBadge={true}
      />

      {/* 2. Card Header: Name + Category Badge */}
      <div className="mt-2 flex items-center justify-between min-w-0 px-0.5">
        <span className="font-outfit font-semibold text-xs text-foreground truncate block leading-tight group-hover:text-primary transition-colors">
          {theme.name}
        </span>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground capitalize shrink-0 ml-1">
          {theme.category || (isDarkTheme ? "Dark" : "Light")}
        </span>
      </div>

      {/* 3. Color Palette Swatches Bar */}
      <div className="mt-1.5 flex items-center gap-1.5 px-0.5 pt-1.5 border-t border-border/30">
        <div
          className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10 shadow-2xs shrink-0"
          style={{ backgroundColor: theme.primaryColor }}
          title={`Primary accent: ${theme.primaryColor}`}
        />
        <div
          className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10 shadow-2xs shrink-0"
          style={{ backgroundColor: theme.cardColor }}
          title={`Card background: ${theme.cardColor}`}
        />
        <div
          className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10 shadow-2xs shrink-0"
          style={{ backgroundColor: theme.backgroundColor }}
          title={`Page canvas: ${theme.backgroundColor}`}
        />
        <div
          className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/10 shadow-2xs shrink-0"
          style={{ backgroundColor: btnBg }}
          title={`Button: ${btnBg}`}
        />
      </div>
    </div>
  );
}

export default ThemeCard;
