"use client";

import React from "react";
import { ThemeConfig } from "@sec-form/shared";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface ThemeFormPreviewProps {
  theme: ThemeConfig;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  showActiveBadge?: boolean;
  className?: string;
}

/**
 * Standalone ThemeFormPreview component that renders an authentic miniature
 * live form canvas reflecting the exact theme colors, border radius, inputs, and button.
 */
export function ThemeFormPreview({
  theme,
  size = "sm",
  isActive = false,
  showActiveBadge = true,
  className,
}: ThemeFormPreviewProps) {
  const radius = theme.borderRadius || "6px";
  const btnBg = theme.buttonBgColor || theme.primaryColor;
  const btnText = theme.buttonTextColor || "#ffffff";
  const inputBg = theme.inputBgColor || "transparent";
  const inputBorder = theme.inputBorderColor || "rgba(128,128,128,0.2)";
  const inputColor = theme.inputTextColor || theme.textColor;

  // Sizing configurations
  const heightClass =
    size === "lg" ? "h-36" : size === "md" ? "h-28" : "h-20";

  const cardMaxWidth =
    size === "lg" ? "max-w-[240px]" : size === "md" ? "max-w-[190px]" : "max-w-[135px]";

  const paddingClass =
    size === "lg" ? "p-3 space-y-2.5" : size === "md" ? "p-2.5 space-y-2" : "p-2 space-y-1.5";

  return (
    <div
      className={cn(
        "relative w-full rounded-xl flex flex-col justify-center items-center overflow-hidden border border-black/5 dark:border-white/5 transition-transform duration-200 group-hover:scale-[1.015]",
        heightClass,
        className
      )}
      style={{
        backgroundColor: theme.backgroundColor,
      }}
    >
      {/* Subtle ambient lighting layer for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.25) 0%, transparent 75%)",
        }}
      />

      {/* Floating Active Checkmark Badge */}
      <AnimatePresence>
        {isActive && showActiveBadge && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="absolute top-1.5 right-1.5 z-10 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md ring-2 ring-background"
          >
            <Check className="h-2.5 w-2.5 stroke-[3]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mini Form Card */}
      <div
        className={cn(
          "w-full shadow-xs border border-black/[0.08] dark:border-white/[0.09] transition-all",
          cardMaxWidth,
          paddingClass
        )}
        style={{
          backgroundColor: theme.cardColor,
          borderRadius: radius,
        }}
      >
        {/* Mock Question Title Line */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <div
              className={cn(
                "rounded-full shrink-0",
                size === "lg" ? "h-2 w-3/5" : size === "md" ? "h-1.5 w-1/2" : "h-1.5 w-3/5"
              )}
              style={{
                backgroundColor: theme.textColor,
                opacity: 0.88,
              }}
            />
            {/* Required indicator dot */}
            <div
              className="h-1 w-1 rounded-full shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            />
          </div>
          {size !== "sm" && (
            <div
              className="h-1 rounded-full w-4 shrink-0 opacity-20"
              style={{ backgroundColor: theme.textColor }}
            />
          )}
        </div>

        {/* Mock Description line for md and lg sizes */}
        {size !== "sm" && (
          <div
            className="h-1 rounded-full w-4/5 opacity-35"
            style={{ backgroundColor: theme.textColor }}
          />
        )}

        {/* Mock Input Field */}
        <div
          className={cn(
            "w-full flex items-center border transition-all",
            size === "lg" ? "h-5 px-2" : size === "md" ? "h-4 px-1.5" : "h-3.5 px-1.5"
          )}
          style={{
            backgroundColor: inputBg,
            borderColor: inputBorder,
            borderRadius: `calc(${radius} * 0.72)`,
          }}
        >
          <div
            className={cn(
              "rounded-full",
              size === "lg" ? "h-1.5 w-2/5" : "h-1 w-1/2"
            )}
            style={{
              backgroundColor: inputColor,
              opacity: 0.35,
            }}
          />
        </div>

        {/* Mock Submit Button Row */}
        <div className="flex justify-end pt-0.5">
          <div
            className={cn(
              "flex items-center justify-center font-bold shadow-2xs tracking-tight transition-all",
              size === "lg" ? "h-4 px-2.5" : size === "md" ? "h-3.5 px-2" : "h-3 px-1.5"
            )}
            style={{
              backgroundColor: btnBg,
              color: btnText,
              borderRadius: `calc(${radius} * 0.72)`,
            }}
          >
            <div
              className="h-1 rounded-full"
              style={{
                width: size === "lg" ? "20px" : size === "md" ? "16px" : "12px",
                backgroundColor: btnText,
                opacity: 0.95,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeFormPreview;
