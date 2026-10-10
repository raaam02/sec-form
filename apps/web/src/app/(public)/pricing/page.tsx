"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, HelpCircle, ChevronDown, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ContactAdminModal } from "@/components/builder/ContactAdminModal";

interface PlanItem {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  cta: string;
  href: string;
}

const STATIC_PLANS: PlanItem[] = [
  {
    id: "free",
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Ideal for personal projects, quick prototypes, and test surveys.",
    features: [
      "Up to 5 active forms",
      "100 submissions per month",
      "Full theme & color palette customization",
      "Standard templates gallery",
      "Rate-limited security guards",
      "Instant 1-line script embed",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    id: "pro",
    name: "Professional",
    monthlyPrice: 19,
    annualPrice: 15,
    badge: "Most Popular",
    description: "For creators, startups, and companies that collect data at scale.",
    features: [
      "Unlimited active forms",
      "Unlimited submissions",
      "AI Schema prompt generator",
      "AI Response sentiment summaries",
      "Live analytics & conversion tracking",
      "Telegram instant webhook notifications (<100ms)",
      "CSV & JSON data exports",
      "Custom slugs & vanity form URLs",
    ],
    cta: "Upgrade to Pro",
    href: "/contact?plan=pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 79,
    annualPrice: 65,
    badge: "Scale & SLA",
    description: "For organizations requiring custom compliance, SLA, and self-hosting support.",
    features: [
      "Everything in Professional",
      "Dedicated database & Redis tier",
      "Priority 24/7 SLA engineering support",
      "Custom domain whitelisting & CORS",
      "REST API developer keys & webhooks",
      "Docker self-host deployment assistance",
      "SAML / SSO team authentication",
    ],
    cta: "Contact Enterprise",
    href: "/contact?plan=enterprise",
    popular: false,
  },
];

const PRICING_FAQS = [
  {
    q: "Can I try Formu.AI without a credit card?",
    a: "Yes! The Starter tier is completely free forever without entering payment details. You can create up to 5 forms and accept 100 submissions each month.",
  },
  {
    q: "Can I embed forms into Webflow, WordPress, or React?",
    a: "Yes, every plan includes universal embed support. You can use our lightweight 1-line script tag or iframe anywhere.",
  },
  {
    q: "How does the Telegram instant webhook work?",
    a: "With our Telegram integration, new form submissions trigger push notifications straight to your Telegram chat or team channel within 100ms.",
  },
  {
    q: "Can I cancel or upgrade anytime?",
    a: "Yes, you can upgrade, downgrade, or cancel your subscription whenever your workflow demands require it.",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [contactPlan, setContactPlan] = useState<"general" | "pro" | "enterprise">("pro");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tPricing = useTranslations("Pricing");
  const locale = useLocale();

  const currencySymbol = locale === "hi" ? "₹" : "$";
  const currencyRate = locale === "hi" ? 85 : 1;

  return (
    <div className="pt-32 sm:pt-36 pb-24 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          {tPricing("title")}
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg">
          {tPricing("subtitle")}
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 inline-flex items-center rounded-full bg-muted/50 p-1 border border-border/40">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              billingCycle === "annual"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Annual billing</span>
            <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.2 font-mono">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {STATIC_PLANS.map((plan) => {
          const rawPrice = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
          const displayPrice = rawPrice === 0 ? "Free" : `${currencySymbol}${rawPrice * currencyRate}`;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? "border-2 border-foreground bg-card shadow-xl shadow-black/5 dark:shadow-black/25 md:-translate-y-2"
                  : "border border-border/40 bg-card/60 hover:border-border hover:bg-card/90"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground text-background px-3 py-0.5 text-[11px] font-semibold tracking-wide">
                  {plan.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <Sparkles className="h-4 w-4 text-primary" />
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-border/30 flex items-baseline gap-1.5">
                  <span className="font-outfit text-4xl font-extrabold text-foreground tracking-tight">
                    {displayPrice}
                  </span>
                  {rawPrice > 0 && (
                    <span className="text-xs text-muted-foreground font-mono">
                      /month {billingCycle === "annual" ? "(billed yearly)" : ""}
                    </span>
                  )}
                </div>

                {/* Feature checklist */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                    What&apos;s included:
                  </span>
                  <ul className="space-y-2 text-xs text-foreground">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-border/30">
                <Link
                  href={plan.href}
                  onClick={(e) => {
                    if (session && plan.href.startsWith("/contact")) {
                      e.preventDefault();
                      setContactPlan(plan.id === "enterprise" ? "enterprise" : "pro");
                      setShowContactAdminModal(true);
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    plan.popular
                      ? "bg-foreground text-background hover:opacity-90"
                      : "bg-muted/70 text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="mt-16 rounded-3xl bg-muted/30 border border-border/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-outfit font-bold text-base text-foreground">
              Need custom volume or on-premise hosting?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              We offer bespoke contracts, invoice payments, and dedicated security reviews.
            </p>
          </div>
        </div>

        <Link
          href="/contact?plan=enterprise"
          className="shrink-0 px-5 py-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
        >
          Talk to sales
        </Link>
      </div>

      {/* Pricing FAQs Accordion */}
      <div className="mt-20 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="font-outfit text-2xl font-bold text-foreground">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Everything you need to know about plans and billing.
          </p>
        </div>

        <div className="space-y-3">
          {PRICING_FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-foreground"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ContactAdminModal
        isOpen={showContactAdminModal}
        onOpenChange={setShowContactAdminModal}
        defaultPlan={contactPlan}
      />
    </div>
  );
}
