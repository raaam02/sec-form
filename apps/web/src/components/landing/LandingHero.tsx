"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  Star,
} from "lucide-react";
import { Container } from "./ui";
import { PromptBox } from "./PromptBox";
import { fadeUp, stagger } from "./motion";

// ─── Scenario Data ─────────────────────────────────────────────────────────────

type DemoField =
  | { kind: "text"; label: string; placeholder: string; required?: boolean }
  | { kind: "textarea"; label: string; placeholder: string }
  | { kind: "rating"; label: string; count: number }
  | { kind: "choice"; label: string; options: string[] };

interface DemoScenario {
  id: string;
  tabLabel: string;
  prompt: string;
  title: string;
  slug: string;
  themeColor: string;
  fields: DemoField[];
}

const DEMOS: DemoScenario[] = [
  {
    id: "nps-feedback",
    tabLabel: "Feedback",
    prompt: "Customer feedback survey with 1–5 rating and open comments",
    title: "Customer Feedback",
    slug: "customer-feedback",
    themeColor: "#8b5cf6",
    fields: [
      { kind: "text", label: "Your name", placeholder: "Alex Rivera", required: true },
      { kind: "rating", label: "How was your experience?", count: 5 },
      { kind: "textarea", label: "What could we improve?", placeholder: "Tell us anything..." },
    ],
  },
  {
    id: "launch-rsvp",
    tabLabel: "RSVP",
    prompt: "Event RSVP with attendance and dietary preferences",
    title: "Launch Party RSVP",
    slug: "launch-rsvp",
    themeColor: "#0ea5e9",
    fields: [
      { kind: "text", label: "Work email", placeholder: "alex@company.com", required: true },
      { kind: "choice", label: "Attending in person?", options: ["Yes", "Virtual", "Can't attend"] },
      { kind: "text", label: "Dietary needs", placeholder: "Vegetarian, gluten-free, etc." },
    ],
  },
  {
    id: "hiring-apply",
    tabLabel: "Job Application",
    prompt: "Frontend developer application with portfolio and experience",
    title: "Developer Application",
    slug: "developer-application",
    themeColor: "#10b981",
    fields: [
      { kind: "text", label: "Portfolio URL", placeholder: "https://github.com/alexrivera", required: true },
      { kind: "choice", label: "Experience", options: ["1–3 yrs", "4–7 yrs", "8+ yrs"] },
      { kind: "textarea", label: "Recent project", placeholder: "Briefly describe your stack..." },
    ],
  },
];

// ─── Realistic Form Field Renderer ───────────────────────────────────────────

function LiveField({ field }: { field: DemoField }) {
  const [rating, setRating] = useState(4);
  const [selectedChoice, setSelectedChoice] = useState(0);

  if (field.kind === "rating") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground/90 block">{field.label}</label>
        <div className="flex items-center gap-1.5 pt-0.5">
          {Array.from({ length: field.count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className="p-1 rounded transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`h-5 w-5 ${
                  i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-mono font-semibold text-foreground">
            {rating} / {field.count}
          </span>
        </div>
      </div>
    );
  }

  if (field.kind === "choice") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground/90 block">{field.label}</label>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {field.options.map((opt, i) => {
            const isSelected = selectedChoice === i;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedChoice(i)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all shadow-sm ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                    : "border-border/80 bg-background/80 dark:bg-card text-muted-foreground hover:border-border hover:text-foreground font-medium"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {isSelected && <span className="h-1 w-1 rounded-full bg-primary-foreground" />}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.kind === "textarea") {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground/90 block">{field.label}</label>
        <div className="min-h-[64px] rounded-xl border border-border/80 bg-background/80 dark:bg-card px-3.5 py-2 text-xs text-muted-foreground/80 shadow-sm">
          {field.placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground/90 block">
        {field.label} {field.required && <span className="text-destructive">*</span>}
      </label>
      <div className="h-10 rounded-xl border border-border/80 bg-background/80 dark:bg-card px-3.5 flex items-center text-xs text-muted-foreground/80 shadow-sm">
        {field.placeholder}
      </div>
    </div>
  );
}

// ─── Dual-Panel Application Window Demo ──────────────────────────────────────

function GeneratedFormDemo() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [visibleFieldsCount, setVisibleFieldsCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scenario = DEMOS[index];
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const switchScenario = (newIndex: number) => {
    clearAllTimers();
    setIsSubmitted(false);
    setIndex(newIndex);
  };

  const handleSubmit = () => {
    if (visibleFieldsCount < scenario.fields.length || isSubmitted) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      switchScenario((index + 1) % DEMOS.length);
    }, 1200);
  };

  useEffect(() => {
    clearAllTimers();

    if (reduce) {
      setTypedChars(scenario.prompt.length);
      setVisibleFieldsCount(scenario.fields.length);
      return;
    }

    setTypedChars(0);
    setVisibleFieldsCount(0);

    let charCount = 0;
    const typingInterval = setInterval(() => {
      charCount += 1;
      setTypedChars(charCount);

      if (charCount >= scenario.prompt.length) {
        clearInterval(typingInterval);

        scenario.fields.forEach((_, fieldIdx) => {
          const timeout = setTimeout(() => {
            setVisibleFieldsCount(fieldIdx + 1);
          }, 300 + fieldIdx * 350);
          timerRef.current.push(timeout);
        });

        if (!isPaused) {
          const totalWait = 300 + scenario.fields.length * 350 + 3500;
          const cycleTimeout = setTimeout(() => {
            setIndex((prev) => (prev + 1) % DEMOS.length);
          }, totalWait);
          timerRef.current.push(cycleTimeout);
        }
      }
    }, 25);

    return () => {
      clearInterval(typingInterval);
      clearAllTimers();
    };
  }, [index, reduce, scenario, isPaused, clearAllTimers]);

  const isComplete = visibleFieldsCount >= scenario.fields.length;

  return (
    <div
      className="relative rounded-3xl border border-border/80 bg-card/60 shadow-2xl backdrop-blur-xl ring-1 ring-white/[0.05] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Interactive demonstration of AI form generation"
    >
      {/* Studio Window Chrome */}
      <div className="flex items-center justify-between border-b border-border/80 bg-card/90 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/50 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
            <Lock className="h-2.5 w-2.5 text-muted-foreground/60" />
            <span>formu.ai/f/{scenario.slug}</span>
          </div>
        </div>

        {/* Form Scenario Switcher (Justified between with slug) */}
        <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-background/50 p-1">
          {DEMOS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => switchScenario(i)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                index === i
                  ? "bg-card text-foreground shadow-sm border border-border/70 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Viewport (Dual-Panel Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
        {/* Left: Prompt & Gemini Pipeline (5 cols) */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-border/80 p-5 sm:p-6 flex flex-col justify-between bg-card/30">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" /> Prompt
              </span>
              
              {/* Live / Generating Tag placed here along with Prompt */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                  isComplete
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-primary/30 bg-primary/10 text-primary"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isComplete ? "bg-emerald-500" : "animate-pulse bg-primary"
                  }`}
                />
                {isComplete ? "Live" : "Generating"}
              </span>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/60 p-3.5 shadow-inner">
              <p className="text-sm font-medium leading-snug text-foreground min-h-[44px]">
                {scenario.prompt.slice(0, typedChars)}
                <span className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-primary" />
              </p>
            </div>

            {/* Inferred Checklist */}
            <div className="mt-5 space-y-2">
              {[
                { label: "Optimal field types", step: 1 },
                { label: "Validation rules", step: 2 },
                { label: "Custom theme", step: 3 },
              ].map(({ label, step }) => {
                const active = visibleFieldsCount >= step || isComplete;
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${
                      active ? "text-foreground opacity-100" : "text-muted-foreground opacity-35"
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                        active
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                          : "border border-border text-muted-foreground/30"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-primary" /> AI Schema Engine
            </span>
            <button
              type="button"
              onClick={() => switchScenario((index + 1) % DEMOS.length)}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Next
            </button>
          </div>
        </div>

        {/* Right: The Live Rendered Form (7 cols) */}
        <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-center bg-background/50">
          <div className="mx-auto w-full max-w-sm h-[390px] rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-md flex flex-col justify-between">
            <div>
              {/* Form Card Header */}
              <div className="border-b border-border/60 pb-3 mb-4">
                <h4 className="font-outfit text-base font-bold text-foreground">
                  {typedChars >= 10 ? scenario.title : "..."}
                </h4>
              </div>

              {/* Form Fields Stack */}
              <div className="space-y-3.5 h-[230px] overflow-hidden">
                {scenario.fields.map((field, fieldIdx) => {
                  const isFieldVisible = visibleFieldsCount > fieldIdx;
                  return (
                    <div
                      key={field.label}
                      className={`transition-all duration-300 ${
                        isFieldVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      <LiveField field={field} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Form Submit Button */}
            <div className="pt-3.5 border-t border-border/50 mt-auto">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isComplete || isSubmitted}
                className={`w-full h-10 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  isSubmitted
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : isComplete
                    ? "bg-foreground text-background hover:opacity-90 active:scale-[0.99] cursor-pointer"
                    : "bg-muted text-muted-foreground/50 cursor-not-allowed opacity-60"
                }`}
              >
                {isSubmitted ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Submitted!</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Landing Hero Main Section ────────────────────────────────────────────────

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24">
      {/* Subtle Grid */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 30%, white, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 30%, white, transparent)",
          }}
        />
        <div className="absolute left-1/2 top-0 h-[320px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center pt-4 sm:pt-8 pb-4"
        >
          {/* Eyebrow Pill */}
          <motion.a
            variants={fadeUp}
            href="https://github.com/raaam02/sec-form"
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md transition hover:border-primary/40 hover:text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Open Source AI Form Builder</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          {/* Clean Headline */}
          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-3xl font-outfit text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.08] tracking-tight text-foreground"
          >
            Describe a form.{" "}
            <br className="hidden sm:inline" />
            <span className="text-primary">Publish in seconds.</span>
          </motion.h1>

          {/* Command Composer */}
          <motion.div variants={fadeUp} id="prompt" className="mt-8 w-full max-w-2xl scroll-mt-24">
            <PromptBox />
          </motion.div>

          {/* App Window Demo */}
          <motion.div variants={fadeUp} className="mt-12 sm:mt-28 w-full max-w-4xl text-left">
            <GeneratedFormDemo />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
