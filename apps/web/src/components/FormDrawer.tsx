"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { X, Eye, ArrowUpRight, FileText, BarChart3, Sparkles, BrainCircuit, Check, Calendar, HelpCircle } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface FormDrawerProps {
  form: {
    id: string;
    title: string;
    description: string | null;
    visibility: string;
    slug: string;
    schemaJson: any;
  };
  onClose: () => void;
  isSidebarMode?: boolean;
}

type TabType = "overview" | "submissions" | "ai-feedback";

export function FormDrawer({ form, onClose, isSidebarMode = false }: FormDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Queries
  const { data: analytics, isLoading: isAnalyticsLoading } = trpc.analytics.getFormAnalytics.useQuery(
    { formId: form.id },
    { keepPreviousData: true }
  );

  const { data: submissionsList, isLoading: isSubmissionsLoading } = trpc.submissions.list.useQuery(
    { formId: form.id }
  );

  // Mutations
  const generateInsightsMutation = trpc.ai.generateInsights.useMutation();

  const handleRunAI = async () => {
    try {
      const result = await generateInsightsMutation.mutateAsync({ formId: form.id });
      setAiInsights(result);
    } catch (e: any) {
      alert(e.message || "Failed to run AI feedback analysis.");
    }
  };

  const fields = form.schemaJson?.fields || [];

  return (
    <>
      {/* Backdrop overlay */}
      {!isSidebarMode && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Drawer Container */}
      <aside className={isSidebarMode
        ? "w-full bg-background flex flex-col h-full text-foreground relative"
        : "fixed inset-y-0 right-0 w-full sm:w-[500px] bg-background/95 border-l border-border shadow-2xl z-50 transform transition-transform duration-300 backdrop-blur-md flex flex-col h-full animate-slide-in text-foreground"
      }>
        
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between shrink-0">
          <div className="space-y-1 pr-6 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                form.visibility === "public" 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 ring-emerald-600/10 dark:ring-emerald-500/20"
                  : form.visibility === "unlisted"
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 ring-amber-600/10 dark:ring-amber-500/20"
                  : "bg-muted text-muted-foreground ring-1 ring-border"
              }`}>
                {form.visibility}
              </span>
            </div>
            <h2 className="font-outfit text-xl font-extrabold text-foreground truncate">
              {form.title}
            </h2>
            <p className="text-muted-foreground text-xs line-clamp-1">
              {form.description || "No description provided."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-border flex gap-4 shrink-0 bg-muted/50">
          {(["overview", "submissions", "ai-feedback"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all ${
                activeTab === tab
                  ? "border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 min-h-0">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {isAnalyticsLoading ? (
                <div className="space-y-6">
                  {/* Metric Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="rounded-xl border border-border bg-muted/20 p-3 text-center space-y-2.5">
                        <Skeleton className="h-4 w-4 mx-auto" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                        <Skeleton className="h-5 w-8 mx-auto" />
                      </div>
                    ))}
                  </div>

                  {/* Activity Graph */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-48 rounded-xl border border-border bg-muted/10" />
                  </div>

                  {/* Fields Overview */}
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-8 w-full rounded-lg bg-muted/20 border border-border/50" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : !analytics ? (
                <div className="text-center py-10 text-muted-foreground">Failed to load analytics details.</div>
              ) : (
                <>
                  {/* Metric Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                      <div className="flex justify-center text-muted-foreground mb-1"><Eye className="h-4 w-4" /></div>
                      <div className="text-xs text-muted-foreground">Views</div>
                      <div className="text-lg font-bold font-outfit text-foreground mt-0.5">{analytics.totalViews}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                      <div className="flex justify-center text-muted-foreground mb-1"><FileText className="h-4 w-4" /></div>
                      <div className="text-xs text-muted-foreground">Responses</div>
                      <div className="text-lg font-bold font-outfit text-foreground mt-0.5">{analytics.totalResponses}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                      <div className="flex justify-center text-muted-foreground mb-1"><BarChart3 className="h-4 w-4" /></div>
                      <div className="text-xs text-muted-foreground">Conversion</div>
                      <div className="text-lg font-bold font-outfit text-foreground mt-0.5">{analytics.conversionRate}%</div>
                    </div>
                  </div>

                  {/* 30-Day Activity Graph */}
                  <div className="space-y-2">
                    <h3 className="font-outfit text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      30-Day Activity
                    </h3>
                    <div className="h-48 rounded-xl border border-border bg-muted/20 p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.timeline}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.15)"/>
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(str) => {
                              const parts = str.split("-");
                              return parts[2] ? `${parts[1]}/${parts[2]}` : "";
                            }}
                            tick={{ fontSize: 9 }}
                            stroke="rgba(150,150,150,0.5)"
                          />
                          <YAxis tick={{ fontSize: 9 }} width={20} stroke="rgba(150,150,150,0.5)"/>
                          <Tooltip 
                            contentStyle={{ 
                              background: "rgba(10, 10, 10, 0.85)", 
                              border: "none", 
                              borderRadius: "8px", 
                              color: "#fff",
                              fontSize: "11px"
                            }} 
                          />
                          <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorViews)" name="Views" />
                          <Area type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSubs)" name="Responses" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Schema breakdown summary */}
                  <div className="space-y-3">
                    <h3 className="font-outfit text-sm font-bold text-foreground flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-500" />
                      Field Overview
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {fields.map((f: any) => (
                        <div key={f.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-muted/30 border border-border/60">
                          <span className="font-semibold text-foreground truncate pr-4">{f.label}</span>
                          <span className="shrink-0 text-muted-foreground font-mono text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded">{f.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SUBMISSIONS TAB */}
          {activeTab === "submissions" && (
            <div className="space-y-4">
              {isSubmissionsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-36" />
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <Skeleton className="h-3 w-28" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-3.5 w-1/2" />
                          <Skeleton className="h-3.5 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : !submissionsList || submissionsList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/20">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto opacity-60" />
                  <p className="mt-2 text-sm text-muted-foreground">No submissions gathered yet.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-outfit text-sm font-bold text-foreground">
                      Recent Submissions ({submissionsList.length})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {submissionsList.slice(0, 3).map((sub) => {
                      const answers = sub.answersJson as Record<string, any>;
                      return (
                        <div key={sub.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                          <div className="flex items-center justify-between border-b border-border pb-2">
                            <span className="font-mono text-[10px] text-muted-foreground truncate pr-3">{sub.id}</span>
                            <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                              {new Date(sub.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            {fields.map((f: any) => {
                              const ans = answers[f.id];
                              let displayAns = "";
                              if (ans === undefined || ans === null) {
                                displayAns = "-";
                              } else if (Array.isArray(ans)) {
                                displayAns = ans.join(", ");
                              } else if (typeof ans === "boolean") {
                                displayAns = ans ? "Checked" : "Unchecked";
                              } else {
                                displayAns = String(ans);
                              }

                              return (
                                <div key={f.id} className="grid grid-cols-3 gap-2">
                                  <span className="text-muted-foreground font-medium truncate">{f.label}</span>
                                  <span className="col-span-2 text-foreground truncate font-semibold">{displayAns}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {submissionsList.length > 3 && (
                      <p className="text-center text-xs text-muted-foreground mt-2">
                        +{submissionsList.length - 3} more submissions. Edit form to view all.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* AI FEEDBACK TAB */}
          {activeTab === "ai-feedback" && (
            <div className="space-y-4">
              {!submissionsList || submissionsList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/20">
                  <BrainCircuit className="h-8 w-8 text-indigo-500 mx-auto opacity-70 mb-2" />
                  <p className="mt-2 text-sm text-muted-foreground">At least 1 submission is required to run AI feedback insights.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-outfit text-sm font-bold text-foreground flex items-center gap-1.5">
                      <BrainCircuit className="h-4 w-4 text-indigo-500" />
                      Gemini Copilot Analytics
                    </h3>
                  </div>

                  {aiInsights ? (
                    <div className="p-4 rounded-xl border border-border bg-muted/50 text-xs text-foreground leading-relaxed whitespace-pre-wrap space-y-2">
                      {aiInsights.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  ) : generateInsightsMutation.isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <LoadingSpinner className="w-8 h-8" color="text-indigo-600" />
                      <span className="text-xs text-muted-foreground font-semibold animate-pulse">Gemini is analyzing responses...</span>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-muted/20 p-6 text-center space-y-4">
                      <Sparkles className="h-10 w-10 text-indigo-500 mx-auto animate-pulse" />
                      <div className="space-y-1 max-w-sm mx-auto">
                        <p className="text-sm font-bold text-foreground">Generate submission intelligence report</p>
                        <p className="text-xs text-muted-foreground">Run a sentiment analysis and trend extraction on all submissions gathered.</p>
                      </div>
                      <button
                        onClick={handleRunAI}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-xs font-bold text-white shadow-sm hover:opacity-95"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Analyze Responses
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-muted/50 shrink-0 flex gap-3">
          <Link
            href={`/f/${form.slug}`}
            target="_blank"
            className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground text-sm font-semibold transition-colors"
          >
            <Eye className="h-4 w-4" /> Live Form
          </Link>
          <Link
            href={`/dashboard/builder/${form.id}`}
            className="flex-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-100 dark:shadow-none transition-colors"
          >
            <span>Go to Editor</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

      </aside>
    </>
  );
}
