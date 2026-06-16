"use client";

import React from "react";
import { motion } from "motion/react";
import { SquiggleDivider } from "./HandDrawn";
import { fadeUp, stagger } from "./motion";

const STATS = [
  {
    value: "4,200+",
    label: "Forms built",
    bg: "bg-[#fdf4ff]",
    border: "border-[#e9d5ff]/60",
    accent: "text-[#9333ea]",
    highlight: "#9333ea",
  },
  {
    value: "76%",
    label: "Avg. conversion lift",
    bg: "bg-[#f0fdf9]",
    border: "border-[#99f6e4]/60",
    accent: "text-[#0d9488]",
    highlight: "#0d9488",
  },
  {
    value: "12",
    label: "Field types supported",
    bg: "bg-[#eff6ff]",
    border: "border-[#bfdbfe]/60",
    accent: "text-[#2563eb]",
    highlight: "#2563eb",
  },
  {
    value: "∞",
    label: "Theme combinations",
    bg: "bg-[#fff7ed]",
    border: "border-[#fed7aa]/60",
    accent: "text-[#ea580c]",
    highlight: "#ea580c",
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
