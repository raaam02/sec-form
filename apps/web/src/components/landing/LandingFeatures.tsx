"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Copy,
  FileText,
  GripVertical,
  LayoutGrid,
  Palette,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, SectionHeader } from "./ui";
import { fadeUp, stagger } from "./motion";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://form.emoicons.com";

// ─── Bento Tile Shell ────────────────────────────────────────────────────────

function BentoCard({
  icon: Icon,
  badge,
  title,
  description,
  href,
  linkText,
  external,
  iconColor = "text-primary",
  iconBg = "bg-primary/10 border-primary/20",
  className,
  children,
}: {
  icon: LucideIcon;
  badge?: string;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
  external?: boolean;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/75 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 shadow-sm",
              iconBg,
              iconColor
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden />
          </span>
          {badge && (
            <span className="rounded-full border border-border/60 bg-card/90 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-outfit text-lg font-bold tracking-tight text-foreground">{title}</h3>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {children && <div className="mt-5">{children}</div>}

      {href && (
        <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between">
          <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer noopener" : undefined}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors group/link"
          >
            <span>{linkText || "Explore"}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:text-foreground" />
          </Link>
        </div>
      )}
    </motion.article>
  );
}

// ─── Miniature Demonstrations ────────────────────────────────────────────────

function AIGenerationVisual() {
  return (
    <div className="space-y-2 rounded-xl border border-border/70 bg-background/60 p-3.5 shadow-sm">
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs font-medium text-foreground">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="truncate">Onboarding survey with NPS and feedback</span>
      </div>
      <div className="space-y-1.5 pt-0.5">
        {[
          { q: "How was your experience?", type: "Rating", w: "w-24" },
          { q: "What could we improve?", type: "Text", w: "w-32" },
        ].map((item) => (
          <div
            key={item.q}
            className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1.5 text-xs"
          >
            <div className="min-w-0 space-y-1">
              <p className="truncate font-medium text-foreground text-[11px]">{item.q}</p>
              <div className={`h-1.5 rounded-full bg-muted-foreground/15 ${item.w}`} />
            </div>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SWATCHES = [
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Rose", hex: "#f43f5e" },
];

function ThemeCustomizerVisual() {
  const [activeColor, setActiveColor] = useState(SWATCHES[0].hex);

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl border bg-background/60 p-3.5 transition-all duration-300 shadow-sm"
        style={{ borderColor: `${activeColor}50` }}
      >
        <div className="space-y-2">
          <div className="h-2 w-1/3 rounded-full bg-muted-foreground/20" />
          <div className="h-7 rounded-md border border-border/80 bg-card/60" />
          <div
            className="flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
            style={{ backgroundColor: activeColor }}
          >
            Submit
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono text-muted-foreground">Try accent:</span>
        <div className="flex gap-2">
          {SWATCHES.map(({ name, hex }) => (
            <button
              key={hex}
              type="button"
              onClick={() => setActiveColor(hex)}
              aria-label={`Select ${name}`}
              className={`h-5.5 w-5.5 rounded-full transition-transform ${
                activeColor === hex ? "ring-2 ring-foreground/60 scale-110" : "opacity-75 hover:opacity-100"
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BuilderDragVisual() {
  const rows = ["Short Text", "Star Rating (1–5)", "Multiple Choice"];
  return (
    <div className="space-y-1.5">
      {rows.map((row, i) => (
        <div
          key={row}
          className={cn(
            "flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-300",
            i === 1
              ? "translate-x-2 border-primary/50 bg-primary/5 text-primary"
              : "border-border/60 text-muted-foreground"
          )}
        >
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/70" aria-hidden />
          <span>{row}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsInsightsVisual() {
  const bars = [35, 52, 42, 68, 60, 88, 76];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-border/70 bg-background/60 p-3 flex flex-col justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">Responses</span>
        <div className="flex h-16 items-end gap-1.5 pt-2" aria-hidden>
          {bars.map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t ${
                i === bars.length - 1 ? "bg-primary" : "bg-primary/25"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-background/60 p-3 flex flex-col justify-between">
        <div>
          <p className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> AI Summary
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            "88% positive sentiment. Most requested feature: Slack alerts."
          </p>
        </div>
      </div>
    </div>
  );
}

function EmbedCodeVisual() {
  const [copied, setCopied] = useState(false);
  const snippet = `<script src="${APP_URL}/embed.js"\n  data-form-id="YOUR_FORM_ID"></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2.5">
      <div className="relative rounded-xl border border-border/80 bg-background/80 p-3 font-mono text-xs">
        <button
          type="button"
          onClick={copyCode}
          className="absolute right-2 top-2 rounded-md border border-border/60 bg-card/60 p-1 text-muted-foreground hover:text-foreground"
          title="Copy snippet"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
        </button>
        <pre className="overflow-x-auto text-muted-foreground leading-snug pr-7">
          <code>{snippet}</code>
        </pre>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {["WordPress", "Webflow", "Shopify", "React"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/60 bg-card/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TelegramWebhookVisual() {
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border/70 bg-background/80 p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#229ED9]/15 text-[#229ED9]">
              <Send className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground">Formu Telegram Bot</span>
                <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-mono font-medium text-primary">BOT</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Telegram Channel • Instant Push</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            &lt; 100ms
          </span>
        </div>

        <div className="rounded-lg border border-border/50 bg-card/70 p-2.5 text-xs space-y-1">
          <div className="font-semibold text-foreground flex items-center justify-between">
            <span>🎉 New Form Submission</span>
            <span className="text-[10px] text-muted-foreground font-normal">Just now</span>
          </div>
          <div className="text-[11px] text-muted-foreground space-y-0.5 pt-0.5">
            <p><span className="text-foreground font-medium">Name:</span> Sarah Jenkins</p>
            <p><span className="text-foreground font-medium">Rating:</span> ⭐⭐⭐⭐⭐ (5/5)</p>
            <p><span className="text-foreground font-medium">Feedback:</span> &ldquo;Cleanest form submission I have used!&rdquo;</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground">1-click bot connect via <code className="text-foreground bg-muted/60 px-1 py-0.5 rounded text-[10px]">/start</code></span>
        <button
          type="button"
          onClick={() => {
            setSent(true);
            setTimeout(() => setSent(false), 2000);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-accent transition-colors"
        >
          {sent ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span>Simulated!</span>
            </>
          ) : (
            <>
              <Send className="h-3 w-3 text-[#229ED9]" />
              <span>Simulate alert</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function TemplatesVisual() {
  const templates = [
    { title: "Customer Feedback & NPS", tag: "Feedback" },
    { title: "Event RSVP & Dietary", tag: "Events" },
    { title: "Job Application & Resume", tag: "Hiring" },
  ];

  return (
    <div className="space-y-2">
      {templates.map((tpl) => (
        <div
          key={tpl.title}
          className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-xs transition-colors hover:border-primary/40 hover:bg-card"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span className="truncate font-medium text-foreground text-[11px]">{tpl.title}</span>
          </div>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shrink-0">
            {tpl.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function SecurityVisual() {
  const guards = [
    "Allowed embed domains",
    "Redis rate limiting",
    "Private drafts",
    "Self-host with Docker",
  ];
  return (
    <ul className="space-y-1.5 pt-0.5">
      {guards.map((item) => (
        <li key={item} className="flex items-center gap-2 text-xs font-medium text-foreground">
          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Features Bento Section ──────────────────────────────────────────────────

export function LandingFeatures() {
  return (
    <section className="border-t border-border/70 bg-card/15 py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="Features"
          title="Everything your forms need"
          description="Built for conversion, customizable to your brand."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5"
        >
          {/* Card 1: AI Generation */}
          <BentoCard
            className="md:col-span-7"
            icon={Sparkles}
            iconColor="text-violet-600 dark:text-violet-400"
            iconBg="bg-violet-500/10 border-violet-500/20 dark:bg-violet-500/20 dark:border-violet-500/30"
            badge="AI Engine"
            title="AI Form Generation"
            description="Describe what you need in plain English. Get fields, validation, and copy ready to publish."
            href="#prompt"
            linkText="Try AI Generator"
          >
            <AIGenerationVisual />
          </BentoCard>

          {/* Card 2: Interactive Theme Engine */}
          <BentoCard
            className="md:col-span-5"
            icon={Palette}
            iconColor="text-rose-600 dark:text-rose-400"
            iconBg="bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20 dark:border-rose-500/30"
            badge="Theming"
            title="Branded Styling"
            description="50+ presets or custom hex colors, radius, and fonts. Try an accent below."
            href="/themes"
            linkText="Browse Themes"
          >
            <ThemeCustomizerVisual />
          </BentoCard>

          {/* Card 3: Ready-Made Templates */}
          <BentoCard
            className="md:col-span-5"
            icon={FileText}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBg="bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/20 dark:border-amber-500/30"
            badge="Templates"
            title="Curated Templates"
            description="Jumpstart your workflow with tested templates for surveys, RSVPs, hiring, and lead generation."
            href="/explore"
            linkText="Browse Templates"
          >
            <TemplatesVisual />
          </BentoCard>

          {/* Card 4: Instant Telegram Webhook Connect */}
          <BentoCard
            className="md:col-span-7"
            icon={Send}
            iconColor="text-[#0088cc] dark:text-[#29b6f6]"
            iconBg="bg-[#0088cc]/10 border-[#0088cc]/20 dark:bg-[#0088cc]/20 dark:border-[#0088cc]/30"
            badge="Instant Sync"
            title="Instant Telegram Connect"
            description="Receive live form responses straight in your Telegram chat or team channel under 100ms. No complex API keys required."
            href="https://t.me/FormuAi_bot"
            linkText="Connect Telegram Bot"
            external
          >
            <TelegramWebhookVisual />
          </BentoCard>

          {/* Card 5: Visual Canvas */}
          <BentoCard
            className="md:col-span-5"
            icon={LayoutGrid}
            iconColor="text-indigo-600 dark:text-indigo-400"
            iconBg="bg-indigo-500/10 border-indigo-500/20 dark:bg-indigo-500/20 dark:border-indigo-500/30"
            badge="Builder"
            title="Visual Canvas"
            description="Drag, drop, and reorder fields with live instant preview."
            href="/dashboard"
            linkText="Open Form Builder"
          >
            <BuilderDragVisual />
          </BentoCard>

          {/* Card 6: Analytics and AI Insights */}
          <BentoCard
            className="md:col-span-7"
            icon={BarChart3}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/20 dark:border-blue-500/30"
            badge="Analytics"
            title="Submissions & AI Insights"
            description="Track views, conversion rates, and automated sentiment summaries on responses."
            href="/dashboard/analytics"
            linkText="Explore Analytics"
          >
            <AnalyticsInsightsVisual />
          </BentoCard>

          {/* Card 7: Universal Publishing */}
          <BentoCard
            className="md:col-span-7"
            icon={Rocket}
            iconColor="text-orange-600 dark:text-orange-400"
            iconBg="bg-orange-500/10 border-orange-500/20 dark:bg-orange-500/20 dark:border-orange-500/30"
            badge="Embed"
            title="Publish Anywhere"
            description="Share a standalone link, QR code, or paste our lightweight 1-line script."
            href="/dashboard"
            linkText="Share & Embed Forms"
          >
            <EmbedCodeVisual />
          </BentoCard>

          {/* Card 8: Safe by Default */}
          <BentoCard
            className="md:col-span-5"
            icon={ShieldCheck}
            iconColor="text-emerald-600 dark:text-emerald-400"
            iconBg="bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/20 dark:border-emerald-500/30"
            badge="Security"
            title="Safe by Default"
            description="Sensible rate limits, allowed domains, and full control if you self-host."
            href="https://github.com/raaam02/sec-form"
            linkText="Explore Open Source & Security"
            external
          >
            <SecurityVisual />
          </BentoCard>
        </motion.div>
      </Container>
    </section>
  );
}
