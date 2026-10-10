"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { Sparkles, Copy, Check, ArrowRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ThemesPage() {
  // Default to Dark Mode theme matching the website
  const defaultTheme = BUILTIN_THEMES.find((t) => t.id === "dark") || BUILTIN_THEMES[0];
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(defaultTheme);
  const [activeRating, setActiveRating] = useState<number>(4);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tThemes = useTranslations("Themes");

  const copyConfig = (theme: ThemeConfig) => {
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          name: theme.name,
          primaryColor: theme.primaryColor,
          backgroundColor: theme.backgroundColor,
          textColor: theme.textColor,
          cardColor: theme.cardColor,
          borderRadius: theme.borderRadius,
        },
        null,
        2
      )
    );
    setCopiedId(theme.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pt-32 sm:pt-36 pb-24 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          {tThemes("title")}
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg">
          {tThemes("subtitle")}
        </p>
      </div>

      {/* Immersive Single Container Divided into 2 Parts */}
      <div className="mt-12 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch divide-y lg:divide-y-0 lg:divide-x divide-border/30">

          {/* PART 1: Left Side — Live Form Preview & Actions */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Live interactive form preview
              </span>
              <button
                type="button"
                onClick={() => copyConfig(selectedTheme)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/50 bg-background/60 hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-95 shadow-2xs"
                title="Copy Theme JSON"
              >
                {copiedId === selectedTheme.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Theme JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Inner Live Form Canvas */}
            <div
              className="rounded-2xl p-6 sm:p-8 border border-border/30 shadow-md flex items-center justify-center min-h-[460px] transition-all duration-300"
              style={{
                backgroundColor: selectedTheme.backgroundColor,
                color: selectedTheme.textColor,
              }}
            >
              <div
                className="w-full max-w-sm p-6 sm:p-7 shadow-xl space-y-4.5 rounded-2xl transition-all duration-300"
                style={{
                  backgroundColor: selectedTheme.cardColor,
                  borderRadius: selectedTheme.borderRadius || "1rem",
                  color: selectedTheme.textColor,
                }}
              >
                <div>
                  <h3 className="font-bold text-base sm:text-lg tracking-tight" style={{ color: selectedTheme.textColor }}>
                    Product Feedback & NPS
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    Tell us how your latest experience was with Formu.
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="font-medium opacity-85 block text-[11px]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Alex Chen"
                      className="w-full h-9.5 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none transition-colors rounded-xl"
                      style={{ borderRadius: `min(${selectedTheme.borderRadius || "1rem"}, 0.75rem)` }}
                    />
                  </div>

                  {/* Rating Stars */}
                  <div className="space-y-1">
                    <label className="font-medium opacity-85 block text-[11px]">
                      Rating Experience
                    </label>
                    <div className="flex gap-1.5 items-center py-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= activeRating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setActiveRating(star)}
                            className="p-1 rounded-lg transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                            aria-label={`Rate ${star} out of 5 stars`}
                          >
                            <Star
                              className="h-5 w-5 transition-colors duration-200"
                              style={{
                                fill: isFilled ? selectedTheme.primaryColor : "transparent",
                                color: isFilled ? selectedTheme.primaryColor : selectedTheme.textColor,
                                opacity: isFilled ? 1 : 0.25,
                              }}
                            />
                          </button>
                        );
                      })}
                      <span className="ml-2 text-xs opacity-60">
                        {activeRating} / 5
                      </span>
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className="space-y-1">
                    <label className="font-medium opacity-85 block text-[11px]">
                      Comments or Suggestions
                    </label>
                    <textarea
                      rows={2}
                      defaultValue="The new form styling engine feels super fast and clean!"
                      className="w-full p-2.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none resize-none rounded-xl"
                      style={{ borderRadius: `min(${selectedTheme.borderRadius || "1rem"}, 0.75rem)` }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    className="w-full h-10 font-semibold text-white shadow-sm transition-all active:scale-98 flex items-center justify-center text-xs rounded-xl"
                    style={{
                      backgroundColor: selectedTheme.primaryColor,
                      color: selectedTheme.primaryColor === "#ffffff" ? "#0f172a" : "#ffffff",
                      borderRadius: `min(${selectedTheme.borderRadius || "1rem"}, 0.75rem)`,
                    }}
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Form Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/30">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Apply &ldquo;{selectedTheme.name}&rdquo; to your forms
                </p>
                <p className="text-xs text-muted-foreground">
                  All themes can be customized further in the visual builder.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
              >
                <span>Use in Builder</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* PART 2: Right Side — Theme Presets List */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-muted/15">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Select preset
              </span>
              <span className="text-xs text-muted-foreground">
                {BUILTIN_THEMES.length} themes
              </span>
            </div>

            {/* Scrollable Presets Grid */}
            <div className="space-y-2 h-[520px] overflow-y-auto pr-1.5 custom-scrollbar">
              {BUILTIN_THEMES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-primary/60 bg-card shadow-sm ring-1 ring-primary/40"
                        : "border-border/40 bg-card/40 hover:border-border hover:bg-card/70"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Visual Color Palette Swatch Dots */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="h-4 w-4 rounded-full border border-black/15 dark:border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.primaryColor }}
                          title={`Primary: ${theme.primaryColor}`}
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-black/15 dark:border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.cardColor }}
                          title={`Card: ${theme.cardColor}`}
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-black/15 dark:border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.backgroundColor }}
                          title={`Background: ${theme.backgroundColor}`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate">
                          {theme.name}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          {theme.primaryColor} • r: {theme.borderRadius}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom helper tip */}
            <div className="pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Custom theme?</span> Create custom hex tokens and radius in builder.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
