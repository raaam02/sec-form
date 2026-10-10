"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Github } from "lucide-react";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { saveLocalForm } from "@/utils/localForms";

let isFirstMount = true;

export function LandingNav() {
  const { data: session } = useSession();
  const { isOpen, openAuthModal } = useAuthModal();
  const [shouldAnimate] = useState(isFirstMount);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Landing");

  useEffect(() => {
    isFirstMount = false;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleStartBuilding = () => {
    const id = crypto.randomUUID();
    const localForm = {
      id,
      title: "Untitled Form",
      description: "",
      slug: `form-${Math.random().toString(36).substring(2, 8)}`,
      visibility: "draft" as const,
      schemaJson: {
        fields: [
          {
            id: crypto.randomUUID(),
            type: "text" as const,
            label: "Untitled Question",
            required: false,
            placeholder: "Type your answer here...",
          },
        ],
      },
      userId: session?.user?.id || "local-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveLocalForm(localForm);
    router.push(`/dashboard/my-forms/${id}/edit`);
  };

  const NAV_LINKS = [
    { href: "/explore", label: t("navExplore") || "Explore", target: "_self" },
    { href: "/themes", label: t("navThemes") || "Themes", target: "_self" },
    { href: "/pricing", label: t("navPricing") || "Pricing", target: "_self" },
  ];

  return (
    <motion.header
      initial={shouldAnimate ? { opacity: 0, y: -8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "top-3 sm:top-4 px-3 sm:px-6" : "top-2 px-0"
      }`}
    >
      <div
        className={`mx-auto w-full transition-all duration-300 ${
          isScrolled
            ? "max-w-5xl rounded-3xl border border-border/70 bg-background/80 shadow-md backdrop-blur-xl ring-1 ring-white/[0.05]"
            : "max-w-6xl rounded-none border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo size="sm" />
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.target}
                  rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                  className={`transition-colors hover:text-foreground py-1 ${
                    isActive ? "text-foreground font-semibold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com/raaam02/sec-form"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex h-8.5 w-8.5 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </a>

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-8.5 items-center rounded-xl border border-border/80 bg-card/60 px-3.5 text-xs font-semibold text-foreground transition hover:bg-card hover:border-foreground/20"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex h-8.5 items-center rounded-xl px-2.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative inline-flex items-center justify-center">
                  <AnimatePresence initial={false}>
                    {!isOpen && (
                      <motion.div
                        layoutId="auth-modal"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          mass: 0.8,
                        }}
                        style={{ borderRadius: "12px" }}
                        className="absolute inset-0 bg-card border border-border/70 transform-gpu will-change-transform shadow-xs"
                      />
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="relative z-10 inline-flex h-8.5 items-center rounded-xl px-3 sm:px-3.5 text-xs font-semibold text-foreground transition hover:opacity-80 active:scale-95"
                  >
                    {t("login") || "Log in"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleStartBuilding}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-foreground px-3.5 sm:px-4 text-xs font-semibold text-background shadow-sm transition hover:opacity-90 active:scale-[0.98]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Form</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
