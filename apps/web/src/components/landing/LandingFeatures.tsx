"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, GripVertical, Palette, Rocket, ShieldCheck, Sparkles, BarChart3, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, SectionHeader } from "./ui";
import { fadeUp, stagger } from "./motion";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://form.emoicons.com";

// ─── Tile shell ──────────────────────────────────────────────────────────────

function Tile({
  icon: Icon,
  title,
  body,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/30 sm:p-7",
        className
      )}
    >
      <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="font-outfit text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
      {children && <div className="mt-6 flex flex-1 flex-col justify-end">{children}</div>}
    </motion.article>
  );
}

// ─── Mini visuals ────────────────────────────────────────────────────────────

const Skeleton = ({ w = "w-full" }: { w?: string }) => <div className={`h-2.5 rounded-full bg-muted-foreground/15 ${w}`} />;

function AIVisual() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate">Onboarding survey with an NPS score and open feedback</span>
      </div>
      {["How likely are you to recommend us?", "What almost stopped you from signing up?"].map((q, i) => (
        <div key={q} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
          <div className="min-w-0 space-y-1.5">
            <p className="truncate text-xs font-semibold text-foreground">{q}</p>
            <Skeleton w={i === 0 ? "w-24" : "w-40"} />
          </div>
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{i === 0 ? "Rating" : "Long text"}</span>
        </div>
      ))}
    </div>
  );
}

const SWATCHES = ["#7c3aed", "#0ea5e9", "#10b981", "#f97316", "#e11d48"];

function ThemeVisual() {
  const [color, setColor] = useState(SWATCHES[0]);
  return (
    <div className="space-y-4">
      <div className="space-y-2.5 rounded-2xl border border-border bg-background/60 p-4" style={{ borderColor: `${color}55` }}>
        <Skeleton w="w-1/2" />
        <div className="h-8 rounded-lg border border-border" />
        <div className="flex h-8 items-center justify-center rounded-lg text-xs font-bold text-white transition-colors" style={{ background: color }}>
          Submit
        </div>
      </div>
      <div className="flex gap-2" role="group" aria-label="Preview accent colour">
        {SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            aria-label={`Use accent ${c}`}
            aria-pressed={color === c}
            className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-card transition ${color === c ? "ring-2 ring-foreground/60" : "hover:scale-110"}`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

function BuilderVisual() {
  const rows = ["Short text", "Rating", "Multiple choice"];
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div
          key={r}
          className={cn(
            "flex items-center gap-2 rounded-xl border bg-background/60 px-3 py-2.5 text-xs font-medium text-foreground transition-transform duration-300",
            i === 1 ? "translate-x-2 border-primary/40 shadow-md group-hover:translate-x-3" : "border-border"
          )}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden />
          {r}
        </div>
      ))}
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [32, 48, 40, 66, 58, 82, 74];
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
      <div className="flex h-28 items-end gap-1.5 rounded-2xl border border-border bg-background/60 p-4" aria-hidden>
        {bars.map((h, i) => (
          <div key={i} className={`flex-1 rounded-t-md ${i === bars.length - 1 ? "bg-primary" : "bg-primary/25"}`} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI summary · example
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Mostly positive. Wait times are the most common complaint; three people asked for oat milk.
        </p>
      </div>
    </div>
  );
}

function PublishVisual() {
  return (
    <div className="space-y-3">
      <pre className="overflow-x-auto rounded-2xl border border-border bg-background/70 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        <code>
          {`<script src="${APP_URL}/embed.js"\n  data-form-id="YOUR_FORM_ID"></script>`}
        </code>
      </pre>
      <div className="flex flex-wrap gap-2">
        {["Share link", "Embed", "QR code", "REST API"].map((c) => (
          <span key={c} className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function SecureVisual() {
  const items = ["Allowed embed domains", "Rate-limited submissions", "Private drafts", "Self-host with Docker"];
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
          <Check className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden /> {i}
        </li>
      ))}
    </ul>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function LandingFeatures() {
  return (
    <section className="border-t border-border bg-card/20 py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="Features"
          title="Everything a great form needs"
          description="Built around the details that make people actually finish a form."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-6"
        >
          <Tile className="md:col-span-4" icon={Sparkles} title="AI form generation" body="Describe the form in plain English. Get fields, validation and copy you can publish as-is, or tweak in the builder.">
            <AIVisual />
          </Tile>
          <Tile className="md:col-span-2" icon={Palette} title="Themes that fit your brand" body="50+ presets, or describe a style and let AI generate one. Try a colour.">
            <ThemeVisual />
          </Tile>
          <Tile className="md:col-span-2" icon={LayoutGrid} title="Visual builder" body="Drag, drop and reorder with live preview.">
            <BuilderVisual />
          </Tile>
          <Tile className="md:col-span-4" icon={BarChart3} title="Analytics and AI insights" body="Track views, submissions and conversion, then let Gemini summarize sentiment and common requests.">
            <AnalyticsVisual />
          </Tile>
          <Tile className="md:col-span-4" icon={Rocket} title="Publish anywhere" body="Share a link, embed it on any site, or connect through the REST API.">
            <PublishVisual />
          </Tile>
          <Tile className="md:col-span-2" icon={ShieldCheck} title="Safe by default" body="Sensible protections out of the box, and full control if you self-host.">
            <SecureVisual />
          </Tile>
        </motion.div>
      </Container>
    </section>
  );
}
