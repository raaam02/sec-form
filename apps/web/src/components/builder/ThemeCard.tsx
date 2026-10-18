"use client";

import React from "react";
import { ThemeConfig } from "@sec-form/shared";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface ThemeCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Standalone ThemeCard component showing an authentic miniature live form preview,
 * color swatches, aesthetic category tag, and springy active selection badge.
 */
export function ThemeCard({
  theme,
  isActive,
  onClick,
  className,
}: ThemeCardProps) {
  const isDarkTheme =
    theme.category === "dark" ||
    (theme.backgroundColor &&
      (theme.backgroundColor.startsWith("#0") ||
        theme.backgroundColor.startsWith("#1")));

  const radius = theme.borderRadius || "6px";
  const btnBg = theme.buttonBgColor || theme.primaryColor;
  const btnText = theme.buttonTextColor || "#ffffff";
  const inputBg = theme.inputBgColor || "transparent";
  const inputBorder = theme.inputBorderColor || "rgba(128,128,128,0.2)";
  const inputColor = theme.inputTextColor || theme.textColor;

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
        "group relative flex flex-col justify-between rounded-2xl border p-2.5 text-left transition-all duration-200 cursor-pointer select-none outline-none",
        isActive
          ? "border-primary bg-primary/[0.04] ring-2 ring-primary/60 shadow-sm"
          : "border-border/70 bg-card/60 hover:border-foreground/30 hover:bg-card hover:shadow-xs",
        className
      )}
    >
      {/* 1. Miniature Form Canvas Preview */}
      <div
        className="relative w-full h-24 rounded-xl p-2.5 flex flex-col justify-center items-center overflow-hidden border border-black/5 dark:border-white/5 transition-transform duration-200 group-hover:scale-[1.01]"
        style={{
          backgroundColor: theme.backgroundColor,
        }}
      >
        {/* Floating Mini Form Card */}
        <div
          className="w-full max-w-[155px] p-2 space-y-1.5 shadow-sm border border-black/[0.06] dark:border-white/[0.08] transition-all"
          style={{
            backgroundColor: theme.cardColor,
            borderRadius: radius,
          }}
        >
          {/* Mock Question Title Line */}
          <div className="flex items-center gap-1">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: "55%",
                backgroundColor: theme.textColor,
                opacity: 0.85,
              }}
            />
            <div
              className="h-1 w-1 rounded-full shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            />
          </div>

          {/* Mock Input Field */}
          <div
            className="h-4 w-full flex items-center px-1.5 border"
            style={{
              backgroundColor: inputBg,
              borderColor: inputBorder,
              borderRadius: `calc(${radius} * 0.75)`,
            }}
          >
            <div
              className="h-1 rounded-full"
              style={{
                width: "45%",
                backgroundColor: inputColor,
                opacity: 0.35,
              }}
            />
          </div>

          {/* Mock Submit Button Row */}
          <div className="flex justify-end pt-0.5">
            <div
              className="h-3.5 px-2 flex items-center justify-center text-[7px] font-bold shadow-2xs tracking-tight"
              style={{
                backgroundColor: btnBg,
                color: btnText,
                borderRadius: `calc(${radius} * 0.75)`,
              }}
            >
              <div
                className="h-1 rounded-full"
                style={{
                  width: "16px",
                  backgroundColor: btnText,
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Card Header: Name + Active Checkmark */}
      <div className="mt-2.5 flex items-center justify-between min-w-0 px-0.5">
        <div className="min-w-0 pr-1">
          <span className="font-outfit font-semibold text-xs text-foreground block truncate leading-tight">
            {theme.name}
          </span>
          <span className="text-[10px] text-muted-foreground/80 font-normal capitalize">
            {theme.category || (isDarkTheme ? "Dark" : "Light")}
          </span>
        </div>

        {/* Animated Checkmark Indicator */}
        <AnimatePresence>
          {isActive ? (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-2xs"
            >
              <Check className="h-2.5 w-2.5 stroke-[3]" />
            </motion.span>
          ) : (
            <span className="h-4 w-4 rounded-full border border-border/80 shrink-0 opacity-40 group-hover:opacity-80 transition-opacity" />
          )}
        </AnimatePresence>
      </div>

      {/* 3. Color Palette Swatches Bar */}
      <div className="mt-2 flex items-center gap-1.5 px-0.5 pt-1 border-t border-border/30">
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
