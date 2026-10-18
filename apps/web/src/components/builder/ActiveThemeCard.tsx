"use client";

import React from "react";
import { ThemeConfig, BUILTIN_THEMES } from "@sec-form/shared";
import { ThemeFormPreview } from "./ThemeFormPreview";
import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ActiveThemeCardProps {
  activeTheme: ThemeConfig | null;
  onResetToPreset?: () => void;
  className?: string;
}

/**
 * ActiveThemeCard component displayed at the top of the theme sidebar.
 * Shows a live preview of the current theme configuration (updating in real-time
 * as users tweak colors or radius) and provides reset functionality if customized.
 */
export function ActiveThemeCard({
  activeTheme,
  onResetToPreset,
  className,
}: ActiveThemeCardProps) {
  const currentTheme = activeTheme || BUILTIN_THEMES[0];
  const isCustomized = currentTheme.id === "custom";

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-3 space-y-2.5 shadow-2xs backdrop-blur-xs">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-outfit font-semibold text-xs text-foreground truncate">
            {currentTheme.name}
          </span>
          <span
            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
              isCustomized
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            {isCustomized ? "Customized" : "Active"}
          </span>
        </div>

        {/* Revert / Reset Button if customized */}
        {isCustomized && onResetToPreset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetToPreset}
            className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
            title="Reset to default theme preset"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Miniature Live Form Preview (Real-time updates) */}
      <ThemeFormPreview
        theme={currentTheme}
        size="md"
        isActive={false}
        showActiveBadge={false}
      />

      {/* Theme Meta Pills */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Radius:</span>
          <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[9px] text-foreground">
            {currentTheme.borderRadius || "8px"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium">Mode:</span>
          <span className="capitalize font-mono bg-muted/60 px-1.5 py-0.5 rounded text-[9px] text-foreground">
            {currentTheme.category || "Light"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ActiveThemeCard;
