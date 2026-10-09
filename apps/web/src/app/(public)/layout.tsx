import React from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav />
      <main className="flex-1 pt-16 sm:pt-24">{children}</main>
      <LandingFooter />
    </div>
  );
}
