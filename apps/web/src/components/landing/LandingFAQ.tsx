"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Container, SectionHeader } from "./ui";
import { FAQAccordion, type FAQItem } from "@/components/FAQAccordion";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://form.emoicons.com";

export type { FAQItem };

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "ai-generation",
    question: "How does Formu.AI generate forms?",
    answer:
      "Describe what you need in plain English. Formu AI detects optimal input types, sets validation rules, writes copy, and outputs a ready-to-publish form schema.",
  },
  {
    id: "alternatives",
    question: "How is Formu.AI different from Google Forms or Typeform?",
    answer:
      "Formu.AI provides natural-language prompt generation, deep theme customization (hex colors, radiuses, dark mode), and automated response sentiment summaries at a fraction of the cost.",
  },
  {
    id: "theming-customization",
    question: "Can I customize brand colors and fonts?",
    answer:
      "Yes. You have full control over accent colors, background tones, corner radiuses, and typography, plus 50+ pre-built gallery themes.",
  },
  {
    id: "embedding",
    question: "How do I embed a form on my website?",
    answer:
      `Copy the 1-line script tag: <script src="${APP_URL}/embed.js" data-form-id="YOUR_FORM_ID"></script> and paste it into WordPress, Webflow, Shopify, or React.`,
  },
  {
    id: "free-demo",
    question: "Can I try Formu.AI without an account?",
    answer:
      "Yes. You can test all builder features immediately using our instant sandbox mode with local browser persistence.",
  },
  // {
  //   id: "sentiment-analysis",
  //   question: "What is AI Response Sentiment Analysis?",
  //   answer:
  //     "Our AI engine processes submissions in real time, scoring sentiment and providing an automated summary of recurring feedback.",
  // },
  {
    id: "security-gdpr",
    question: "How are submissions protected?",
    answer:
      "Submissions are validated on client and server and rate limited. Embeds can be locked to allowed domains. You can also self-host Formu.AI with Docker.",
  },
  // {
  //   id: "export-integrations",
  //   question: "Can I export responses to CSV or webhooks?",
  //   answer:
  //     "Yes. Export submissions to CSV anytime and configure webhooks for instant JSON notifications to Slack, Discord, or Zapier.",
  // },
];

export function LandingFAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28 relative overflow-hidden bg-background">
      <Container className="max-w-3xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Quick answers about generating, styling, and publishing forms."
        />

        {/* Accordion List */}
        <FAQAccordion items={FAQ_ITEMS} defaultOpenId="ai-generation" />

        {/* Support Inquiry Banner */}
        <div className="mt-10 p-5 rounded-3xl border border-border/70 bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left backdrop-blur-sm">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              Have questions or custom needs?
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Contact our team anytime for self-hosting or plan inquiries.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm shrink-0"
          >
            <MessageSquare className="h-3 w-3" />
            <span>Contact</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
