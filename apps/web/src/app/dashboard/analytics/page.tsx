"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { FileText, Eye, BarChart3, Percent, Pencil, Inbox, Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { useTranslations } from "next-intl";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAnalyticsRow } from "@/components/dashboard/FormAnalyticsRow";
import { Input } from "@/components/ui/input";

type SortKey = "title" | "totalViews" | "totalResponses" | "conversionRate";
type SortDir = "asc" | "desc";

// ─── Sortable column header ──────────────────────────────────────────────────

function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = currentSort === sortKey;
  return (
    <th
      className="py-3.5 px-6 cursor-pointer select-none group"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1 whitespace-nowrap">
        {label}
        <span className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"}`}>
          {isActive ? (
            currentDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronsUpDown className="h-3.5 w-3.5" />
          )}
        </span>
      </div>
    </th>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsDashboardPage() {
  const t = useTranslations("Analytics");
  const tDashboard = useTranslations("Dashboard");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const { data: stats, isLoading: isStatsLoading } = trpc.analytics.getDashboardStats.useQuery();
  const { data: formsList, isLoading: isFormsLoading } = trpc.forms.list.useQuery();

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filteredAndSortedForms = useMemo(() => {
    if (!formsList) return [];
    let result = formsList.filter((f) => {
      const q = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        (f.description ?? "").toLowerCase().includes(q)
      );
    });

    result = [...result].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortKey === "title") {
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
      } else if (sortKey === "totalViews") {
        aVal = a.totalViews ?? 0;
        bVal = b.totalViews ?? 0;
      } else if (sortKey === "totalResponses") {
        aVal = a.totalResponses ?? 0;
        bVal = b.totalResponses ?? 0;
      } else {
        // conversionRate
        aVal = (a.totalViews ?? 0) > 0 ? ((a.totalResponses ?? 0) / (a.totalViews ?? 1)) : 0;
        bVal = (b.totalViews ?? 0) > 0 ? ((b.totalResponses ?? 0) / (b.totalViews ?? 1)) : 0;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [formsList, searchQuery, sortKey, sortDir]);

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

  const tableHeaders = (
    <tr className="border-b border-border bg-muted/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
      <SortableHeader label="Form Details" sortKey="title" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
      <th className="py-3.5 px-6 select-none">Visibility</th>
      <SortableHeader label="Views" sortKey="totalViews" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
      <SortableHeader label="Responses" sortKey="totalResponses" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
      <SortableHeader label="Conversion" sortKey="conversionRate" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
      <th className="py-3.5 px-6 select-none">Actions</th>
    </tr>
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <DashboardHeader title={t("navAnalytics")} />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isStatsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl border border-border bg-card p-6 animate-pulse" />
                ))
              : statsConfig.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between text-card-foreground">
                      <div className="text-left">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">{item.label}</span>
                        <span className="mt-2 text-2xl font-bold font-outfit text-foreground block">{item.value}</span>
                      </div>
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* FORMS LIST TABLE */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm text-card-foreground">
            {/* Table header with search */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-outfit text-lg font-bold text-foreground">{t("submissionsTrend")}</h2>
                <p className="text-muted-foreground text-xs mt-0.5">{t("subtitle")}</p>
              </div>
              {/* Search */}
              <div className="relative w-full sm:w-72 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search forms…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-background/50 border-border rounded-xl text-sm transition-colors focus:bg-background"
                />
              </div>
            </div>

            {isFormsLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>{tableHeaders}</thead>
                  <tbody className="divide-y divide-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="py-4 px-6"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-24 mt-2" /></td>
                        <td className="py-4 px-6"><Skeleton className="h-5 w-16 rounded-full" /></td>
                        <td className="py-4 px-6"><Skeleton className="h-4 w-8" /></td>
                        <td className="py-4 px-6"><Skeleton className="h-4 w-8" /></td>
                        <td className="py-4 px-6"><Skeleton className="h-4 w-12" /></td>
                        <td className="py-4 px-6"><div className="flex gap-2"><Skeleton className="h-8 w-16 rounded-xl" /><Skeleton className="h-8 w-8 rounded-xl" /></div></td>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>{tableHeaders}</thead>
                  <tbody className="divide-y divide-border">
                    {filteredAndSortedForms.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                          No forms match your search.
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedForms.map((form) => (
                        <FormAnalyticsRow key={form.id} form={form} />
                      ))
                    )}
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
