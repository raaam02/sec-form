"use client";

import React from "react";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import { CircledWord, ScribbleUnderline } from "./HandDrawn";
import {
  IllustrationAI, IllustrationTheme, IllustrationAnalytics,
  IllustrationSecurity, IllustrationDragDrop, IllustrationPublish,
} from "./Illustrations";
import { fadeUp, stagger } from "./motion";

interface FeatureCard {
  id: string;
  bg: string;
  border: string;
  accentColor: string;
  heading: string;
  body: string;
  illustration: React.ReactNode;
  tag: string;
  tagBg: string;
  tagText: string;
  highlight: string;
  highlightColor: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "ai",
    bg: "bg-purple-50 dark:bg-purple-950/25",
    border: "border-purple-200/60 dark:border-purple-800/40",
    accentColor: "rgb(192,132,252)",
    heading: "AI-Powered Generation",
    body: "Describe your form in plain English. Our AI builds it instantly — fields, validation, logic, all included.",
    illustration: <IllustrationAI />,
    tag: "AI",
    tagBg: "bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-700",
    tagText: "text-purple-700 dark:text-purple-300",
    highlight: "AI builds it",
    highlightColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "theme",
    bg: "bg-teal-50 dark:bg-teal-950/25",
    border: "border-teal-200/60 dark:border-teal-800/40",
    accentColor: "rgb(20,184,166)",
    heading: "Theme Customization",
    body: "Choose from dozens of presets or create custom styling. Control page background, text colors, card colors, input colors, and button accents to perfectly match your brand.",
    illustration: <IllustrationTheme />,
    tag: "Design",
    tagBg: "bg-teal-100 dark:bg-teal-900/50 border-teal-200 dark:border-teal-700",
    tagText: "text-teal-700 dark:text-teal-300",
    highlight: "perfectly match your brand",
    highlightColor: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "analytics",
    bg: "bg-blue-50 dark:bg-blue-950/25",
    border: "border-blue-200/60 dark:border-blue-800/40",
    accentColor: "rgb(59,130,246)",
    heading: "Deep Analytics",
    body: "Track submissions, measure conversion, identify drop-offs. Every insight you need, visualized clearly.",
    illustration: <IllustrationAnalytics />,
    tag: "Insights",
    tagBg: "bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700",
    tagText: "text-blue-700 dark:text-blue-300",
    highlight: "Every insight",
    highlightColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "security",
    bg: "bg-emerald-50 dark:bg-emerald-950/25",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
    accentColor: "rgb(34,197,94)",
    heading: "Enterprise Security",
    body: "Role-based access, encrypted submissions, GDPR compliance built-in. Security you can trust at any scale.",
    illustration: <IllustrationSecurity />,
    tag: "Secure",
    tagBg: "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-700",
    tagText: "text-emerald-700 dark:text-emerald-300",
    highlight: "trust at any scale",
    highlightColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "builder",
    bg: "bg-yellow-50 dark:bg-yellow-950/25",
    border: "border-yellow-200/60 dark:border-yellow-800/40",
    accentColor: "rgb(234,179,8)",
    heading: "Visual Builder",
    body: "Drag, drop, reorder. Build complex multi-step forms visually with our intuitive canvas — no code needed.",
    illustration: <IllustrationDragDrop />,
    tag: "Builder",
    tagBg: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700",
    tagText: "text-yellow-700 dark:text-yellow-300",
    highlight: "no code needed",
    highlightColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "publish",
    bg: "bg-orange-50 dark:bg-orange-950/25",
    border: "border-orange-200/60 dark:border-orange-800/40",
    accentColor: "rgb(249,115,22)",
    heading: "One-Click Publish",
    body: "Share via link, embed on any site, or integrate with your stack via our REST API and webhooks.",
    illustration: <IllustrationPublish />,
    tag: "Publish",
    tagBg: "bg-orange-100 dark:bg-orange-900/50 border-orange-200 dark:border-orange-700",
    tagText: "text-orange-700 dark:text-orange-300",
    highlight: "any site",
    highlightColor: "text-orange-600 dark:text-orange-400",
  },
];

function FeatureCardItem({ card }: { card: FeatureCard }) {
  const parts = card.body.split(card.highlight);
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      className={`relative group rounded-3xl border ${card.border} ${card.bg} p-7 flex flex-col gap-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Corner organic circle */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 dark:opacity-5 pointer-events-none"
        style={{ background: card.accentColor }}
      />

      {/* Tag + illustration */}
      <div className="flex items-start justify-between">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${card.tagBg} ${card.tagText}`}>
          {card.tag}
        </span>
        <div className="shrink-0 opacity-90 group-hover:scale-105 transition-transform duration-300">
          {card.illustration}
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 className="font-outfit text-[19px] font-bold text-foreground mb-2 leading-snug">
          {card.heading}
        </h3>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          {parts.map((part, i, arr) =>
            i < arr.length - 1 ? (
              <React.Fragment key={i}>
                {part}
                <span className={`relative font-semibold ${card.highlightColor}`}>
                  {card.highlight}
                  <ScribbleUnderline className={card.highlightColor} />
                </span>
              </React.Fragment>
            ) : part
          )}
        </p>
      </div>
    </motion.div>
  );
}

export function LandingFeatures() {
  return (
    <section className="py-28 bg-card/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[11px] font-bold text-primary uppercase tracking-wider mb-4">
            <Layers className="h-3 w-3" />
            Features
          </div>
          <h2 className="font-outfit text-3xl sm:text-5xl font-black tracking-tight text-foreground max-w-2xl mx-auto leading-tight">
            Everything a{" "}
            <CircledWord circleClass="text-primary">great form</CircledWord>
            {" "}needs.
          </h2>
          <p className="mt-5 text-[16px] text-muted-foreground max-w-xl mx-auto">
            Built with the details that turn good forms into ones people actually complete.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURE_CARDS.map((card) => (
            <FeatureCardItem key={card.id} card={card} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
