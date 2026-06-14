"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Sparkles, FileText, BarChart3, Shield, Palette, Code, ArrowRight } from "lucide-react";
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
        redirect: false
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* HEADER NAVIGATION */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl w-full rounded-2xl border border-border bg-card/75 backdrop-blur-md shadow-sm transition-colors duration-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-200 dark:shadow-none">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight text-foreground">
                {t("logo") || "Formu.AI"}
              </span>
            </div>

            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {t("navExplore")}
              </Link>
              <Link href="/themes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {t("navThemes")}
              </Link>
              <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {t("navPricing")}
              </Link>
              <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                {t("navApiDocs")} <Code className="h-3 w-3" />
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  {t("ctaStart")}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {t("login")}
                  </Link>
                  <button
                    onClick={handleDemoLogin}
                    disabled={isLoggingIn}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 dark:shadow-none hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoggingIn ? t("loggingIn") : t("tryDemo")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 pt-20">
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Decorative Gradients */}
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-200/20 dark:bg-indigo-990/10 blur-3xl" />
          <div className="absolute right-0 top-10 h-[400px] w-[400px] rounded-full bg-purple-200/20 dark:bg-purple-990/10 blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div className="mx-auto max-w-4xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-500/20">
                <Sparkles className="h-3 w-3" /> {t("badgeText")}
              </span>
              <h1 className="mt-6 font-outfit text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {t("heroTitle")}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                {t("heroDescription")}
              </p>
              
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleDemoLogin}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-500 transition-all transform hover:-translate-y-0.5"
                >
                  {t("ctaStart")} <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/explore"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-6 font-semibold text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {t("navExplore")}
                </Link>
              </div>
            </div>

            {/* Dashboard Mockup Preview */}
            <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-border bg-card/40 p-4 shadow-sm backdrop-blur-sm">
              <div className="rounded-xl border border-border bg-card shadow-inner overflow-hidden">
                {/* Simulated window bar */}
                <div className="flex h-11 items-center justify-between border-b border-border bg-muted/80 px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground select-none">http://formu.ai/dashboard</span>
                  <div className="w-12" />
                </div>
                {/* Mock Image Placeholder */}
                <div className="p-8 bg-muted/50 flex flex-col gap-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-outfit">{t("mockDashboardTitle")}</h3>
                      <p className="text-xs text-muted-foreground">{t("mockDashboardSubtitle")}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-500/20">
                      {t("mockLive")}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center"><FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /></div>
                        <div>
                          <div className="text-xs text-muted-foreground">{t("mockSubmissions")}</div>
                          <div className="text-lg font-bold text-foreground">4,289</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center"><BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /></div>
                        <div>
                          <div className="text-xs text-muted-foreground">{t("mockConversion")}</div>
                          <div className="text-lg font-bold text-foreground">76.4%</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center"><Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>
                        <div>
                          <div className="text-xs text-muted-foreground">{t("mockAiInsights")}</div>
                          <div className="text-lg font-bold text-foreground">{t("mockActive")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="bg-card py-20 lg:py-28 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-outfit text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("featuresTitle")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("featuresSubtitle")}
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center"><Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /></div>
                <h3 className="font-outfit font-semibold text-foreground text-lg">{t("featAiTitle")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("featAiDesc")}
                </p>
              </div>
              {/* Card 2 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center"><FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" /></div>
                <h3 className="font-outfit font-semibold text-foreground text-lg">{t("featDndTitle")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("featDndDesc")}
                </p>
              </div>
              {/* Card 3 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center"><Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div>
                <h3 className="font-outfit font-semibold text-foreground text-lg">{t("featThemeTitle")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("featThemeDesc")}
                </p>
              </div>
              {/* Card 4 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center"><BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
                <h3 className="font-outfit font-semibold text-foreground text-lg">{t("featAnalyticsTitle")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("featAnalyticsDesc")}
                </p>
              </div>
              {/* Card 5 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center"><Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" /></div>
                <h3 className="font-outfit font-semibold text-foreground text-lg">{t("featSecureTitle")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("featSecureDesc")}
                </p>
              </div>
              {/* Card 6 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center"><Code className="h-5 w-5 text-pink-600 dark:text-pink-400" /></div>
                <h3 className="font-outfit font-semibold text-foreground text-lg">{t("featEmbedTitle")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("featEmbedDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-muted py-10 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p>{t("rights") || "© 2026 Formu.AI. All rights reserved."}</p>
            <LocaleSwitcher />
          </div>
          <div className="flex gap-4">
            <Link href="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              {t("navExplore")}
            </Link>
            <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              {t("navPricing")}
            </Link>
            <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              {t("navApiDocs")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
