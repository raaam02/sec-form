"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion, useTransform } from "motion/react";
import { Sparkles, Code, ArrowRight, Zap, CheckCircle2, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { HighlightedWord, OrganicBlob } from "./HandDrawn";
import { fadeUp, stagger } from "./motion";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// ─── Product preview mock ───────────────────────────────────────────────────

const DashboardPreview = () => (
  <div className="relative rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden ring-1 ring-border">
    {/* Window chrome */}
    <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
      <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      <span className="ml-3 font-mono text-[10px] text-muted-foreground select-none">form.emoicons.com/dashboard</span>
    </div>

    {/* Stats */}
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: "Submissions", value: "4,289", color: "text-primary" },
          { label: "Conversion", value: "76.4%", color: "text-emerald-500" },
          { label: "AI Active", value: "●", color: "text-blue-500" },
        ] as const).map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-background/60 p-3">
            <div className={`text-[10px] font-semibold uppercase tracking-wider ${color} mb-1 opacity-70`}>{label}</div>
            <div className="text-base font-extrabold text-foreground font-outfit">{value}</div>
          </div>
        ))}
      </div>

      {/* Form preview */}
      <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold">Customer Feedback Form</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live
          </span>
        </div>
        {([
          { label: "Full Name", placeholder: "Your name…", type: "text" },
          { label: "Email", placeholder: "hello@…", type: "email" },
          { label: "Rating", placeholder: '',  type: "rating" },
        ] as const).map(({ label, placeholder, type }) => (
          <div key={label} className="space-y-1">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
            {type === "rating" ? (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className={`text-sm ${i <= 4 ? "text-amber-400" : "text-muted-foreground/20"}`}>★</span>
                ))}
              </div>
            ) : (
              <div className="h-7 rounded-lg border border-border bg-muted/40 px-2.5 text-[10px] text-muted-foreground/50 flex items-center">
                {placeholder}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Floating annotation ─────────────────────────────────────────────────────

const Annotation = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5 shadow-sm text-[11px] font-semibold text-foreground whitespace-nowrap">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
    {children}
  </div>
);

// ─── Main Hero ───────────────────────────────────────────────────────────────

export function LandingHero() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const t = useTranslations("Landing");

  const handleDemoLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signIn("credentials", {
        email: "demo@demo.com",
        password: "demo123",
        callbackUrl: "/dashboard",
      });
    } catch (e) {
      console.error(e);
      setIsLoggingIn(false);
    }
  };

  return (
    <section className="relative min-h-[84vh] flex flex-col items-center justify-center overflow-hidden py-16">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* <OrganicBlob className="top-[-10%] right-[-4%] w-[540px] h-[540px] text-primary/6" />
        <OrganicBlob className="bottom-[-12%] left-[-8%] w-[440px] h-[440px] text-[#a78bfa]/7 rotate-45" /> */}
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(333 71% 51%) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 75% 75% at center, white, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 75% at center, white, transparent)",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-10 max-w-6xl flex flex-col items-center">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center w-full">

          {/* ── Top Content ── */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.a
              href="https://github.com/raaam02/sec-form"
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 px-4 py-1.5 text-[11px] font-semibold text-primary tracking-wide transition-all mb-8 shadow-sm cursor-pointer group"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Open Source AI Form Builder</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </motion.a>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-outfit text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.08] text-foreground max-w-4xl mx-auto"
            >
              Build Your Form With AI<br className="hidden md:inline" />
              <HighlightedWord className="text-primary">Publish in Minutes</HighlightedWord>
            </motion.h1>

            {/* Paragraph */}
            {/* <motion.p
              variants={fadeUp}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              The premium open-source alternative to Typeform. Generate forms from a prompt, customize with drag-and-drop ease, and analyze responses with built-in AI analytics.
            </motion.p> */}

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3 items-center justify-center">
              <Button
                onClick={handleDemoLogin}
                disabled={isLoggingIn}
                className={cn("group h-12 px-7 text-[14px] font-bold shadow-lg",
                  "shadow-primary/20 hover:bg-primary/90 transition-colors",
                  "rounded-b-[4px] rounded-t-3xl hover:rounded-b-3xl transition-all duration-500",
                )}
              >
                {isLoggingIn ? t("loggingIn") : t("ctaStart")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>

              {/* <Button
                variant="outline"
                asChild
                className="h-12 px-5 text-[14px] font-semibold rounded-xl bg-card border-border hover:bg-accent transition-colors shadow-sm"
              >
                <Link href="/explore">
                  Templates
                </Link>
              </Button> */}
            </motion.div>

            {/* Trust line */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-5 justify-center">
              {(["No credit card", "1-min setup", "Open source"] as const).map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Bottom — product card ── */}
          <motion.div
            variants={fadeUp}
            className="relative mt-16 w-full max-w-4xl mx-auto px-2 sm:px-6"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-3xl scale-95 pointer-events-none" />

            {/* Floating annotations */}
            <motion.div
              className="absolute -top-4 right-4 sm:-right-4 z-10 hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Annotation>
                AI generating form…
              </Annotation>
            </motion.div>
            <motion.div
              className="absolute -bottom-4 left-4 sm:-left-4 z-10 hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <Annotation>
                76.4% conversion ↑
              </Annotation>
            </motion.div>

            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
              className="w-full"
            >
              <DashboardPreview />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export { DashboardPreview };
