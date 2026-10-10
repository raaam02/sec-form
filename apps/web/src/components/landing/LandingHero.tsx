"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { HighlightedWord } from "./HandDrawn";
import { fadeUp, stagger } from "./motion";
import { Container } from "./ui";
import { PromptBox } from "./PromptBox";

// ─── Animated "AI builds your form" demo (pure client-side, no API calls) ────

type DemoField =
  | { kind: "text" | "textarea" | "rating"; label: string }
  | { kind: "choice"; label: string; options: string[] };

const DEMOS: { prompt: string; title: string; slug: string; fields: DemoField[] }[] = [
  {
    prompt: "Customer feedback survey for a coffee shop",
    title: "Coffee Shop Feedback",
    slug: "coffee-feedback",
    fields: [
      { kind: "text", label: "Your name" },
      { kind: "rating", label: "How was your visit?" },
      { kind: "textarea", label: "What could we improve?" },
    ],
  },
  {
    prompt: "Event RSVP with dietary preferences",
    title: "Launch Party RSVP",
    slug: "launch-rsvp",
    fields: [
      { kind: "text", label: "Full name" },
      { kind: "choice", label: "Will you attend?", options: ["Yes", "No", "Maybe"] },
      { kind: "text", label: "Dietary needs" },
    ],
  },
  {
    prompt: "Job application for a frontend developer",
    title: "Frontend Developer Application",
    slug: "frontend-role",
    fields: [
      { kind: "text", label: "Email" },
      { kind: "text", label: "Portfolio URL" },
      { kind: "choice", label: "Years of experience", options: ["0–2", "3–5", "6+"] },
    ],
  },
];

function FieldPreview({ field }: { field: DemoField }) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-semibold text-foreground/80">{field.label}</div>
      {field.kind === "rating" ? (
        <div className="flex gap-1 text-lg leading-none text-amber-400">
          {"★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
          <span className="text-muted-foreground/30">★</span>
        </div>
      ) : field.kind === "choice" ? (
        <div className="flex gap-2">
          {field.options.map((o, i) => (
            <span
              key={o}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                i === 0 ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {o}
            </span>
          ))}
        </div>
      ) : (
        <div className={`${field.kind === "textarea" ? "h-16" : "h-9"} rounded-lg border border-border bg-muted/40`} />
      )}
    </div>
  );
}

function GeneratedFormDemo() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const demo = DEMOS[index];

  useEffect(() => {
    if (reduce) {
      setTyped(demo.prompt.length);
      setShown(demo.fields.length);
      return;
    }
    setTyped(0);
    setShown(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const typing = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= demo.prompt.length) {
        clearInterval(typing);
        demo.fields.forEach((_, f) => timers.push(setTimeout(() => setShown(f + 1), 500 + f * 450)));
        const total = 500 + demo.fields.length * 450 + 2800;
        timers.push(setTimeout(() => setIndex((p) => (p + 1) % DEMOS.length), total));
      }
    }, 38);
    return () => {
      clearInterval(typing);
      timers.forEach(clearTimeout);
    };
  }, [index, reduce, demo]);

  const done = shown >= demo.fields.length;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-6 -bottom-6 top-10 rounded-[2rem] bg-primary/15 blur-3xl" aria-hidden />
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-black/5"
        role="img"
        aria-label="Animated example: a typed prompt turns into a finished feedback form"
      >
        {/* window chrome */}
        <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/40 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
          <span className="ml-3 truncate font-mono text-xs text-muted-foreground">formu.ai/f/{demo.slug}</span>
        </div>

        <div className="grid gap-0 md:grid-cols-[5fr_6fr]" aria-hidden>
          {/* prompt side */}
          <div className="border-b border-border p-6 md:border-b-0 md:border-r">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Your prompt
            </div>
            <p className="min-h-[3.5rem] text-lg font-medium leading-snug text-foreground">
              {demo.prompt.slice(0, typed)}
              <span className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-primary" />
            </p>
            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              {["Picks field types", "Adds validation", "Writes the copy"].map((s, i) => (
                <div key={s} className={`flex items-center gap-2 transition-opacity duration-300 ${shown > i ? "opacity-100" : "opacity-30"}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 ${shown > i ? "text-emerald-500" : ""}`} /> {s}
                </div>
              ))}
            </div>
          </div>

          {/* form side */}
          <div className="min-h-[21rem] bg-background/40 p-6">
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">{typed >= demo.prompt.length ? demo.title : "…"}</h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors ${
                      done ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-border text-muted-foreground"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-500" : "animate-pulse bg-muted-foreground"}`} />
                    {done ? "Ready to publish" : "Generating"}
                  </span>
                </div>
                <div className="space-y-4">
                  {demo.fields.slice(0, shown).map((f) => (
                    <motion.div key={f.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      <FieldPreview field={f} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-8 sm:pt-14">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, white, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, white, transparent)",
          }}
        />
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <Container className="relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center text-center">
          <motion.a
            variants={fadeUp}
            href="https://github.com/raaam02/sec-form"
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Open-source AI form builder
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-4xl font-outfit text-5xl font-black leading-[1.06] tracking-tight text-foreground md:text-6xl lg:text-[72px]"
          >
            Describe a form.
            <br />
            <HighlightedWord className="text-primary">Publish it in minutes.</HighlightedWord>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Type what you need in plain English. Formu.AI builds the fields, validation and styling, then helps you make sense of the responses.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 w-full max-w-2xl">
            <PromptBox />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["No credit card", "Free plan", "Self-hostable"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16 w-full max-w-4xl text-left">
            <GeneratedFormDemo />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
