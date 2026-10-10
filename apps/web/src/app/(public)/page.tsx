/**
 * Landing page — thin orchestrator (server component; each section is its own client component).
 * Header (LandingNav) and footer (LandingFooter) come from the (public) route-group layout.
 */
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingTrustBar } from "@/components/landing/LandingTrustBar";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingCTA } from "@/components/landing/LandingCTA";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingTrustBar />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingFAQ />
      <LandingCTA />
    </>
  );
}
