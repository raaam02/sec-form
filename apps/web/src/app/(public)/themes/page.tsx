"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { Sparkles, Copy, Check, ArrowRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ThemesPage() {
  // Default to matching website theme (Dark Mode by default if dark, or Modern SaaS)
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

      {/* Main Studio: Form on Left Side, Theme Presets on Right Side */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT COLUMN: Live Form Preview Window */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 order-1">
          <div className="flex items-center justify-between px-1 h-6">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Live interactive form preview
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyConfig(selectedTheme)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedId === selectedTheme.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Browser Canvas */}
          <div
            className="flex-1 rounded-3xl p-6 sm:p-10 border border-border/40 transition-all duration-300 shadow-xl flex items-center justify-center min-h-[500px]"
            style={{
              backgroundColor: selectedTheme.backgroundColor,
              color: selectedTheme.textColor,
            }}
          >
            <div
              className="w-full max-w-md p-6 sm:p-8 shadow-2xl transition-all duration-300 space-y-5 rounded-2xl"
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
                <p className="text-xs opacity-75 mt-1">
                  Tell us how your latest experience was with Formu.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Text Field */}
                <div className="space-y-1.5">
                  <label className="font-normal opacity-90 block text-xs">
                    Your Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex Chen"
                    className="w-full h-10 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none transition-colors rounded-xl"
                    style={{ borderRadius: `min(${selectedTheme.borderRadius || "1rem"}, 0.75rem)` }}
                  />
                </div>

                {/* Star Rating component */}
                <div className="space-y-1.5">
                  <label className="font-normal opacity-90 block text-xs">
                    Rating Experience
                  </label>
                  <div className="flex gap-2 items-center py-1">
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
                            className="h-6 w-6 transition-colors duration-200"
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

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="font-normal opacity-90 block text-xs">
                    Comments or Suggestions
                  </label>
                  <textarea
                    rows={2}
                    defaultValue="The new form styling engine feels super fast and clean!"
                    className="w-full p-3 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 outline-none resize-none rounded-xl"
                    style={{ borderRadius: `min(${selectedTheme.borderRadius || "1rem"}, 0.75rem)` }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  className="w-full h-10 font-semibold text-white shadow-md transition-all active:scale-98 flex items-center justify-center text-xs rounded-xl"
                  style={{
                    backgroundColor: selectedTheme.primaryColor,
                    borderRadius: `min(${selectedTheme.borderRadius || "1rem"}, 0.75rem)`,
                  }}
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>

          {/* Action bar below live stage */}
          <div className="rounded-2xl bg-card border border-border/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 h-[72px]">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              <span>Use in Builder</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Theme Presets Selector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 order-2">
          <div className="flex items-center justify-between px-1 h-6">
            <span className="text-sm font-medium text-muted-foreground">
              Select preset
            </span>
            <span className="text-xs text-muted-foreground">
              {BUILTIN_THEMES.length} themes
            </span>
          </div>

          {/* Preset list filling the exact matching height */}
          <div className="flex-1 rounded-3xl border border-border/40 bg-card/40 p-3 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-2 h-[550px] overflow-y-auto pr-1.5 custom-scrollbar">
              {BUILTIN_THEMES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-foreground bg-card shadow-sm ring-1 ring-foreground/20"
                        : "border-border/40 bg-card/40 hover:border-border hover:bg-card/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Visual Color Palette swatch */}
                      <div className="flex items-center -space-x-1 shrink-0">
                        <span
                          className="h-5 w-5 rounded-full ring-2 ring-card shadow-xs"
                          style={{ backgroundColor: theme.primaryColor }}
                          title={`Primary: ${theme.primaryColor}`}
                        />
                        <span
                          className="h-5 w-5 rounded-full ring-2 ring-card shadow-xs border border-border/30"
                          style={{ backgroundColor: theme.cardColor }}
                          title={`Card: ${theme.cardColor}`}
                        />
                        <span
                          className="h-5 w-5 rounded-full ring-2 ring-card shadow-xs border border-border/30"
                          style={{ backgroundColor: theme.backgroundColor }}
                          title={`Background: ${theme.backgroundColor}`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                          {theme.name}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          {theme.primaryColor} • r: {theme.borderRadius}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-foreground shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matching height bottom helper container */}
          <div className="rounded-2xl border border-border/40 bg-card/40 p-4 flex items-center justify-between gap-3 h-[72px]">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Custom theme?</span> Create custom hex tokens and border-radius in builder.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
