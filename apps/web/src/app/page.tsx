"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Sparkles, FileText, BarChart3, Shield, Palette, Code, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

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
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
              Formu.AI
            </span>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/explore" className="hover:text-indigo-600 transition-colors">Explore Templates</Link>
            <Link href="/themes" className="hover:text-indigo-600 transition-colors">Theme Gallery</Link>
            <Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
            <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              API Docs <Code className="h-3 w-3" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Log in
                </Link>
                <button
                  onClick={handleDemoLogin}
                  disabled={isLoggingIn}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoggingIn ? "Logging in..." : "Try Demo"}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Decorative Gradients */}
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute right-0 top-10 h-[400px] w-[400px] rounded-full bg-purple-200/20 blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div className="mx-auto max-w-4xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-600/10">
                <Sparkles className="h-3 w-3" /> Next-Generation Form builder
              </span>
              <h1 className="mt-6 font-outfit text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Create Stunning Forms in Seconds using{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Generative AI
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
                Draft a questionnaire from a prompt, customize with drag & drop builder, apply beautiful preset themes, and unlock deep insights from responses automatically.
              </p>
              
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleDemoLogin}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all transform hover:-translate-y-0.5"
                >
                  Start Building with AI <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  href="/explore"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Explore Templates
                </Link>
              </div>
            </div>

            {/* Dashboard Mockup Preview */}
            <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-200/80 bg-white/40 p-4 shadow-xl shadow-slate-100 backdrop-blur-sm">
              <div className="rounded-xl border border-slate-200 bg-white shadow-inner overflow-hidden">
                {/* Simulated window bar */}
                <div className="flex h-11 items-center justify-between border-b border-slate-100 bg-slate-50 px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-xs text-slate-400 select-none">http://formu.ai/dashboard</span>
                  <div className="w-12" />
                </div>
                {/* Mock Image Placeholder using generative_image context conceptually */}
                <div className="p-8 bg-slate-50/50 flex flex-col gap-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 font-outfit">My Forms Dashboard</h3>
                      <p className="text-xs text-slate-400">Manage your dynamic forms and AI summaries</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                      Live
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center"><FileText className="h-4 w-4 text-indigo-600" /></div>
                        <div>
                          <div className="text-xs text-slate-400">Total Submissions</div>
                          <div className="text-lg font-bold text-slate-800">4,289</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center"><BarChart3 className="h-4 w-4 text-emerald-600" /></div>
                        <div>
                          <div className="text-xs text-slate-400">Avg. Conversion</div>
                          <div className="text-lg font-bold text-slate-800">76.4%</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center"><Sparkles className="h-4 w-4 text-purple-600" /></div>
                        <div>
                          <div className="text-xs text-slate-400">AI Insights Run</div>
                          <div className="text-lg font-bold text-slate-800">Active</div>
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
        <section className="bg-white py-20 lg:py-28 border-y border-slate-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-outfit text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Loaded with features for high conversion rates
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                A simple, elegant way to build questionnaires, gather user response files, and run statistical analytics on submissions.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center"><Sparkles className="h-5 w-5 text-indigo-600" /></div>
                <h3 className="font-outfit font-semibold text-slate-950 text-lg">AI Form Generator</h3>
                <p className="text-slate-600 text-sm">
                  Write what you need in plain text, e.g. "Create a restaurant feedback form", and let AI build questions and validation types.
                </p>
              </div>
              {/* Card 2 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center"><FileText className="h-5 w-5 text-violet-600" /></div>
                <h3 className="font-outfit font-semibold text-slate-950 text-lg">Drag & Drop Builder</h3>
                <p className="text-slate-600 text-sm">
                  Organize, reorder, delete, and add fields instantly using a flexible and clean builder workspace.
                </p>
              </div>
              {/* Card 3 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Palette className="h-5 w-5 text-emerald-600" /></div>
                <h3 className="font-outfit font-semibold text-slate-950 text-lg">Instant Themes</h3>
                <p className="text-slate-600 text-sm">
                  Apply built-in professional palettes immediately or use the AI theme generator to style with custom branding.
                </p>
              </div>
              {/* Card 4 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center"><BarChart3 className="h-5 w-5 text-blue-600" /></div>
                <h3 className="font-outfit font-semibold text-slate-950 text-lg">Recharts Analytics</h3>
                <p className="text-slate-600 text-sm">
                  Track response conversion rates, daily submission counts, and rating distributions using responsive graphs.
                </p>
              </div>
              {/* Card 5 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center"><Shield className="h-5 w-5 text-amber-600" /></div>
                <h3 className="font-outfit font-semibold text-slate-950 text-lg">Visibility Toggles</h3>
                <p className="text-slate-600 text-sm">
                  Manage drafts privately, publish to explore index pages, or share hidden forms using unlisted links.
                </p>
              </div>
              {/* Card 6 */}
              <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center"><Code className="h-5 w-5 text-pink-600" /></div>
                <h3 className="font-outfit font-semibold text-slate-950 text-lg">Developer Integrations</h3>
                <p className="text-slate-600 text-sm">
                  Copy iframe embed codes, scan shareable QR codes, or leverage the Scalar OpenAPI documentation to sync database feeds.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-100 py-10">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Formu.AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/explore" className="hover:text-indigo-600">Explore Templates</Link>
            <Link href="/pricing" className="hover:text-indigo-600">Pricing</Link>
            <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
