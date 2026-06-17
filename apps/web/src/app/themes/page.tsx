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
                
                {/* Visual Form Preview with the Theme Applied */}
                <div 
                  className="mt-6 border border-border p-4 relative overflow-hidden flex flex-col justify-between"
                  style={{ 
                    backgroundColor: theme.backgroundColor, 
                    borderRadius: theme.borderRadius,
                    minHeight: "220px"
                  }}
                >
                  {/* Mini Form Card inside the container */}
                  <div 
                    className="p-4 border border-border/20 shadow-sm space-y-3.5 flex-1 flex flex-col justify-between"
                    style={{ 
                      backgroundColor: theme.cardColor,
                      borderRadius: `calc(${theme.borderRadius} - 4px)`
                    }}
                  >
                    {/* Header */}
                    <div className="space-y-1">
                      <div 
                        className="h-3.5 w-2/3 font-semibold text-xs tracking-tight truncate"
                        style={{ color: theme.primaryColor }}
                      >
                        Sample Survey Form
                      </div>
                      <div className="h-2 w-1/2 bg-muted-foreground/20 rounded-sm" />
                    </div>

                    {/* Form Fields Mock */}
                    <div className="space-y-2.5">
                      {/* Text Input field */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-1/4 bg-muted-foreground/30 rounded-sm" />
                        <div 
                          className="h-7 w-full rounded border border-border/30 bg-background/50 px-2 text-[9px] flex items-center text-muted-foreground select-none pointer-events-none"
                          style={{ borderRadius: `calc(${theme.borderRadius} - 6px)` }}
                        >
                          Placeholder text...
                        </div>
                      </div>

                      {/* Choice items */}
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded border border-border/30 bg-background/50 flex items-center justify-center shrink-0"
                          style={{ borderRadius: `calc(${theme.borderRadius} - 8px)` }}
                        >
                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                        </div>
                        <div className="h-1.5 w-1/3 bg-muted-foreground/20 rounded-sm" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div 
                      className="h-8 w-full text-[10px] font-bold flex items-center justify-center text-white shadow-sm select-none pointer-events-none"
                      style={{ 
                        backgroundColor: theme.primaryColor,
                        borderRadius: `calc(${theme.borderRadius} - 6px)`
                      }}
                    >
                      Submit Response
                    </div>
                  </div>
                </div>

                  <div className="mt-6 space-y-2 text-sm border-t border-border pt-4 text-muted-foreground">
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
