import React from "react";
import { FileText, Eye, Inbox, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface StatsCardGridProps {
  stats: {
    totalForms?: number;
    totalViews?: number;
    totalSubmissions?: number;
    averageConversionRate?: number;
  } | null | undefined;
  isStatsLoading: boolean;
}

export function StatsCardGrid({ stats, isStatsLoading }: StatsCardGridProps) {
  const t = useTranslations("Dashboard");

  const statsConfig = [
    {
      label: t("statForms"),
      value: stats?.totalForms ?? 0,
      icon: FileText,
      colorClass: "bg-primary/10 text-primary",
    },
    {
      label: t("statViews"),
      value: stats?.totalViews ?? 0,
      icon: Eye,
      colorClass: "bg-success/10 text-success",
    },
    {
      label: t("statSubmissions"),
      value: stats?.totalSubmissions ?? 0,
      icon: Inbox,
      colorClass: "bg-purple-500/10 text-purple-500 dark:text-purple-400",
    },
    {
      label: t("statConversion"),
      value: `${stats?.averageConversionRate ?? 0}%`,
      icon: Percent,
      colorClass: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    },
  ];

  if (isStatsLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-24 rounded-2xl border border-border bg-card p-6 animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between text-card-foreground">
            <div className="text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                {item.label}
              </span>
              <div className="mt-2 text-2xl font-bold font-outfit text-foreground">
                {item.value}
              </div>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
