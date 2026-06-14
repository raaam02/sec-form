import React from "react";
import { FileText, Eye, Inbox, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin snap-x snap-mandatory">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="min-w-[240px] flex-1 shrink-0 snap-start rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-3 flex-1 pr-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin snap-x snap-mandatory">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="min-w-[240px] flex-1 shrink-0 snap-start rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between text-card-foreground">
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
