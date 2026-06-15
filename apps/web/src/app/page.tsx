"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  Sparkles, FileText, BarChart3, Shield, Palette, Code,
  ArrowRight, Zap, CheckCircle2, MousePointer2, Globe2, GitBranch, Lock
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { LocaleSwitcher } from "../components/LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const t = useTranslations("Landing");

  const handleDemoLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await signIn("credentials", {
        email: "demo@demo.com",
        password: "demo123",
        redirect: false,
      });
      if (res?.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to login to demo account. Please try manual login.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const features = [
    { icon: Sparkles, color: "text-violet-500", bg: "bg-violet-500/10 dark:bg-violet-500/15", label: t("featAiTitle"), desc: t("featAiDesc") },
    { icon: MousePointer2, color: "text-indigo-500", bg: "bg-indigo-500/10 dark:bg-indigo-500/15", label: t("featDndTitle"), desc: t("featDndDesc") },
    { icon: Palette, color: "text-pink-500", bg: "bg-pink-500/10 dark:bg-pink-500/15", label: t("featThemeTitle"), desc: t("featThemeDesc") },
    { icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/15", label: t("featAnalyticsTitle"), desc: t("featAnalyticsDesc") },
    { icon: Shield, color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/15", label: t("featSecureTitle"), desc: t("featSecureDesc") },
    { icon: Code, color: "text-sky-500", bg: "bg-sky-500/10 dark:bg-sky-500/15", label: t("featEmbedTitle"), desc: t("featEmbedDesc") },
  ];

  const stats = [
    { value: "4,200+", label: "Forms built" },
    { value: "76%", label: "Avg. conversion" },
    { value: "12 types", label: "Field types" },
    { value: "∞", label: "Themes" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200 overflow-x-hidden">

      {/* ─── FLOATING HEADER ─── */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl w-full rounded-2xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30">
          <div className="flex h-14 items-center justify-between px-4 sm:px-5">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-300/30 dark:shadow-none">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-outfit text-[17px] font-bold tracking-tight text-foreground">
                Formu<span className="text-violet-500">.AI</span>
              </span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex gap-5 text-[13px] font-medium text-muted-foreground">
              <Link href="/explore" className="hover:text-foreground transition-colors">{t("navExplore")}</Link>
              <Link href="/themes" className="hover:text-foreground transition-colors">{t("navThemes")}</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">{t("navPricing")}</Link>
              <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                {t("navApiDocs")} <Code className="h-3 w-3" />
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {session ? (
                <Link href="/dashboard" className="inline-flex h-8 items-center justify-center rounded-lg bg-violet-600 px-4 text-[13px] font-semibold text-white hover:bg-violet-500 transition-colors">
                  {t("ctaStart")}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-[13px] font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    {t("login")}
                  </Link>
                  <button
                    onClick={handleDemoLogin}
                    disabled={isLoggingIn}
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-violet-600 px-4 text-[13px] font-semibold text-white hover:bg-violet-500 transition-colors disabled:opacity-60"
                  >
                    {isLoggingIn ? t("loggingIn") : t("tryDemo")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <main className="flex-1 pt-24">
        <section className="relative min-h-[88vh] flex items-center overflow-hidden">

          {/* Background canvas */}
          <div className="absolute inset-0 -z-10">
            {/* Large radial glow — violet */}
            <div className="absolute top-[-10%] left-[15%] h-[700px] w-[700px] rounded-full bg-violet-400/15 dark:bg-violet-600/10 blur-[120px]" />
            {/* Right side glow — indigo */}
            <div className="absolute bottom-[-5%] right-[5%] h-[500px] w-[500px] rounded-full bg-indigo-400/15 dark:bg-indigo-600/10 blur-[100px]" />
            {/* Grid lines */}
            <div
              className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(hsl(262 83% 58%) 1px, transparent 1px), linear-gradient(90deg, hsl(262 83% 58%) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 py-20">
            <div className="max-w-5xl mx-auto">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 dark:border-violet-600/30 bg-violet-50 dark:bg-violet-950/30 px-3.5 py-1.5 text-[11px] font-bold text-violet-700 dark:text-violet-300 tracking-wider uppercase mb-8">
                <Zap className="h-3 w-3" />
                {t("badgeText")}
              </div>

              {/* Main headline — split layout */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="font-outfit text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.07]">
                    {t("heroTitle")}
                  </h1>
                  <p className="mt-6 text-[17px] text-muted-foreground leading-relaxed max-w-lg">
                    {t("heroDescription")}
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    <button
                      onClick={handleDemoLogin}
                      disabled={isLoggingIn}
                      className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-[14px] font-bold text-white shadow-lg shadow-violet-400/25 dark:shadow-violet-800/30 hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {isLoggingIn ? t("loggingIn") : t("ctaStart")}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <Link
                      href="/explore"
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-6 text-[14px] font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      {t("navExplore")}
                    </Link>
                  </div>

                  {/* Trust signals */}
                  <div className="mt-8 flex flex-wrap gap-4">
                    {["No credit card", "1-min setup", "Open source"].map((item) => (
                      <span key={item} className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side — Dashboard preview card */}
                <div className="relative hidden lg:block">
                  {/* Glow behind card */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-400/20 to-indigo-400/20 dark:from-violet-600/10 dark:to-indigo-600/10 blur-2xl scale-95" />

                  <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/8 dark:shadow-black/40 overflow-hidden">
                    {/* Window chrome */}
                    <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/60 px-4">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="ml-3 font-mono text-[10px] text-muted-foreground select-none">formu.ai/dashboard/builder</span>
                    </div>

                    {/* Mock content */}
                    <div className="p-5 space-y-4">
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Submissions", value: "4,289", color: "text-violet-600 dark:text-violet-400", icon: FileText },
                          { label: "Conversion", value: "76.4%", color: "text-emerald-600 dark:text-emerald-400", icon: BarChart3 },
                          { label: "AI Insights", value: "Active", color: "text-indigo-600 dark:text-indigo-400", icon: Sparkles },
                        ].map(({ label, value, color, icon: Icon }) => (
                          <div key={label} className="rounded-xl border border-border bg-background/60 p-3">
                            <div className={`text-[10px] font-semibold uppercase tracking-wider ${color} mb-1`}>{label}</div>
                            <div className="text-base font-extrabold text-foreground font-outfit">{value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Mock form builder preview */}
                      <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-foreground">Customer Feedback Form</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            Live
                          </span>
                        </div>
                        {[
                          { type: "text", label: "Full Name", placeholder: "Your name…" },
                          { type: "email", label: "Email Address", placeholder: "hello@example.com" },
                          { type: "rating", label: "Overall Rating" },
                        ].map(({ label, placeholder, type }) => (
                          <div key={label} className="space-y-1">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
                            {type === "rating" ? (
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                  <div key={i} className={`h-5 w-5 rounded text-sm flex items-center justify-center ${i <= 4 ? "text-amber-400" : "text-muted-foreground/30"}`}>★</div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-7 rounded-lg border border-border bg-muted/50 px-2.5 text-[10px] text-muted-foreground/60 flex items-center">
                                {placeholder}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS STRIP ─── */}
        <section className="border-y border-border bg-card/70">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="font-outfit text-3xl font-extrabold text-foreground">{value}</div>
                  <div className="mt-1 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6">

            {/* Section label */}
            <div className="max-w-2xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/30 dark:border-indigo-600/20 bg-indigo-50 dark:bg-indigo-950/20 px-3 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">
                <GitBranch className="h-3 w-3" />
                Features
              </div>
              <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {t("featuresTitle")}
              </h2>
              <p className="mt-4 text-[16px] text-muted-foreground leading-relaxed">
                {t("featuresSubtitle")}
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, color, bg, label, desc }) => (
                <div
                  key={label}
                  className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-border/80 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Subtle gradient on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-transparent to-muted/30 pointer-events-none" />
                  <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-foreground text-[15px] mb-1.5">{label}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BOTTOM CTA ─── */}
        <section className="py-20 border-t border-border relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-violet-400/10 dark:bg-violet-600/8 blur-[100px]" />
          </div>
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-400/25 dark:shadow-violet-800/20 mb-6 mx-auto">
              <Globe2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ready to build your next form?
            </h2>
            <p className="mt-4 text-[16px] text-muted-foreground">
              Start free. No credit card required. Ship in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDemoLogin}
                disabled={isLoggingIn}
                className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 text-[14px] font-bold text-white shadow-lg shadow-violet-400/25 dark:shadow-violet-800/25 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isLoggingIn ? t("loggingIn") : "Try the Demo"} <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-7 text-[14px] font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border bg-card/60 py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-foreground">Formu<span className="text-violet-500">.AI</span></span>
            <span className="hidden sm:inline text-muted-foreground/50">·</span>
            <span className="hidden sm:inline">{t("rights") || "© 2026 All rights reserved."}</span>
          </div>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
          </div>

          <div className="flex gap-5">
            <Link href="/explore" className="hover:text-foreground transition-colors">{t("navExplore")}</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">{t("navPricing")}</Link>
            <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              API <Lock className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
