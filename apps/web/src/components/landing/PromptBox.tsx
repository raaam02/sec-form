"use client";

import React, { useId, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStartBuilding } from "./useStartBuilding";

export const EXAMPLE_PROMPTS = [
  { label: "Customer feedback", prompt: "Customer feedback survey for a coffee shop with a rating and comments" },
  { label: "Event RSVP", prompt: "Event RSVP with guest count and dietary preferences" },
  { label: "Job application", prompt: "Job application for a frontend developer with portfolio link" },
  { label: "Contact form", prompt: "Simple contact form with name, email and message" },
];

export function PromptBox({
  className,
  showChips = true,
}: {
  className?: string;
  showChips?: boolean;
}) {
  const { startWithPrompt, startBlank } = useStartBuilding();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startWithPrompt(value || EXAMPLE_PROMPTS[0].prompt);
  };

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={submit}
        className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/5 transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
      >
        <Sparkles className="ml-3 hidden h-5 w-5 shrink-0 text-primary sm:block" aria-hidden />
        <label htmlFor={id} className="sr-only">
          Describe the form you want to build
        </label>
        <input
          id={id}
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe your form… e.g. customer feedback survey for a café"
          className="h-12 min-w-0 flex-1 bg-transparent px-2 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98]"
        >
          Generate
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      {showChips && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setValue(ex.prompt);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              {ex.label}
            </button>
          ))}
          <span className="px-1 text-xs text-muted-foreground/60" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={startBlank}
            className="text-xs font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Start from blank
          </button>
        </div>
      )}
    </div>
  );
}
