"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FORM_TEMPLATES } from "@sec-form/shared";
import { 
  Copy, Sparkles, Code, Compass,
  HeartHandshake, Utensils, Smile, GraduationCap, 
  Mail, UserCheck, TrendingUp, Presentation, 
  Calendar, Briefcase, Bug, Wrench, LucideIcon 
} from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { useTranslations } from "next-intl";

interface CategoryStyle {
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  glowClass: string;
  iconBg: string;
  accentBorder: string;
  btnActiveBg: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "emerald": {
    colorClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    glowClass: "hover:border-emerald-500/35 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-none",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/20 dark:border-emerald-500/30",
    btnActiveBg: "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
  },
  "indigo": {
    colorClass: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    badgeText: "text-indigo-700 dark:text-indigo-400",
    glowClass: "hover:border-indigo-500/35 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-none",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    accentBorder: "border-indigo-500/20 dark:border-indigo-500/30",
    btnActiveBg: "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
  },
  "violet": {
    colorClass: "text-violet-600 dark:text-violet-400",
    badgeBg: "bg-violet-500/10 dark:bg-violet-500/15",
    badgeText: "text-violet-700 dark:text-violet-400",
    glowClass: "hover:border-violet-500/35 hover:shadow-lg hover:shadow-violet-500/5 dark:hover:shadow-none",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400",
    accentBorder: "border-violet-500/20 dark:border-violet-500/30",
    btnActiveBg: "bg-violet-600 border-violet-600 text-white hover:bg-violet-700"
  },
  "amber": {
    colorClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/15",
    badgeText: "text-amber-700 dark:text-amber-400",
    glowClass: "hover:border-amber-500/35 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:shadow-none",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-500/20 dark:border-amber-500/30",
    btnActiveBg: "bg-amber-600 border-amber-600 text-white hover:bg-amber-700"
  },
  "rose": {
    colorClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-500/10 dark:bg-rose-500/15",
    badgeText: "text-rose-700 dark:text-rose-400",
    glowClass: "hover:border-rose-500/35 hover:shadow-lg hover:shadow-rose-500/5 dark:hover:shadow-none",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400",
    accentBorder: "border-rose-500/20 dark:border-rose-500/30",
    btnActiveBg: "bg-rose-600 border-rose-600 text-white hover:bg-rose-700"
  },
  "cyan": {
    colorClass: "text-cyan-600 dark:text-cyan-400",
    badgeBg: "bg-cyan-500/10 dark:bg-cyan-500/15",
    badgeText: "text-cyan-700 dark:text-cyan-400",
    glowClass: "hover:border-cyan-500/35 hover:shadow-lg hover:shadow-cyan-500/5 dark:hover:shadow-none",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
    accentBorder: "border-cyan-500/20 dark:border-cyan-500/30",
    btnActiveBg: "bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-700"
  }
};

const TEMPLATE_STYLES: Record<string, CategoryStyle> = {
  "customer-feedback": CATEGORY_STYLES["emerald"],
  "restaurant-survey": CATEGORY_STYLES["emerald"],
  "newsletter-signup": CATEGORY_STYLES["indigo"],
  "contact-lead": CATEGORY_STYLES["indigo"],
  "event-registration": CATEGORY_STYLES["violet"],
  "job-application": CATEGORY_STYLES["violet"],
  "product-satisfaction": CATEGORY_STYLES["amber"],
  "sales-qualification": CATEGORY_STYLES["amber"],
  "course-evaluation": CATEGORY_STYLES["rose"],
  "bug-report": CATEGORY_STYLES["rose"],
  "demo-request": CATEGORY_STYLES["cyan"],
  "it-support": CATEGORY_STYLES["cyan"],
};

const getTemplateStyle = (id: string) => {
  return TEMPLATE_STYLES[id] || {
    colorClass: "text-primary",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    glowClass: "hover:border-primary/45 hover:shadow-lg hover:shadow-primary/5",
    iconBg: "bg-primary/10 text-primary",
    accentBorder: "border-primary/20",
    btnActiveBg: "bg-primary border-primary text-white hover:bg-primary/90"
  };
};

const getCategoryTabStyle = (category: string) => {
  if (category === "Feedback & Surveys") return CATEGORY_STYLES["emerald"];
  if (category === "Marketing & Sales") return CATEGORY_STYLES["indigo"];
  if (category === "Operations & HR") return CATEGORY_STYLES["violet"];
  return {
    colorClass: "text-primary",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    glowClass: "hover:border-primary/45 hover:shadow-lg hover:shadow-primary/5",
    iconBg: "bg-primary/10 text-primary",
    accentBorder: "border-primary/20",
    btnActiveBg: "bg-primary border-primary text-white hover:bg-primary/90"
  };
};

const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  "customer-feedback": HeartHandshake,
  "restaurant-survey": Utensils,
  "product-satisfaction": Smile,
  "course-evaluation": GraduationCap,
  "newsletter-signup": Mail,
  "contact-lead": UserCheck,
  "sales-qualification": TrendingUp,
  "demo-request": Presentation,
  "event-registration": Calendar,
  "job-application": Briefcase,
  "bug-report": Bug,
  "it-support": Wrench,
};

const getTemplateIcon = (id: string) => {
  return TEMPLATE_ICONS[id] || Compass;
};

function interleaveByCategory(templates: typeof FORM_TEMPLATES) {
  const feedback = templates.filter(t => t.category === "Feedback & Surveys");
  const marketing = templates.filter(t => t.category === "Marketing & Sales");
  const ops = templates.filter(t => t.category === "Operations & HR");
  
  const interleaved: typeof FORM_TEMPLATES = [];
  const maxLength = Math.max(feedback.length, marketing.length, ops.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < feedback.length) interleaved.push(feedback[i]);
    if (i < marketing.length) interleaved.push(marketing[i]);
    if (i < ops.length) interleaved.push(ops[i]);
  }
  
  return interleaved;
}

export default function ExplorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const tLanding = useTranslations("Landing");
  const tExplore = useTranslations("Explore");
  const tCommon = useTranslations("Common");

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

  const categories = ["All", ...Array.from(new Set(FORM_TEMPLATES.map((t) => t.category)))];

  const interleavedTemplates = React.useMemo(() => interleaveByCategory(FORM_TEMPLATES), []);

  const filteredTemplates = selectedCategory === "All"
    ? interleavedTemplates
    : FORM_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = async (templateId: string) => {
    if (!session) {
      router.push("/login?redirect=/dashboard");
      return;
    }
    router.push(`/dashboard?createTemplate=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
      <main className="flex-1 py-16 pt-28 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {tExplore("title")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {tExplore("subtitle")}
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => {
            const style = getCategoryTabStyle(cat);
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isSelected
                    ? style.btnActiveBg
                    : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat === "All" ? tExplore("filterAll") : cat}
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const style = getTemplateStyle(template.id);
            const IconComponent = getTemplateIcon(template.id);
            return (
              <div
                key={template.id}
                className={`group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all flex flex-col justify-between ${style.glowClass}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className={`p-3 rounded-xl ${style.iconBg} transition-transform group-hover:scale-110 duration-200 shrink-0`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-full ${style.badgeBg} ${style.badgeText} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                        {template.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {template.fields.length} {tExplore("questions")}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 font-outfit text-xl font-bold text-foreground transition-colors">
                    {template.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
                    {template.description}
                  </p>
                  
                  <div className="mt-5 border-t border-border pt-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                      Form Layout Preview
                    </span>
                    <div className={`${style.badgeBg} border ${style.accentBorder} rounded-xl p-4 space-y-3 transition-colors`}>
                      {template.fields.slice(0, 3).map((f) => (
                        <div key={f.id} className="space-y-1">
                          {f.type !== "checkbox" && (
                            <label className="text-[9px] font-bold text-muted-foreground block truncate">
                              {f.label} {f.required && <span className="text-rose-500">*</span>}
                            </label>
                          )}
                          {f.type === "textarea" ? (
                            <div className="h-8 w-full rounded border border-border bg-background px-2.5 py-1.5 text-[10px] text-muted-foreground flex items-start truncate select-none pointer-events-none">
                              {f.placeholder || "Enter details..."}
                            </div>
                          ) : f.type === "select" || f.type === "multiselect" ? (
                            <div className="h-8 w-full rounded border border-border bg-background px-2.5 text-[10px] text-muted-foreground flex items-center justify-between select-none pointer-events-none">
                              <span className="truncate">Select option...</span>
                              <span className="text-[8px] text-muted-foreground shrink-0">▼</span>
                            </div>
                          ) : f.type === "checkbox" ? (
                            <div className="flex items-center gap-2 py-0.5 select-none pointer-events-none">
                              <div className="h-3 w-3 rounded border border-border bg-background shrink-0" />
                              <span className="text-[9px] font-bold text-muted-foreground truncate">{f.label}</span>
                            </div>
                          ) : f.type === "rating" ? (
                            <div className="flex gap-0.5 items-center select-none pointer-events-none">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <span key={i} className={`text-xs ${style.colorClass}`}>★</span>
                              ))}
                            </div>
                          ) : (
                            <div className="h-8 w-full rounded border border-border bg-background px-2.5 text-[10px] text-muted-foreground flex items-center truncate select-none pointer-events-none">
                              {f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className={`h-8 w-full rounded-lg ${style.badgeBg} ${style.colorClass} border ${style.accentBorder} flex items-center justify-center text-[10px] font-bold mt-2 select-none pointer-events-none transition-colors`}>
                        {tCommon("submit")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm transition-all ${
                      style.colorClass.includes("emerald")
                        ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10 hover:shadow-emerald-500/20"
                        : style.colorClass.includes("indigo")
                        ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/10 hover:shadow-indigo-500/20"
                        : style.colorClass.includes("violet")
                        ? "bg-violet-600 hover:bg-violet-500 shadow-violet-500/10 hover:shadow-violet-500/20"
                        : style.colorClass.includes("amber")
                        ? "bg-amber-600 hover:bg-amber-500 shadow-amber-500/10 hover:shadow-amber-500/20"
                        : style.colorClass.includes("rose")
                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/10 hover:shadow-rose-500/20"
                        : "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/10 hover:shadow-cyan-500/20"
                    }`}
                  >
                    <Copy className="h-4 w-4" /> {tExplore("useTemplate")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
