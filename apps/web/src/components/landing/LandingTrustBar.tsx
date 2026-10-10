"use client";

import React from "react";
import { motion } from "motion/react";
import { Github, Palette, Sparkles, SlidersHorizontal } from "lucide-react";
import { Container } from "./ui";
import { fadeUp, stagger } from "./motion";

const CAPABILITIES = [
  {
    icon: Github,
    tag: "MIT",
    title: "100% Open Source",
    description: "Self-host with Docker. Zero lock-in.",
  },
  {
    icon: Sparkles,
    tag: "Gemini",
    title: "AI Schema Engine",
    description: "Instant field and validation inference.",
  },
  {
    icon: SlidersHorizontal,
    tag: "11 Inputs",
    title: "Rich Field Library",
    description: "Ratings, choices, files, dates & text.",
  },
  {
    icon: Palette,
    tag: "50+ Presets",
    title: "Aesthetic Theming",
    description: "Custom hex tokens and dark mode.",
  },
];

export function LandingTrustBar() {
  return (
    <section className="border-y border-border/70 bg-card/20 py-7 sm:py-8 backdrop-blur-sm">
      <Container>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:divide-x lg:divide-border/60"
        >
          {CAPABILITIES.map(({ icon: Icon, tag, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="flex items-start gap-3 lg:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">{title}</h3>
                  <span className="rounded border border-border/60 bg-card/80 px-1 py-0.2 text-[9px] font-mono text-muted-foreground">
                    {tag}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
