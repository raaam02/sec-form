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
  accent: string;
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
    bg: "bg-[#fdf4ff]",
    border: "border-[#e9b8f5]/50",
    accent: "#c084fc",
    heading: "AI-Powered Generation",
    body: "Describe your form in plain English. Our AI builds it instantly — fields, validation, logic, all included.",
    illustration: <IllustrationAI />,
    tag: "AI",
    tagBg: "bg-[#f3e8ff] border-[#e9d5ff]",
    tagText: "text-[#9333ea]",
    highlight: "AI builds it",
    highlightColor: "text-[#9333ea]",
  },
  {
    id: "theme",
    bg: "bg-[#f0fdf9]",
    border: "border-[#99f6e4]/50",
    accent: "#14b8a6",
    heading: "Beautiful Themes",
    body: "Choose from dozens of carefully crafted themes. Every detail — typography, spacing, color — is perfectly balanced.",
    illustration: <IllustrationTheme />,
    tag: "Design",
    tagBg: "bg-[#ccfbf1] border-[#99f6e4]",
    tagText: "text-[#0d9488]",
    highlight: "perfectly balanced",
    highlightColor: "text-[#0d9488]",
  },
  {
    id: "analytics",
    bg: "bg-[#eff6ff]",
    border: "border-[#bfdbfe]/50",
    accent: "#3b82f6",
    heading: "Deep Analytics",
    body: "Track submissions, measure conversion, identify drop-offs. Every insight you need, visualized clearly.",
    illustration: <IllustrationAnalytics />,
    tag: "Insights",
    tagBg: "bg-[#dbeafe] border-[#bfdbfe]",
    tagText: "text-[#2563eb]",
    highlight: "Every insight",
    highlightColor: "text-[#2563eb]",
  },
  {
    id: "security",
    bg: "bg-[#f0fdf4]",
    border: "border-[#bbf7d0]/50",
    accent: "#22c55e",
    heading: "Enterprise Security",
    body: "Role-based access, encrypted submissions, GDPR compliance built-in. Security you can trust at any scale.",
    illustration: <IllustrationSecurity />,
    tag: "Secure",
    tagBg: "bg-[#dcfce7] border-[#bbf7d0]",
    tagText: "text-[#16a34a]",
    highlight: "trust at any scale",
    highlightColor: "text-[#16a34a]",
  },
  {
    id: "builder",
    bg: "bg-[#fefce8]",
    border: "border-[#fde68a]/50",
    accent: "#eab308",
    heading: "Visual Builder",
    body: "Drag, drop, reorder. Build complex multi-step forms visually with our intuitive canvas — no code needed.",
    illustration: <IllustrationDragDrop />,
    tag: "Builder",
    tagBg: "bg-[#fef9c3] border-[#fde68a]",
    tagText: "text-[#ca8a04]",
    highlight: "no code needed",
    highlightColor: "text-[#ca8a04]",
  },
  {
    id: "publish",
    bg: "bg-[#fff7ed]",
    border: "border-[#fed7aa]/50",
    accent: "#f97316",
    heading: "One-Click Publish",
    body: "Share via link, embed on any site, or integrate with your stack via our REST API and webhooks.",
    illustration: <IllustrationPublish />,
    tag: "Publish",
    tagBg: "bg-[#ffedd5] border-[#fed7aa]",
    tagText: "text-[#ea580c]",
    highlight: "any site",
    highlightColor: "text-[#ea580c]",
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
      {/* Subtle organic shape */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-15 pointer-events-none"
        style={{ background: card.accent }}
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

      {/* Content */}
      <div>
        <h3 className="font-outfit text-[19px] font-bold text-foreground mb-2 leading-snug">
          {card.heading}
        </h3>
        <p className={`text-[14px] text-muted-foreground leading-relaxed`}>
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
