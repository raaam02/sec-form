"use client";

/**
 * Landing page — thin orchestrator.
 * All sections are isolated, reusable components under `components/landing/`.
 * Header (LandingNav) and Footer (LandingFooter) are provided by the (public) route group layout.
 */

import { LandingHero } from "@/components/landing/LandingHero";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCTA } from "@/components/landing/LandingCTA";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingStats />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingFAQ />
      <LandingCTA />
    </>
  );
}
