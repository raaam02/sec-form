"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactAdminModal } from "../../components/builder/ContactAdminModal";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [contactPlan, setContactPlan] = useState<"general" | "pro" | "enterprise">("pro");

  const tPricing = useTranslations("Pricing");

  const handleDemoLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await signIn("credentials", {
        email: "demo@demo.com",
        password: "demo123",
        redirect: false
      });
      if (res?.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to login to demo account. Please try manual login.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const tiers = [
    {
      name: tPricing("plans.free.name"),
      price: tPricing("plans.free.price"),
      description: tPricing("plans.free.desc"),
      features: [
        "Up to 5 active forms",
        "2 Ai form generation",
        "100 submissions per month",
        "Standard templates library",
        "Rate limiting validation",
        "Full theme & color customization",
      ],
      cta: tPricing("getStarted"),
      href: "/signup",
      popular: false
    },
    {
      name: tPricing("plans.pro.name"),
      price: tPricing("plans.pro.price"),
      description: tPricing("plans.pro.desc"),
      features: [
        "Unlimited active forms",
        "Unlimited submissions",
        "20 Ai form generation",
        "AI Insights report engine",
        "Recharts Analytics dashboard",
        "Custom URLs & Custom slugs",
        "CSV submissions exports",
      ],
      cta: "Contact Admin",
      href: "/contact?plan=pro",
      popular: true
    },
    {
      name: tPricing("plans.enterprise.name"),
      price: tPricing("plans.enterprise.price"),
      description: tPricing("plans.enterprise.desc"),
      features: [
        "Everything in Pro",
        "Dedicated database clusters",
        "Premium SLA support",
        "Custom API developer access",
        "Custom SAML/SSO authentication",
        "Advanced Redis rate limits",
      ],
      cta: "Contact Admin",
      href: "/contact?plan=enterprise",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
      <main className="flex-1 py-16 pt-28 container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {tPricing("title")}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            {tPricing("subtitle")}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl bg-card border p-8 shadow-sm flex flex-col justify-between relative ${
                tier.popular 
                  ? "border-primary ring-2 ring-indigo-600/10 dark:ring-indigo-500/20" 
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground uppercase tracking-wider">
                  {tPricing("mostPopular")}
                </span>
              )}
              <div>
                <h3 className="font-outfit text-2xl font-bold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-muted-foreground text-sm">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-outfit text-foreground">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-muted-foreground text-sm">/{tPricing("billingMonthly")}</span>}
                </div>
                
                <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={tier.href}
                  onClick={(e) => {
                    if (session && tier.href.startsWith("/contact")) {
                      e.preventDefault();
                      const plan = tier.href.includes("plan=enterprise") ? "enterprise" : "pro";
                      setContactPlan(plan);
                      setShowContactAdminModal(true);
                    }
                  }}
                  className={`block w-full py-3 text-center rounded-xl font-semibold text-sm transition-all ${
                    tier.popular
                      ? "bg-primary text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-primary/80"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ContactAdminModal
        isOpen={showContactAdminModal}
        onOpenChange={setShowContactAdminModal}
        defaultPlan={contactPlan}
      />
    </div>
  );
}
