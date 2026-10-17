"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export interface FieldLabelProps {
  label: string;
  required?: boolean;
  editable?: boolean;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  badgeClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Standalone FieldLabel component with conditional required indicator (*).
 * In editable mode (builder), auto-sizes input to text width with badge immediately adjacent.
 * In display mode (public form & previews), renders clean label with badge immediately adjacent.
 */
export function FieldLabel({
  label,
  required = false,
  editable = false,
  onChange,
  onEnter,
  placeholder = "Question title...",
  className,
  inputClassName,
  badgeClassName,
  onClick,
}: FieldLabelProps) {
  const isEditable = editable || typeof onChange === "function";

  const renderBadge = () => {
    return (
      <AnimatePresence>
        {required && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full bg-transparent text-muted-foreground/90 font-bold text-xs leading-none select-none shrink-0",
              badgeClassName
            )}
            title="Required"
          >
            *
          </motion.span>
        )}
      </AnimatePresence>
    );
  };

  if (isEditable) {
    return (
      <div className={cn("flex items-center min-w-0", className)} onClick={onClick}>
        <div className="relative inline-flex items-center max-w-full">
          <span
            className="invisible pointer-events-none whitespace-pre font-semibold text-sm sm:text-base leading-snug tracking-tight select-none pr-0.5"
            aria-hidden="true"
          >
            {label || placeholder}
          </span>
          <input
            type="text"
            value={label}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEnter?.();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder={placeholder}
            className={cn(
              "absolute inset-0 w-full h-full font-semibold text-sm sm:text-base text-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/40 leading-snug tracking-tight p-0",
              inputClassName
            )}
          />
        </div>
        {renderBadge()}
      </div>
    );
  }

  return (
    <label className={cn("text-sm font-semibold inline-flex items-center", className)} onClick={onClick}>
      <span className="truncate">{label}</span>
      {renderBadge()}
    </label>
  );
}

export default FieldLabel;
