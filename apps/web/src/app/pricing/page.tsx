"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for personal side projects and quick surveys.",
      features: [
        "Up to 3 active forms",
        "100 submissions per month",
        "Standard templates library",
        "Rate limiting validation",
        "Basic theme selection",
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      description: "Ideal for growing businesses requiring AI and analytics.",
      features: [
        "Unlimited active forms",
        "Unlimited submissions",
        "AI Form Generator (Gemini)",
        "AI Insights report engine",
        "Recharts Analytics dashboard",
        "Custom URLs & Custom slugs",
        "CSV submissions exports",
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations needing strict security and SLA.",
      features: [
        "Everything in Pro",
        "Dedicated database clusters",
        "Premium SLA support",
        "Custom API developer access",
        "Custom SAML/SSO authentication",
        "Advanced Redis rate limits",
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-outfit text-xl font-bold text-slate-900 flex items-center gap-1">
            <span>Formu.AI</span>
          </Link>
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
            Log in
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16 container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-slate-600 text-lg">
            Choose the tier that matches your scope. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl bg-white border p-8 shadow-sm flex flex-col justify-between relative ${
                tier.popular ? "border-indigo-600 ring-2 ring-indigo-600/10" : "border-slate-200"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-outfit text-2xl font-bold text-slate-950">{tier.name}</h3>
                <p className="mt-2 text-slate-500 text-sm">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-outfit text-slate-900">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-slate-500 text-sm">/month</span>}
                </div>
                
                <ul className="mt-8 space-y-4 text-sm text-slate-600">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/login"
                  className={`block w-full py-3 text-center rounded-xl font-semibold text-sm transition-all ${
                    tier.popular
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-500"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-100 py-6 text-center text-slate-500 text-xs">
        <p>© 2026 Formu.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
