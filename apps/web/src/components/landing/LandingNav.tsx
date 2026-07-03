"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Code, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";

let isFirstMount = true;

export function LandingNav() {
  const { data: session } = useSession();
  const [shouldAnimate] = React.useState(isFirstMount);

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    isFirstMount = false;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position immediately
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const router = useRouter();
  const pathname = usePathname();
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
      initial={shouldAnimate ? { opacity: 0, y: -12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "top-4 px-4 sm:px-6" : "top-0 px-0"
      }`}
    >
      <div
        className={`mx-auto w-full transition-all duration-300 ${
          isScrolled
            ? "max-w-6xl rounded-2xl border border-border bg-background/80 backdrop-blur-xl"
            : "max-w-full rounded-none border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <div className={`flex h-14 items-center justify-between transition-all duration-300 container mx-auto px-4 sm:px-6 max-w-6xl`
        }>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="sm" />
          </Link>
          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.target}
                  className={`relative py-1.5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/raaam02/sec-form"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex h-8 w-8 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
                  className="hidden md:inline-flex h-8 items-center rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
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
