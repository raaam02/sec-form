"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BUILTIN_THEMES } from "@sec-form/shared";
import { Palette, Sparkles, Code } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function ThemesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const tLanding = useTranslations("Landing");
  const tThemes = useTranslations("Themes");

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
      <main className="flex-1 py-16 pt-28 container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {tThemes("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {tThemes("subtitle")}
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
                  {tThemes("applyTheme")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
