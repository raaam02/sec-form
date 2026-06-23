"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Code, Github } from "lucide-react";
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

  const NAV_LINKS = [
    {
      href: "/explore",
      label: t("navExplore"),
      target: "_self",
    },
    {
      href: "/themes",
      label: t("navThemes"),
      target: "_self",
    },
    {
      href: "/pricing",
      label: t("navPricing"),
      target: "_self",
    },
    {
      href: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/docs`,
      label: t("navApiDocs"),
      target: "_blank",
    }
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl w-full rounded-2xl border border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="sm" />
          </Link>
          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-[13px] font-medium text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} target={link.target} className="hover:text-foreground transition-colors">{link.label}</Link>
            ))}
          </nav>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/raaam02/sec-form"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
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
                  className="hidden sm:inline-flex h-8 items-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground px-4 text-[13px] font-semibold transition-colors disabled:opacity-60"
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
