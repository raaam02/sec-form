"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BUILTIN_THEMES } from "@sec-form/shared";
import { Palette, Sparkles, Code } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function ThemesPage() {
  const { data: session } = useSession();
  const router = useRouter();
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

      <main className="flex-1 py-16 pt-28 container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Theme Gallery
          </h1>
          <p className="mt-3 text-muted-foreground">
            Examine our built-in CSS styling presets. Applied directly to public forms to alter backgrounds, typography, and borders instantly.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUILTIN_THEMES.map((theme) => (
            <div
              key={theme.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-outfit text-lg font-bold text-foreground">{theme.name}</h3>
                </div>
                
                {/* Visual Palette Preview */}
                 <div className="mt-6 rounded-xl border border-border p-4 bg-muted/50 space-y-4">
                   <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Colors</span>
                    <span>Values</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-muted-foreground">Primary Accent</span>
                      <div className="flex items-center gap-2">
                         <span className="font-mono text-xs text-muted-foreground">{theme.primaryColor}</span>
                         <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: theme.primaryColor }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                       <span className="text-muted-foreground">Background</span>
                      <div className="flex items-center gap-2">
                         <span className="font-mono text-xs text-muted-foreground">{theme.backgroundColor}</span>
                         <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: theme.backgroundColor }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                       <span className="text-muted-foreground">Card Base</span>
                      <div className="flex items-center gap-2">
                         <span className="font-mono text-xs text-muted-foreground">{theme.cardColor}</span>
                         <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: theme.cardColor }} />
                      </div>
                    </div>
                  </div>
                </div>

                 <div className="mt-6 space-y-2 text-sm border-t border-border pt-4 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Font Family:</span>
                     <span className="font-semibold text-foreground">{theme.fontFamily.split(",")[0]}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Border Radius:</span>
                     <span className="font-semibold text-foreground">{theme.borderRadius}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                 <Link
                   href="/login"
                   className="block w-full text-center py-2 bg-indigo-600/10 dark:bg-indigo-950/30 hover:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 font-semibold text-sm rounded-xl transition-colors"
                 >
                  Apply Theme in Builder
                </Link>
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
