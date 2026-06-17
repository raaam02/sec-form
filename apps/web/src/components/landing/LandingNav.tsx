"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Sparkles, Code } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslations } from "next-intl";

export function LandingNav() {
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
        callbackUrl: "/dashboard" 
      });
    } catch (e) {
      console.error(e);
      setIsLoggingIn(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl w-full rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-outfit text-[17px] font-bold tracking-tight">
              Formu<span className="text-primary">.AI</span>
            </span>
          </Link>
          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-[13px] font-medium text-muted-foreground">
            <Link href="/explore" className="hover:text-foreground transition-colors">{t("navExplore")}</Link>
            <Link href="/themes" className="hover:text-foreground transition-colors">{t("navThemes")}</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">{t("navPricing")}</Link>
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              {t("navApiDocs")} <Code className="h-3 w-3" />
            </a>
          </nav>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex h-8 items-center rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("ctaStart")}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {t("login")}
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDemoLogin}
                  disabled={isLoggingIn}
                  className="hidden sm:inline-flex h-8 items-center rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {isLoggingIn ? t("loggingIn") : t("tryDemo")}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
