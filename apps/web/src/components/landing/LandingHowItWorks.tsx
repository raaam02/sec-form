"use client";

import React from "react";
import { motion } from "motion/react";
import { PlayCircle, MousePointer, Palette, BarChart3 } from "lucide-react";
import { BrushStroke, WiggleArrow, OrganicBlob } from "./HandDrawn";
import { fadeUp, stagger } from "./motion";

const STEPS = [
  {
    num: "01",
    title: "Describe or drag",
    body: "Type what you need, or drag fields from the palette. Either way — your form takes shape in seconds.",
    icon: MousePointer,
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800/50",
    accent: "#9333ea",
    tagBg: "bg-purple-100 dark:bg-purple-900/40",
    tagText: "text-purple-700 dark:text-purple-300",
    note: "Works with plain English ✦",
  },
  {
    num: "02",
    title: "Style it your way",
    body: "Pick a theme or customize everything. Fonts, colors, spacing — all adapts to your brand automatically.",
    icon: Palette,
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800/50",
    accent: "#0d9488",
    tagBg: "bg-teal-100 dark:bg-teal-900/40",
    tagText: "text-teal-700 dark:text-teal-300",
    note: "50+ curated themes ✦",
  },
  {
    num: "03",
    title: "Launch & analyze",
    body: "Publish with one click. Watch responses roll in and let AI surface the patterns that matter.",
    icon: BarChart3,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800/50",
    accent: "#2563eb",
    tagBg: "bg-blue-100 dark:bg-blue-900/40",
    tagText: "text-blue-700 dark:text-blue-300",
    note: "AI insights included ✦",
  },
];

// Hand-drawn connecting path between step cards
const StepConnector = ({ color }: { color: string }) => (
  <div className="hidden lg:flex items-center justify-center w-16 shrink-0 -mt-8" style={{ color }}>
    <WiggleArrow />
  </div>
);

// Sticky-note annotation
const StickyNote = ({ text, bg, text: textColor }: { text: string; bg: string; }) => (
  <div
    className={`absolute -top-4 right-4 ${bg} border border-white/40 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold shadow-sm rotate-2 select-none pointer-events-none z-10`}
    style={{ color: textColor }}
  >
    {text}
  </div>
);

export function LandingHowItWorks() {
  return (
    <section className="py-28 relative overflow-hidden bg-background">
      <OrganicBlob className="top-10 left-[-60px] w-72 h-72 text-[#a78bfa]/5 rotate-12 pointer-events-none" />
      <OrganicBlob className="bottom-0 right-[-40px] w-56 h-56 text-[#34d399]/5 -rotate-12 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-bold text-primary uppercase tracking-wider mb-4">
            <PlayCircle className="h-3 w-3" />
            How it works
          </div>
          <h2 className="font-outfit text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
            Three steps to your{" "}
            <span className="relative inline-block">
              <span className="relative z-10">best form yet</span>
              <BrushStroke className="text-primary/30" />
            </span>
          </h2>
          <p className="mt-5 text-[16px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            From idea to live form in under a minute. No YAML, no config files, no wrangling.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-stretch"
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.num}>
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
                  className={`relative flex-1 rounded-3xl border ${step.border} ${step.bg} p-7 flex flex-col gap-5 overflow-visible shadow-sm`}
                >
                  {/* Sticky note */}
                  <StickyNote text={step.note} bg={step.tagBg} />

                  {/* Step number + icon */}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-outfit text-7xl font-black leading-none select-none pointer-events-none opacity-10 text-foreground">
                      {step.num}
                    </span>
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${step.border} shrink-0`}
                      style={{ background: step.accent + "18" }}
                    >
                      <Icon className="h-5 w-5" style={{ color: step.accent }} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-outfit text-[21px] font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="mt-auto pt-4 border-t border-current opacity-10" style={{ borderColor: step.accent }} />
                  <div className="h-1 w-12 rounded-full" style={{ background: step.accent }} />
                </motion.div>

                {/* Arrow between steps */}
                {idx < STEPS.length - 1 && (
                  <StepConnector color={STEPS[idx + 1].accent} />
                )}
              </React.Fragment>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
