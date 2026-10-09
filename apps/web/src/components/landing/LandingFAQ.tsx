"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Search, Sparkles, HelpCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FAQItem {
  id: string;
  category: "AI & Features" | "Theming & Design" | "Embedding" | "Security & Data";
  question: string;
  answer: string;
  keywords: string[];
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "ai-generation",
    category: "AI & Features",
    question: "How does Formu.AI generate forms using Gemini AI?",
    answer:
      "Simply describe what you need in plain English (e.g. 'Customer onboarding survey for a SaaS product with NPS rating and feedback textarea'). Google Gemini Pro instantly interprets your prompt, detects optimal input types (text, email, ratings, dropdowns), writes intelligent placeholder copy, configures validation constraints, and outputs a complete, ready-to-publish form schema.",
    keywords: ["AI form generator", "Gemini AI", "prompt to form", "generate survey", "schema"],
  },
  {
    id: "alternatives",
    category: "AI & Features",
    question: "How is Formu.AI different from Google Forms or Typeform?",
    answer:
      "Unlike Google Forms, Formu.AI allows deep real-time theme customization including exact hex colors, border radiuses, and dark mode styling to match your brand seamlessly. Unlike Typeform, you get built-in AI prompt generation, automated sentiment analysis summaries on responses, and an instant zero-friction sandbox mode at a fraction of the cost.",
    keywords: ["Google Forms alternative", "Typeform alternative", "comparisons", "branding"],
  },
  {
    id: "theming-customization",
    category: "Theming & Design",
    question: "Can I customize brand colors, card backgrounds, and corner radiuses?",
    answer:
      "Yes! You have granular control over your form aesthetics. You can configure primary accent colors, card background tones, root canvas colors, and border radiuses from 0px (brutalist) to 24px (ultra-rounded). You can also apply pre-built themes from our Theme Gallery with a single click.",
    keywords: ["custom theme", "hex colors", "border radius", "styling", "dark mode"],
  },
  {
    id: "embedding",
    category: "Embedding",
    question: "How do I embed a form onto my website (WordPress, Webflow, Shopify, React)?",
    answer:
      "Publish your form and copy the 1-line lightweight embed script: <script src=\"https://form.emoicons.com/embed.js\" data-form-id=\"YOUR_FORM_ID\"></script>. Paste this snippet into any website or CMS body. Your form will render responsively with all custom themes and validations intact.",
    keywords: ["embed form", "WordPress", "Webflow", "Shopify", "iframe", "script tag"],
  },
  {
    id: "sentiment-analysis",
    category: "AI & Features",
    question: "What is AI Response Sentiment Analysis and how does it help?",
    answer:
      "When users submit long-form feedback or text answers, Gemini AI processes the submissions in real-time to score customer sentiment (positive, neutral, negative) and provides an automated bullet-point executive summary. This saves hours of manual review on surveys and user research forms.",
    keywords: ["sentiment analysis", "AI summary", "feedback analytics", "response insights"],
  },
  {
    id: "free-demo",
    category: "Security & Data",
    question: "Can I try Formu.AI for free without creating an account?",
    answer:
      "Yes! You can test all builder features immediately using our instant demo sandbox credentials (demo@demo.com / demo123). Your created forms, custom themes, and test submissions persist directly in your browser's local storage with copy-on-write isolation.",
    keywords: ["try demo", "free account", "sandbox", "test form builder"],
  },
  {
    id: "security-gdpr",
    category: "Security & Data",
    question: "Are form submissions secure and GDPR compliant?",
    answer:
      "Yes. All form data in transit is protected via TLS 1.3 encryption, and database records are safeguarded with AES-256 encryption at rest. Form inputs are validated strictly on both client and server to prevent injection attacks and spam abuse with Redis rate limiting.",
    keywords: ["security", "GDPR", "encryption", "privacy", "spam protection"],
  },
  {
    id: "export-integrations",
    category: "Embedding",
    question: "Can I export response submissions to CSV or connect to Webhooks?",
    answer:
      "Yes. Pro and Enterprise accounts can export submission data to CSV files anytime. You can also configure webhooks to deliver instant JSON notifications to your internal backend, Slack, Discord, or automation platforms like Zapier whenever a user submits a form.",
    keywords: ["export CSV", "webhooks", "Zapier", "REST API", "integrations"],
  },
];

const CATEGORIES = ["All", "AI & Features", "Theming & Design", "Embedding", "Security & Data"] as const;

export function LandingFAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "ai-generation": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesQuery =
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.keywords.some((kw) => kw.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="faq" className="py-24 sm:py-32 relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Got questions? We've got answers.
          </h2>

          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Everything you need to know about building, styling, embedding, and analyzing AI forms with Formu.AI.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4 mb-10">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords (e.g. embed, Gemini, themes)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card/50 text-muted-foreground border-border hover:bg-card hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-3.5">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card/40 p-8">
              <p className="text-muted-foreground text-sm">
                No matching questions found for "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-xs font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-primary/40 bg-card shadow-sm"
                      : "border-border bg-card/60 hover:border-border/80 hover:bg-card"
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className="text-xs font-bold text-primary/80 uppercase tracking-wider hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-primary/10">
                        {item.category}
                      </span>
                      <h3 className="font-outfit text-base sm:text-lg font-bold text-foreground leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`h-8 w-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-primary text-primary-foreground border-primary" : "text-muted-foreground"
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
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-border/40 text-muted-foreground text-sm sm:text-[15px] leading-relaxed mt-1">
                          <p>{item.answer}</p>

                          {/* Keyword Pills for Search Scrapers and Context */}
                          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/20">
                            {item.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-[11px] font-medium text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-md"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA for Further Inquiries */}
        <div className="mt-12 text-center p-6 rounded-2xl border border-border bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-outfit text-base font-bold text-foreground">
              Still have questions or need custom enterprise quotas?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Our team is ready to help you build and scale your forms.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
