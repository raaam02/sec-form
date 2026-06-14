"use client";

import React from "react";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { FileText, Eye, BarChart3, Percent, Pencil, Inbox } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { useTranslations } from "next-intl";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsDashboardPage() {
  const t = useTranslations("Analytics");
  const tDashboard = useTranslations("Dashboard");

  const { data: stats, isLoading: isStatsLoading } = trpc.analytics.getDashboardStats.useQuery();
  const { data: formsList, isLoading: isFormsLoading } = trpc.forms.list.useQuery();

  const statsConfig = [
    {
      label: tDashboard("statForms"),
      value: stats?.totalForms ?? 0,
      icon: FileText,
      colorClass: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400",
    },
    {
      label: tDashboard("statViews"),
      value: stats?.totalViews ?? 0,
      icon: Eye,
      colorClass: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    },
    {
      label: tDashboard("statSubmissions"),
      value: stats?.totalSubmissions ?? 0,
      icon: Inbox,
      colorClass: "bg-purple-500/10 text-purple-500 dark:text-purple-400",
    },
    {
      label: tDashboard("statConversion"),
      value: `${stats?.averageConversionRate ?? 0}%`,
      icon: Percent,
      colorClass: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <DashboardHeader title={t("navAnalytics")} />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isStatsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl border border-border bg-card p-6 animate-pulse" />
              ))
            ) : (
              statsConfig.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between text-card-foreground">
                    <div className="text-left">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{item.label}</span>
                      <span className="mt-2 text-2xl font-bold font-outfit text-foreground block">
                        {item.value}
                      </span>
                    </div>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FORMS LIST TABLE */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm text-card-foreground">
            <div className="p-6 border-b border-border">
              <h2 className="font-outfit text-lg font-bold text-foreground">{t("submissionsTrend")}</h2>
              <p className="text-muted-foreground text-xs mt-0.5">{t("subtitle")}</p>
            </div>

            {isFormsLoading ? (
              <div className="overflow-x-auto text-foreground">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                      <th className="py-3.5 px-6">Form Details</th>
                      <th className="py-3.5 px-6">Visibility</th>
                      <th className="py-3.5 px-6">Views</th>
                      <th className="py-3.5 px-6">Responses</th>
                      <th className="py-3.5 px-6">Conversion Rate</th>
                      <th className="py-3.5 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-4 px-6">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24 mt-2" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-4 w-8" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-4 w-8" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-16 rounded-xl" />
                            <Skeleton className="h-8 w-16 rounded-xl" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !formsList || formsList.length === 0 ? (
              <div className="py-16 text-center max-w-md mx-auto p-6">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4 border border-border">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-outfit text-base font-bold text-foreground mb-1">{tDashboard("noFormsTitle")}</h3>
                <p className="text-muted-foreground text-xs mb-6">{tDashboard("noFormsDesc")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto text-foreground">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
                      <th className="py-3.5 px-6">Form Details</th>
                      <th className="py-3.5 px-6">Visibility</th>
                      <th className="py-3.5 px-6">Views</th>
                      <th className="py-3.5 px-6">Responses</th>
                      <th className="py-3.5 px-6">Conversion Rate</th>
                      <th className="py-3.5 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {formsList.map((form) => (
                      <FormAnalyticsRow key={form.id} form={form} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormAnalyticsRow({ form }: { form: any }) {
  const { data: analytics, isLoading } = trpc.analytics.getFormAnalytics.useQuery({ formId: form.id });

  const getVisibilityColor = (vis: string) => {
    switch (vis) {
      case "public":
        return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-600/10 dark:ring-emerald-500/20";
      case "unlisted":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-600/10 dark:ring-amber-500/20";
      default:
        return "bg-muted text-muted-foreground ring-1 ring-border";
    }
  };

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="py-4 px-6">
        <div className="font-semibold text-foreground truncate max-w-xs">{form.title}</div>
        {form.description && (
          <div className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">{form.description}</div>
        )}
      </td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${getVisibilityColor(form.visibility)}`}>
          {form.visibility}
        </span>
      </td>
      <td className="py-4 px-6 text-sm font-medium text-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-8 inline-block" />
        ) : (
          analytics?.totalViews ?? 0
        )}
      </td>
      <td className="py-4 px-6 text-sm font-medium text-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-8 inline-block" />
        ) : (
          analytics?.totalResponses ?? 0
        )}
      </td>
      <td className="py-4 px-6 text-sm font-medium text-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-12 inline-block" />
        ) : (
          `${analytics?.conversionRate ?? 0}%`
        )}
      </td>
      <td className="py-4 px-6">
        <div className="flex gap-2">
          <Link
            href={`/dashboard/builder/${form.id}?tab=analytics`}
            className="inline-flex h-8 items-center gap-1 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground px-3 text-xs font-bold text-muted-foreground transition-colors shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Stats
          </Link>
          <Link
            href={`/dashboard/builder/${form.id}`}
            className="inline-flex h-8 items-center gap-1 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground px-3 text-xs font-bold text-muted-foreground transition-colors shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </td>
    </tr>
  );
}
