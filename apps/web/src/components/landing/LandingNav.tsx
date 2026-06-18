"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Code } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";

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
            <Logo size="sm" />
          </Link>
          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-[13px] font-medium text-muted-foreground">
            <Link href="/explore" className="hover:text-foreground transition-colors">{t("navExplore")}</Link>
            <Link href="/themes" className="hover:text-foreground transition-colors">{t("navThemes")}</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">{t("navPricing")}</Link>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/docs`}
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
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex h-8 items-center rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Log Out
                </button>
              </div>
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
