import { FormTemplate, BUILTIN_THEMES } from "@sec-form/shared";
import {
  HeartHandshake,
  Utensils,
  Smile,
  GraduationCap,
  Mail,
  UserCheck,
  TrendingUp,
  Presentation,
  Calendar,
  Briefcase,
  Bug,
  Wrench,
  LucideIcon,
  Sparkles,
} from "lucide-react";

export const TEMPLATE_ICONS: Record<string, LucideIcon> = {
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

export function getTemplateIcon(templateId: string): LucideIcon {
  return TEMPLATE_ICONS[templateId] || Sparkles;
}

export const TEMPLATE_COLOR_SCHEMES: Record<
  string,
  {
    color: string;
    iconBg: string;
    textColor: string;
  }
> = {
  "customer-feedback": {
    color: "#10b981",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  "restaurant-survey": {
    color: "#10b981",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  "product-satisfaction": {
    color: "#f59e0b",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  "course-evaluation": {
    color: "#f43f5e",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    textColor: "text-rose-600 dark:text-rose-400",
  },
  "newsletter-signup": {
    color: "#6366f1",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  "contact-lead": {
    color: "#6366f1",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  "sales-qualification": {
    color: "#f59e0b",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  "demo-request": {
    color: "#06b6d4",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
  },
  "event-registration": {
    color: "#8b5cf6",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  "job-application": {
    color: "#8b5cf6",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  "bug-report": {
    color: "#f43f5e",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    textColor: "text-rose-600 dark:text-rose-400",
  },
  "it-support": {
    color: "#06b6d4",
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    textColor: "text-cyan-600 dark:text-cyan-400",
  },
};

export function getTemplateColorScheme(templateId: string) {
  return (
    TEMPLATE_COLOR_SCHEMES[templateId] || {
      color: "#6366f1",
      iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
    }
  );
}

export function getComputedTemplateTheme(
  template: FormTemplate | null,
  themeMode: string | undefined
) {
  if (!template) return BUILTIN_THEMES[0];
  const base =
    BUILTIN_THEMES.find((th) => th.id === template.themeId) || BUILTIN_THEMES[0];

  if (themeMode === "dark") {
    return {
      ...base,
      backgroundColor:
        base.backgroundColor === "#ffffff" ||
        base.backgroundColor.includes("f0f") ||
        base.backgroundColor.includes("faf") ||
        base.backgroundColor.includes("fdf") ||
        base.backgroundColor.includes("fef")
          ? "#09090b"
          : base.backgroundColor,
      cardColor:
        base.cardColor === "#ffffff" ||
        base.cardColor.includes("faf") ||
        base.cardColor.includes("f8f") ||
        base.cardColor.includes("f7f")
          ? "#18181b"
          : base.cardColor,
      textColor: "#fafafa",
    };
  }

  return {
    ...base,
    backgroundColor:
      base.backgroundColor.startsWith("#0") ||
      base.backgroundColor.startsWith("#1")
        ? "#f8fafc"
        : base.backgroundColor,
    cardColor:
      base.cardColor.startsWith("#0") || base.cardColor.startsWith("#1")
        ? "#ffffff"
        : base.cardColor,
    textColor: "#0f172a",
  };
}
