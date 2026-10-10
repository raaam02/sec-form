"use client";

import React from "react";
import { motion } from "motion/react";
import { BarChart3, MousePointerClick, Palette } from "lucide-react";
import { Container, SectionHeader } from "./ui";
import { fadeUp, stagger } from "./motion";

const STEPS = [
  {
    step: "01",
    icon: MousePointerClick,
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20 dark:bg-violet-500/20 dark:border-violet-500/30",
    title: "Describe or drag",
    description: "Type what you need in plain English, or drag fields directly from the palette.",
  },
  {
    step: "02",
    icon: Palette,
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20 dark:border-rose-500/30",
    title: "Style to your brand",
    description: "Pick from 50+ themes or customize colors, fonts, and corner radius.",
  },
  {
    step: "03",
    icon: BarChart3,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/20 dark:border-blue-500/30",
    title: "Publish and analyze",
    description: "Embed with 1 line of code and let AI summarize responses in real time.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <Container>
        <SectionHeader
          eyebrow="Workflow"
          title="From prompt to live form in three steps"
          description="No complex setup. Ready in under a minute."
        />

        <div className="relative mt-8 sm:mt-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
          >
            {STEPS.map(({ step, icon: Icon, iconColor, iconBg, title, description }) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card/50 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 shadow-sm ${iconBg} ${iconColor}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-outfit text-xl font-bold text-muted-foreground/40 font-mono">
                      {step}
                    </span>
                  </div>

                  <h3 className="font-outfit text-lg font-bold tracking-tight text-foreground">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
