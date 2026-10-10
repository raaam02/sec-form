"use client";

import React, { useId, useRef, useState } from "react";
import { Sparkles, CornerDownLeft, ArrowRight, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStartBuilding } from "./useStartBuilding";

export function PromptBox({
  className,
}: {
  className?: string;
  showChips?: boolean;
}) {
  const { startWithPrompt } = useStartBuilding();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = value.trim() || "Customer feedback survey with 1-5 rating and open comments";
    startWithPrompt(finalPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  return (
    <div className={cn("w-full transition-all", className)}>
      <form
        onSubmit={submit}
        className={cn(
          "relative flex flex-col rounded-3xl border bg-card/90 text-card-foreground p-3 sm:p-4 shadow-xl backdrop-blur-xl transition-all duration-300",
          isFocused
            ? "border-primary/60 ring-2 ring-primary/20 shadow-2xl"
            : "border-border/80 hover:border-border shadow-black/5 dark:shadow-black/25"
        )}
      >
        {/* Textarea Area */}
        <div className="relative px-1 pt-1 pb-2">
          <label htmlFor={id} className="sr-only">
            Describe the form you want to build
          </label>
          <textarea
            id={id}
            ref={textareaRef}
            rows={2}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Customer feedback survey with NPS rating and open comments"
            className="w-full resize-none bg-transparent text-sm sm:text-[15px] font-normal leading-relaxed text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/40">
          {/* Subtle Formu AI Indicator */}
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium pl-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>AI Form Generator</span>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground/70">
              <CornerDownLeft className="h-3 w-3" /> enter
            </span>
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <span>Generate</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
