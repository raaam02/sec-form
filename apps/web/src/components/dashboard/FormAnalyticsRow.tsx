import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { Eye, Percent, Pencil, ChevronDown, ChevronUp, Download, CheckCircle2, Sparkles, AlertCircle, FileText } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

export function FormAnalyticsRow({ form }: { form: any }) {
  const t = useTranslations("Analytics");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "responses">("analytics");

  const { data: analytics, isLoading: isAnalyticsLoading } = trpc.analytics.getFormAnalytics.useQuery(
    { formId: form.id },
    { enabled: isExpanded && activeTab === "analytics" }
  );

  const { data: responses, isLoading: isResponsesLoading } = trpc.submissions.list.useQuery(
    { formId: form.id },
    { enabled: isExpanded && activeTab === "responses" }
  );

  const generateInsightsMutation = trpc.ai.generateInsights.useMutation();
  const exportCSVMutation = trpc.submissions.exportCSV.useMutation();

  const [aiInsights, setAIInsights] = useState<any>(null);
  const [isInsightsGenerating, setIsInsightsGenerating] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  const handleGenerateInsights = async () => {
    setIsInsightsGenerating(true);
    setInsightsError("");
    try {
      const insights = await generateInsightsMutation.mutateAsync({
        formId: form.id,
      });
      setAIInsights(insights);
    } catch (e: any) {
      setInsightsError(e.message || "Failed to analyze submissions");
    } finally {
      setIsInsightsGenerating(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await exportCSVMutation.mutateAsync({ formId: form.id });
      
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", res.filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert("Export failed: " + e.message);
    }
  };

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

  const fields = (form.schemaJson as any)?.fields || [];

  return (
    <React.Fragment>
      <tr 
        className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="py-4 px-6">
          <div className="font-semibold text-foreground truncate max-w-xs">{form.title}</div>
          {form.description && (
            <div className={`text-xs text-muted-foreground mt-0.5 max-w-xs transition-all ${isExpanded ? "whitespace-normal" : "truncate"}`}>
              {form.description}
            </div>
          )}
        </td>
        <td className="py-4 px-6">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${getVisibilityColor(form.visibility)}`}>
            {form.visibility}
          </span>
        </td>
        <td className="py-4 px-6 text-sm font-medium text-foreground">
          {form.totalViews ?? 0}
        </td>
        <td className="py-4 px-6 text-sm font-medium text-foreground">
          {form.totalResponses ?? 0}
        </td>
        <td className="py-4 px-6 text-sm font-medium text-foreground">
          {form.totalViews > 0 ? Math.round((form.totalResponses / form.totalViews) * 100) : 0}%
        </td>
        <td className="py-4 px-6">
          <div className="flex gap-2 items-center">
            <Link
              href={`/dashboard/my-forms/${form.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-8 items-center gap-1 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground px-3 text-xs font-bold text-muted-foreground transition-colors shadow-sm"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </td>
      </tr>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <tr>
            <td colSpan={6} className="p-0 border-b border-border bg-muted/10">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "tween", ease: "linear", duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-6">
              <div className="flex items-center gap-6 border-b border-border mb-6">
                <button
                  className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "analytics" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </button>
                <button
                  className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "responses" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("responses")}
                >
                  Responses
                </button>
              </div>
              
              {activeTab === "analytics" && (
                <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  {isAnalyticsLoading ? (
                    <div className="py-10 flex items-center justify-center"><LoadingSpinner className="w-6 h-6" /></div>
                  ) : !analytics ? (
                    <div className="py-6 text-center text-muted-foreground text-xs">Failed to load analytics.</div>
                  ) : (
                    <div className="space-y-6">
                      {/* Stats Cards */}
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="border-border bg-card p-4 shadow-sm relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Views</span>
                              <div className="text-lg font-bold font-outfit text-foreground">{analytics.totalViews}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <Eye className="h-4 w-4" />
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="border-border bg-card p-4 shadow-sm relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Responses</span>
                              <div className="text-lg font-bold font-outfit text-foreground">{analytics.totalResponses}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="border-border bg-card p-4 shadow-sm relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Rate</span>
                              <div className="text-lg font-bold font-outfit text-foreground">{analytics.conversionRate}%</div>
                            </div>
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400">
                              <Percent className="h-4 w-4" />
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* 30-Day Activity Area Chart */}
                      {analytics.timeline && analytics.timeline.length > 0 && (
                        <Card className="border-border bg-card p-4 shadow-sm">
                          <h3 className="font-outfit font-bold text-foreground text-xs mb-3">Submissions Trend</h3>
                          <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={analytics.timeline}>
                                <defs>
                                  <linearGradient id="colorSubSide" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.1)" />
                                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={8} tickLine={false} tickFormatter={(str) => str.split("-")[2] || ""} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={8} tickLine={false} axisLine={false} width={12} />
                                <RechartsTooltip />
                                <Area type="monotone" dataKey="submissions" stroke="hsl(var(--chart-1))" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSubSide)" name="Subs" />
                                <Area type="monotone" dataKey="views" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="3 3" fill="none" name="Views" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>
                      )}

                      {/* AI INSIGHTS BLOCK */}
                      <Card className="border-border bg-card p-4 shadow-sm space-y-4 text-card-foreground">
                        <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-border">
                          <div className="flex items-center gap-1.5 text-primary font-bold">
                            <Sparkles className="h-4 w-4" />
                            <h3 className="font-outfit text-xs">AI Insights</h3>
                          </div>

                          <Button
                            onClick={handleGenerateInsights}
                            disabled={isInsightsGenerating || analytics.totalResponses === 0}
                            size="sm"
                            className="h-7 items-center gap-1 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-[10px] disabled:opacity-50 px-2.5 transition-colors"
                          >
                            {isInsightsGenerating ? <LoadingSpinner className="w-3 h-3" color="text-primary-foreground" /> : <Sparkles className="h-3 w-3" />}
                            <span>Generate Insights</span>
                          </Button>
                        </div>

                        {insightsError && (
                          <div className="rounded bg-destructive/10 border border-destructive/20 text-destructive text-[10px] p-2 flex items-center gap-2">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>{insightsError}</span>
                          </div>
                        )}

                        {analytics.totalResponses === 0 && (
                          <div className="text-center py-2 text-muted-foreground text-[10px]">
                            Collect some submissions first to generate AI insights.
                          </div>
                        )}

                        {aiInsights && (
                          <div className="space-y-4 text-[11px] text-muted-foreground leading-relaxed">
                            <div>
                              <span className="font-bold text-foreground block">Summary</span>
                              <p className="mt-0.5 text-muted-foreground text-[10px]">{aiInsights.summary}</p>
                            </div>

                            <div className="flex gap-2">
                              <div className="flex-1 rounded-lg bg-muted p-2.5 border border-border">
                                <span className="font-bold text-foreground block mb-0.5">Sentiment</span>
                                <span className="font-semibold text-primary">{aiInsights.sentiment}</span>
                              </div>
                              <div className="flex-1 rounded-lg bg-muted p-2.5 border border-border">
                                <span className="font-bold text-foreground block mb-0.5">Keywords</span>
                                <span className="truncate block font-semibold text-muted-foreground">{aiInsights.topKeywords?.slice(0, 3).join(", ")}</span>
                              </div>
                            </div>

                            {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                              <div className="pt-2 border-t border-border">
                                <span className="font-bold text-foreground block mb-1">Top Recommendation</span>
                                <p className="text-[10px] text-muted-foreground">{aiInsights.recommendations[0]}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "responses" && (
                <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-outfit font-bold text-foreground text-sm">All Submissions</h3>
                    </div>
                    {responses && responses.length > 0 && (
                      <Button
                        onClick={handleExportCSV}
                        variant="outline"
                        size="sm"
                        className="h-8 items-center gap-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground shadow-sm shrink-0"
                      >
                        <Download className="h-3.5 w-3.5" /> Export CSV
                      </Button>
                    )}
                  </div>

                  {isResponsesLoading ? (
                    <div className="flex items-center justify-center py-10"><LoadingSpinner className="w-6 h-6" /></div>
                  ) : !responses || responses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-xs">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <span>No submissions yet.</span>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                      {responses.map((sub: any) => {
                        const answers = sub.answersJson as Record<string, any>;
                        return (
                          <Card key={sub.id} className="p-4 bg-muted/20 hover:bg-muted/30 border border-border space-y-3 text-xs shadow-none">
                            <div className="flex items-center justify-between border-b border-border pb-2">
                              <span className="font-mono text-[9px] text-muted-foreground truncate pr-3">{sub.id}</span>
                              <span className="text-[9px] text-muted-foreground font-medium shrink-0">
                                {new Date(sub.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                              </span>
                            </div>
                            
                            <div className="space-y-1.5">
                              {fields.map((field: any) => {
                                const ans = answers[field.id];
                                if (ans === undefined || ans === null || ans === "") return null;
                                return (
                                  <div key={field.id} className="grid grid-cols-3 gap-2">
                                    <span className="text-muted-foreground font-medium truncate">{field.label}:</span>
                                    <span className="col-span-2 text-foreground truncate font-semibold">
                                      {Array.isArray(ans) ? ans.join(", ") : String(ans)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
