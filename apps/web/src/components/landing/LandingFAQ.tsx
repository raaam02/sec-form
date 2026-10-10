"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://form.emoicons.com";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "ai-generation",
    question: "How does Formu.AI generate forms using Gemini AI?",
    answer:
      "Simply describe what you need in plain English (e.g. 'Customer onboarding survey for a SaaS product with NPS rating and feedback textarea'). Google Gemini Pro instantly detects optimal input types, configures validation constraints, writes intelligent copy, and outputs a complete, ready-to-publish form schema.",
  },
  {
    id: "alternatives",
    question: "How is Formu.AI different from Google Forms or Typeform?",
    answer:
      "Unlike Google Forms, Formu.AI allows deep real-time theme customization including exact hex colors, border radiuses, and dark mode styling. Unlike Typeform, you get built-in AI prompt generation, automated sentiment analysis summaries on responses, and an instant zero-friction sandbox mode at a fraction of the cost.",
  },
  {
    id: "theming-customization",
    question: "Can I customize brand colors, card backgrounds, and corner radiuses?",
    answer:
      "Yes! You have granular control over your form aesthetics including primary accent colors, card background tones, root canvas colors, and border radiuses from 0px to 24px, plus instant pre-built themes from the Theme Gallery.",
  },
  {
    id: "embedding",
    question: "How do I embed a form onto my website (WordPress, Webflow, Shopify, React)?",
    answer:
      `Publish your form and copy the 1-line lightweight embed script: <script src="${APP_URL}/embed.js" data-form-id="YOUR_FORM_ID"></script>. Paste this snippet into any website or CMS to render the form responsively with custom themes.`,
  },
  {
    id: "sentiment-analysis",
    question: "What is AI Response Sentiment Analysis and how does it help?",
    answer:
      "When users submit long-form feedback or text answers, Gemini AI processes the submissions in real-time to score customer sentiment (positive, neutral, negative) and provides an automated bullet-point executive summary saving hours of manual review.",
  },
  {
    id: "free-demo",
    question: "Can I try Formu.AI for free without creating an account?",
    answer:
      "Yes! You can test all builder features immediately using our instant demo sandbox credentials (demo@demo.com / demo123) with browser local storage persistence.",
  },
  {
    id: "security-gdpr",
    question: "How are form submissions protected?",
    answer:
      "Submissions are validated on both client and server and rate limited to curb abuse, embeds can be restricted to domains you allow, and drafts stay private until you publish. Formu.AI is open source, so you can also self-host it and keep responses in your own database.",
  },
  {
    id: "export-integrations",
    question: "Can I export response submissions to CSV or connect to Webhooks?",
    answer:
      "Yes. Pro and Enterprise accounts can export submission data to CSV files anytime and configure webhooks for instant JSON notifications to Slack, Discord, or automation platforms like Zapier.",
  },
];

export function LandingFAQ() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "ai-generation": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>FAQ</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>

          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Everything you need to know about building, styling, and analyzing forms with Formu.AI.
          </p>
        </div>

        {/* Clean Questions Accordion List */}
        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-colors duration-150 overflow-hidden ${
                  isOpen
                    ? "border-primary/30 bg-card shadow-sm"
                    : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left group"
                >
                  <span className="text-[15px] sm:text-base font-medium text-foreground transition-colors group-hover:text-primary pr-4">
                    {item.question}
                  </span>

                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? "rotate-180 bg-primary/10 text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/30 mt-1 pt-3">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Inquiries Bar */}
        <div className="mt-10 p-5 rounded-xl border border-border/60 bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Have more questions?
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reach out to our team anytime for custom support or plan inquiries.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm shrink-0"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
