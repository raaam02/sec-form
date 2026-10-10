"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FORM_TEMPLATES, FormTemplate, FormFieldTemplate, BUILTIN_THEMES } from "@sec-form/shared";
import {
  Sparkles, Search, ArrowRight, Eye, Check, X, Star, ChevronDown,
  HeartHandshake, Utensils, Smile, GraduationCap,
  Mail, UserCheck, TrendingUp, Presentation,
  Calendar, Briefcase, Bug, Wrench, LucideIcon
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "motion/react";
import { useClickOutside } from "@/components/ui/popover-form";

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

const TEMPLATE_COLOR_SCHEMES: Record<string, {
  color: string;
  iconBg: string;
  textColor: string;
}> = {
  "customer-feedback": { color: "#10b981", iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20", textColor: "text-emerald-600 dark:text-emerald-400" },
  "restaurant-survey": { color: "#10b981", iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20", textColor: "text-emerald-600 dark:text-emerald-400" },
  "product-satisfaction": { color: "#f59e0b", iconBg: "bg-amber-500/10 dark:bg-amber-500/20", textColor: "text-amber-600 dark:text-amber-400" },
  "course-evaluation": { color: "#f43f5e", iconBg: "bg-rose-500/10 dark:bg-rose-500/20", textColor: "text-rose-600 dark:text-rose-400" },
  "newsletter-signup": { color: "#6366f1", iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20", textColor: "text-indigo-600 dark:text-indigo-400" },
  "contact-lead": { color: "#6366f1", iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20", textColor: "text-indigo-600 dark:text-indigo-400" },
  "sales-qualification": { color: "#f59e0b", iconBg: "bg-amber-500/10 dark:bg-amber-500/20", textColor: "text-amber-600 dark:text-amber-400" },
  "demo-request": { color: "#06b6d4", iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20", textColor: "text-cyan-600 dark:text-cyan-400" },
  "event-registration": { color: "#8b5cf6", iconBg: "bg-violet-500/10 dark:bg-violet-500/20", textColor: "text-violet-600 dark:text-violet-400" },
  "job-application": { color: "#8b5cf6", iconBg: "bg-violet-500/10 dark:bg-violet-500/20", textColor: "text-violet-600 dark:text-violet-400" },
  "bug-report": { color: "#f43f5e", iconBg: "bg-rose-500/10 dark:bg-rose-500/20", textColor: "text-rose-600 dark:text-rose-400" },
  "it-support": { color: "#06b6d4", iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20", textColor: "text-cyan-600 dark:text-cyan-400" },
};

function renderLiveField(field: FormFieldTemplate, primaryColor: string) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          rows={3}
          disabled
          placeholder={field.placeholder || "Enter details..."}
          className="w-full p-3 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl outline-none resize-none select-none placeholder:opacity-40"
        />
      );
    case "rating":
      return (
        <div className="flex gap-2 items-center py-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-5 w-5"
              style={{
                fill: star <= 4 ? primaryColor : "transparent",
                color: star <= 4 ? primaryColor : "currentColor",
                opacity: star <= 4 ? 1 : 0.25,
              }}
            />
          ))}
          <span className="text-xs opacity-60 ml-2">4 / 5</span>
        </div>
      );
    case "select":
    case "multiselect":
      return (
        <div className="w-full h-10 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-between opacity-80 select-none">
          <span className="truncate">
            {field.options && field.options.length > 0 ? field.options[0] : "Select an option..."}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center gap-2.5 py-1 select-none">
          <div
            className="h-4 w-4 rounded-md border flex items-center justify-center"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
            }}
          >
            <Check className="h-3 w-3 text-white stroke-[3]" />
          </div>
          <span className="text-xs font-medium opacity-90">{field.label}</span>
        </div>
      );
    case "date":
      return (
        <input
          type="text"
          disabled
          placeholder="YYYY-MM-DD"
          className="w-full h-10 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl outline-none select-none placeholder:opacity-40"
        />
      );
    default:
      return (
        <input
          type="text"
          disabled
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
          className="w-full h-10 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl outline-none select-none placeholder:opacity-40"
        />
      );
  }
}

export default function ExplorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setPreviewTemplate(null));

  const tExplore = useTranslations("Explore");
  const tCommon = useTranslations("Common");
  const { isOpen, layoutId: activeLayoutId, openAuthModal } = useAuthModal();
  const { theme } = useTheme();

  const categories = ["All", ...Array.from(new Set(FORM_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates = useMemo(() => {
    return FORM_TEMPLATES.filter((tpl) => {
      const matchCat = selectedCategory === "All" || tpl.category === selectedCategory;
      const matchSearch =
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleUseTemplate = (templateId: string, customLayoutId?: string) => {
    const layout = customLayoutId || `template-use-${templateId}`;
    if (!session) {
      openAuthModal("login", `/dashboard?createTemplate=${templateId}`, layout);
      return;
    }
    router.push(`/dashboard?createTemplate=${templateId}`);
  };

  const previewTheme = useMemo(() => {
    if (!previewTemplate) return BUILTIN_THEMES[0];
    const base = BUILTIN_THEMES.find((th) => th.id === previewTemplate.themeId) || BUILTIN_THEMES[0];

    // If site is in dark mode, ensure dark-appropriate canvas and card backgrounds
    if (theme === "dark") {
      return {
        ...base,
        backgroundColor: base.backgroundColor === "#ffffff" || base.backgroundColor.includes("f0f") || base.backgroundColor.includes("faf") || base.backgroundColor.includes("fdf") || base.backgroundColor.includes("fef")
          ? "#09090b"
          : base.backgroundColor,
        cardColor: base.cardColor === "#ffffff" || base.cardColor.includes("faf") || base.cardColor.includes("f8f") || base.cardColor.includes("f7f")
          ? "#18181b"
          : base.cardColor,
        textColor: "#fafafa",
      };
    }

    // If site is in light mode, ensure light-appropriate canvas and card backgrounds
    return {
      ...base,
      backgroundColor: base.backgroundColor.startsWith("#0") || base.backgroundColor.startsWith("#1")
        ? "#f8fafc"
        : base.backgroundColor,
      cardColor: base.cardColor.startsWith("#0") || base.cardColor.startsWith("#1")
        ? "#ffffff"
        : base.cardColor,
      textColor: "#0f172a",
    };
  }, [previewTemplate, theme]);

  return (
    <div className="pt-32 sm:pt-36 pb-24 container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          {tExplore("title")}
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg">
          {tExplore("subtitle")}
        </p>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by keyword, survey type..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-card border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat === "All" ? tExplore("filterAll") : cat}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="mt-16 text-center py-16 rounded-3xl bg-muted/20 border border-border/30">
          <p className="text-muted-foreground text-sm">No templates found matching your search.</p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="mt-3 text-xs font-semibold text-foreground hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const IconComponent = TEMPLATE_ICONS[template.id] || Sparkles;
            const styling = TEMPLATE_COLOR_SCHEMES[template.id] || {
              color: "#6366f1",
              iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
              textColor: "text-indigo-600 dark:text-indigo-400"
            };

            return (
              <div
                key={template.id}
                className="group rounded-3xl border border-border/40 bg-card/60 p-6 flex flex-col justify-between transition-all duration-300 hover:border-border hover:bg-card/90 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styling.iconBg} ${styling.textColor} transition-transform group-hover:scale-105 duration-200`}>
                      <IconComponent className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground/80">
                      {template.fields.length} {tExplore("questions")}
                    </span>
                  </div>

                  <h3 className="mt-4 font-outfit text-lg font-bold text-foreground">
                    {template.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Clean Visual Preview */}
                  <div className="mt-4 rounded-2xl bg-muted/40 p-3.5 space-y-2">
                    {template.fields.slice(0, 2).map((f) => (
                      <div key={f.id} className="space-y-1">
                        <span className="text-[10px] font-medium text-muted-foreground truncate block">
                          {f.label} {f.required && <span className="text-rose-500">*</span>}
                        </span>
                        <div className="h-7 w-full rounded-xl bg-background/60 px-2.5 text-[10px] text-muted-foreground flex items-center select-none pointer-events-none truncate">
                          {f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                        </div>
                      </div>
                    ))}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground/70">
                      <span>+{template.fields.length - 2} more fields</span>
                    </div>
                  </div>
                </div>

                {/* Subtle Both Preview & Use Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-border/30 flex items-center gap-2">
                  <div className="flex-1 inline-flex">
                    <AnimatePresence initial={false}>
                      {(!previewTemplate || previewTemplate.id !== template.id) && (
                        <motion.button
                          layoutId={`template-preview-btn-${template.id}`}
                          type="button"
                          onClick={() => setPreviewTemplate(template)}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted text-foreground py-2.5 text-xs font-semibold transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Preview</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative flex-1 inline-flex h-9">
                    <AnimatePresence initial={false}>
                      {(!isOpen || activeLayoutId !== `template-use-${template.id}`) && (
                        <motion.div
                          layoutId={`template-use-${template.id}`}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8,
                          }}
                          style={{ borderRadius: "12px" }}
                          className="absolute inset-0 rounded-xl bg-foreground transform-gpu will-change-transform shadow-xs"
                        />
                      )}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template.id, `template-use-${template.id}`)}
                      className="relative z-10 w-full group/button inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-transparent text-background hover:opacity-90 px-3 text-xs font-semibold transition-opacity"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/button:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Live Interactive Form Modal Preview with Spring Motion */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setPreviewTemplate(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Modal Dialog with Spring Popover Animation */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                duration: 0.4,
                bounce: 0,
              }}
              className="relative z-10 w-full max-w-2xl rounded-[28px] pb-6 bg-card border border-border/60 shadow-2xl max-h-[90vh] flex flex-col justify-between overflow-hidden outline-none"
            >
              {/* Live Form Canvas Inside Modal with custom-scrollbar */}
              <div
                className="rounded-[28px] p-6 sm:p-8 border border-border/30 shadow-sm space-y-5 transition-all overflow-y-auto flex-1 custom-scrollbar"
                style={{
                  backgroundColor: previewTheme.backgroundColor,
                  color: previewTheme.textColor,
                }}
              >
                <div
                  className="rounded-3xl p-5 sm:p-7 space-y-5 border border-border dark:border-border/40"
                  style={{
                    backgroundColor: previewTheme.cardColor,
                    color: previewTheme.textColor,
                  }}
                >
                  <div className="border-b border-black/10 dark:border-white/10 pb-3 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg tracking-tight">
                        {previewTemplate.title}
                      </h3>
                      <p className="text-xs opacity-75 mt-0.5">
                        {previewTemplate.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(null)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Render every field as an actual form input */}
                  <div className="space-y-4">
                    {previewTemplate.fields.map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        {field.type !== "checkbox" && (
                          <label className="text-xs font-semibold opacity-90 block">
                            {field.label} {field.required && <span className="text-rose-500">*</span>}
                          </label>
                        )}
                        {field.description && (
                          <p className="text-[11px] opacity-70">{field.description}</p>
                        )}
                        {renderLiveField(field, previewTheme.primaryColor)}
                      </div>
                    ))}

                    {/* Simulated submit button */}
                    <div
                      className="w-full h-10 rounded-xl text-xs font-semibold text-white flex items-center justify-center shadow-md mt-6 select-none"
                      style={{
                        backgroundColor: previewTheme.primaryColor,
                      }}
                    >
                      {tCommon("submit")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 px-6">
                <motion.button
                  layoutId={`template-preview-btn-${previewTemplate.id}`}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                  }}
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/40"
                >
                  Close
                </motion.button>
                <div className="relative inline-flex h-9">
                  <AnimatePresence initial={false}>
                    {(!isOpen || activeLayoutId !== `template-preview-use-${previewTemplate.id}`) && (
                      <motion.div
                        layoutId={`template-preview-use-${previewTemplate.id}`}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          mass: 0.8,
                        }}
                        style={{ borderRadius: "12px" }}
                        className="absolute inset-0 rounded-xl bg-foreground transform-gpu will-change-transform shadow-sm"
                      />
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => {
                      const id = previewTemplate.id;
                      setPreviewTemplate(null);
                      handleUseTemplate(id, `template-preview-use-${id}`);
                    }}
                    className="relative z-10 group/button inline-flex h-9 items-center gap-1.5 px-5 rounded-xl bg-transparent text-background text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <span>Use template</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/button:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
