"use client";

import React from "react";
import { motion } from "motion/react";
import { BarChart3, MousePointerClick, Palette } from "lucide-react";
import { Container, SectionHeader } from "./ui";
import { fadeUp, stagger } from "./motion";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Describe or drag",
    body: "Type what you need, or drag fields from the palette. Either way your form takes shape in seconds.",
  },
  {
    icon: Palette,
    title: "Style it your way",
    body: "Pick one of 50+ themes or tune colors, radius and fonts until it matches your brand.",
  },
  {
    icon: BarChart3,
    title: "Launch and learn",
    body: "Publish with one click. Watch responses arrive and let AI summarize what people are saying.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="How it works"
          title="From idea to live form in three steps"
          description="No config files, no code. Most forms are ready in under a minute."
        />

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="relative grid gap-5 md:grid-cols-3"
        >
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              variants={fadeUp}
              className="relative rounded-2xl border border-border bg-card/50 p-7 transition-colors hover:border-primary/30"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-outfit text-sm font-bold tabular-nums text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-outfit text-xl font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}
