"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Github, Twitter, Code, Lock } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";

const NAV_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Templates", href: "/dashboard/explore" },
      { label: "Theme Gallery", href: "/themes" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Docs", href: "http://localhost:4000/docs", external: true },
      { label: "REST API", href: "http://localhost:4000/docs", external: true },
      { label: "Webhooks", href: "/docs/webhooks" },
      { label: "Open Source", href: "https://github.com", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function LandingFooter() {
  const t = useTranslations("Landing");

  return (
    <footer className="border-t border-border bg-card/60 relative overflow-hidden">
      {/* Giant brand watermark */}
      <div
        aria-hidden
        className="absolute top-28 inset-0 flex items-end pb-[88px] sm:pb-[60px] md:pb-[41px] justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-outfit font-black text-[22vw] sm:text-[18vw] leading-none tracking-tighter text-foreground/[0.035] dark:text-foreground/[0.04] whitespace-nowrap translate-y-2">
          Formu.AI
        </span>
      </div>

      {/* Top section */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10 pt-16 pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="font-outfit text-[20px] font-black tracking-tight">
                Formu<span className="text-primary">.AI</span>
              </span>
            </Link>

            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[260px]">
              The intelligent form builder powered by Gemini AI. Create, style, and analyze forms in minutes.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {[
                { icon: Github, label: "GitHub", href: "https://github.com" },
                { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                { icon: Code, label: "API", href: "http://localhost:4000/docs" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-8 w-8 rounded-lg border border-border backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>

            <LocaleSwitcher />
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        {label}
                        {label.includes("API") || label.includes("Open Source") ? (
                          <Lock className="h-2.5 w-2.5 opacity-50" />
                        ) : null}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-border/50 mt-36">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-muted-foreground relative z-10">
          <span>{t("rights")}</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/sitemap" className="hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
