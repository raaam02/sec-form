import React from "react";
import Link from "next/link";
import { Github, Code, ExternalLink } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ColorThemeSwitcher } from "@/components/ColorThemeSwitcher";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";

const apiDocsUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/docs`;

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const NAV_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Templates", href: "/explore" },
      { label: "Theme Gallery", href: "/themes" },
      { label: "Pricing Plans", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Documentation", href: apiDocsUrl, external: true },
      { label: "LLMs Protocol", href: "/llms.txt", external: true },
      { label: "REST Endpoints", href: apiDocsUrl, external: true },
      { label: "GitHub Repository", href: "https://github.com/raaam02/sec-form", external: true },
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
    <footer className="border-t border-border/70 bg-card/40 relative overflow-hidden">
      {/* Top Main Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 pt-16 sm:pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5 w-fit">
                <Logo size="md" />
              </Link>
              <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                The modern, open source AI form builder.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Navigation Columns (7 cols split across 3 columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {NAV_COLUMNS.map((col) => (
              <div key={col.title} className="space-y-3.5">
                <h4 className="text-sm font-semibold tracking-wider text-foreground">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map(({ label, href, external }) => (
                    <li key={label}>
                      {external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                        >
                          <span>{label}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-40 group-hover:opacity-80 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
      </div>

      {/* Tasteful Brand Watermark (Subtle and proportionate) */}
      <div className="flex items-center justify-center overflow-hidden pointer-events-none select-none py-2" aria-hidden>
        <span className="font-outfit font-black text-[14vw] leading-none tracking-tighter text-foreground/[0.025] dark:text-foreground/[0.035] whitespace-nowrap">
          Formu.AI
        </span>
      </div>

      {/* Bottom Legal Strip */}
      <div className="border-t border-border/50 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{t("rights") || "© 2026 Formu.AI. All rights reserved."}</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
