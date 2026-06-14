"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FORM_TEMPLATES } from "@sec-form/shared";
import { Copy, Sparkles, Code } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function ExplorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  const categories = ["All", ...Array.from(new Set(FORM_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates = selectedCategory === "All"
    ? FORM_TEMPLATES
    : FORM_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = async (templateId: string) => {
    if (!session) {
      router.push("/login?redirect=/dashboard");
      return;
    }
    router.push(`/dashboard?createTemplate=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
      
      {/* FLOATING HEADER */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl w-full rounded-2xl border border-border bg-card/75 backdrop-blur-md shadow-sm transition-colors duration-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-200 dark:shadow-none">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight text-foreground">
                Formu.AI
              </span>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Explore Templates</Link>
              <Link href="/themes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Theme Gallery</Link>
              <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
              <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                API Docs <Code className="h-3 w-3" />
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
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
                    className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Log in
                  </Link>
                  <button
                    onClick={handleDemoLogin}
                    disabled={isLoggingIn}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 dark:shadow-none hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoggingIn ? "Logging in..." : "Try Demo"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 pt-28 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-5xl">
            Template Gallery
          </h1>
          <p className="mt-3 text-slate-600 dark:text-zinc-400">
            Kickstart your collection workflows with pre-built form configurations crafted by industry experts.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                  : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    {template.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">{template.fields.length} questions</span>
                </div>
                <h3 className="mt-4 font-outfit text-xl font-bold text-foreground">{template.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm line-clamp-2 min-h-[40px]">{template.description}</p>
                
                <div className="mt-5 border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                    Form Layout Preview
                  </span>
                  <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                    {template.fields.slice(0, 3).map((f) => (
                      <div key={f.id} className="space-y-1">
                        {f.type !== "checkbox" && (
                          <label className="text-[9px] font-bold text-muted-foreground block truncate">
                            {f.label} {f.required && <span className="text-rose-500">*</span>}
                          </label>
                        )}
                        {f.type === "textarea" ? (
                          <div className="h-10 w-full rounded border border-border bg-card px-2 py-1 text-[9px] text-muted-foreground flex items-start truncate select-none pointer-events-none">
                            {f.placeholder || "Enter details..."}
                          </div>
                        ) : f.type === "select" || f.type === "multiselect" ? (
                          <div className="h-7 w-full rounded border border-border bg-card px-2 text-[9px] text-muted-foreground flex items-center justify-between select-none pointer-events-none">
                            <span className="truncate">Select option...</span>
                            <span className="text-[8px] text-muted-foreground shrink-0">▼</span>
                          </div>
                        ) : f.type === "checkbox" ? (
                          <div className="flex items-center gap-2 py-0.5 select-none pointer-events-none">
                            <div className="h-3 w-3 rounded border border-border bg-card shrink-0" />
                            <span className="text-[9px] font-bold text-muted-foreground truncate">{f.label}</span>
                          </div>
                        ) : f.type === "rating" ? (
                          <div className="flex gap-0.5 items-center select-none pointer-events-none">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <span key={i} className="text-amber-400 text-xs">★</span>
                            ))}
                          </div>
                        ) : (
                          <div className="h-7 w-full rounded border border-border bg-card px-2 text-[9px] text-muted-foreground flex items-center truncate select-none pointer-events-none">
                            {f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="h-7 w-full rounded bg-indigo-600/10 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center text-[10px] font-bold mt-1.5 select-none pointer-events-none">
                      Submit
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex gap-2">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
                >
                  <Copy className="h-4 w-4" /> Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-muted/50 py-6 text-center text-muted-foreground text-xs">
        <p>© 2026 Formu.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
