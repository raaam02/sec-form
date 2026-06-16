"use client";

import React from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * Shared wrapper for all public-facing pages (Explore, Themes, Pricing, etc.)
 * Provides the same floating nav and rich footer as the landing page.
 */
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
