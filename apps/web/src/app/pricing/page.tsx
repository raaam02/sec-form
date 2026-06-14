"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, Sparkles, Code } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
      {/* FLOATING HEADER */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl w-full rounded-2xl border border-border bg-card/75 backdrop-blur-md shadow-sm transition-colors duration-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-200 dark:shadow-none">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight text-foreground">
                Formu.AI
              </span>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Explore Templates</Link>
              <Link href="/themes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Theme Gallery</Link>
              <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
              <a href="http://localhost:4000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                API Docs <Code className="h-3 w-3" />
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Log in
                  </Link>
                  <button
                    onClick={handleDemoLogin}
                    disabled={isLoggingIn}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 dark:shadow-none hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isLoggingIn ? "Logging in..." : "Try Demo"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 pt-28 container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Choose the tier that matches your scope. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl bg-card border p-8 shadow-sm flex flex-col justify-between relative ${
                tier.popular 
                  ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/10 dark:ring-indigo-500/20" 
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-outfit text-2xl font-bold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-muted-foreground text-sm">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-outfit text-foreground">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-muted-foreground text-sm">/month</span>}
                </div>
                
                <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
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
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-500"
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

      <footer className="border-t border-border bg-muted/50 py-6 text-center text-muted-foreground text-xs">
        <p>© 2026 Formu.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
