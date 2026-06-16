"use client";

import React from "react";
import { motion } from "motion/react";
import { SquiggleDivider } from "./HandDrawn";
import { fadeUp, stagger } from "./motion";

const STATS = [
  {
    value: "4,200+",
    label: "Forms built",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200/60 dark:border-purple-800/40",
    accent: "text-purple-600 dark:text-purple-400",
    highlight: "rgb(147,51,234)",
  },
  {
    value: "76%",
    label: "Avg. conversion lift",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200/60 dark:border-teal-800/40",
    accent: "text-teal-600 dark:text-teal-400",
    highlight: "rgb(13,148,136)",
  },
  {
    value: "12",
    label: "Field types supported",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200/60 dark:border-blue-800/40",
    accent: "text-blue-600 dark:text-blue-400",
    highlight: "rgb(37,99,235)",
  },
  {
    value: "∞",
    label: "Theme combinations",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200/60 dark:border-orange-800/40",
    accent: "text-orange-600 dark:text-orange-400",
    highlight: "rgb(234,88,12)",
  },
];

// Hand-drawn sparkle / asterisk
const Asterisk = ({ color }: { color: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className="absolute -top-3 -right-2 w-7 h-7 pointer-events-none" aria-hidden>
    <line x1="16" y1="4" x2="16" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="4" y1="16" x2="28" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="7" y1="7" x2="25" y2="25" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="25" y1="7" x2="7" y2="25" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export function LandingStats() {
  return (
    <>
      <div className="relative py-3">
        <SquiggleDivider />
      </div>

      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10"
          >
            By the numbers
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {STATS.map(({ value, label, bg, border, accent, highlight }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                className={`relative rounded-3xl border ${border} ${bg} p-6 flex flex-col items-center text-center overflow-hidden shadow-sm`}
              >
                {/* Decorative asterisk */}
                <Asterisk color={highlight} />

                {/* Big number */}
                <span className={`font-outfit text-5xl sm:text-6xl font-black tracking-tight ${accent} leading-none`}>
                  {value}
                </span>
                <span className="mt-3 text-[12px] font-semibold text-muted-foreground leading-snug">{label}</span>

                {/* Faint bg circle */}
                <div
                  className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-15"
                  style={{ background: highlight + '90' }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="relative py-3">
        <SquiggleDivider />
      </div>
    </>
  );
}
