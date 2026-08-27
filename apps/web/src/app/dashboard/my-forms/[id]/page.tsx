"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "../../../../utils/trpc";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  Pencil, 
  Eye, 
  Inbox, 
  Percent, 
  Download, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Trash2,
  Calendar,
  CheckCircle2,
  Globe
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@sec-form/ui";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";

export default function FormDetailViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session, status } = useSession();
  const utils = trpc.useUtils();

  const t = useTranslations("Analytics");
  const tDashboard = useTranslations("Dashboard");

  const [activeTab, setActiveTab] = useState<"analytics" | "responses" | "insights">("analytics");
  const [aiInsights, setAIInsights] = useState<any>(null);
  const [isInsightsGenerating, setIsInsightsGenerating] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Queries
  const { data: form, isLoading: isFormLoading, error: formError } = trpc.forms.get.useQuery(
    { id },
    { enabled: !!session?.user }
  );

  const { data: analytics, isLoading: isAnalyticsLoading } = trpc.analytics.getFormAnalytics.useQuery(
    { formId: id },
    { enabled: !!session?.user }
  );

  const { data: submissions, isLoading: isSubmissionsLoading } = trpc.submissions.list.useQuery(
    { formId: id },
    { enabled: !!session?.user && activeTab === "responses" }
  );

  // Mutations
  const deleteFormMutation = trpc.forms.delete.useMutation();
  const generateInsightsMutation = trpc.ai.generateInsights.useMutation();
  const exportCSVMutation = trpc.submissions.exportCSV.useMutation();

  const handleExportCSV = async () => {
    try {
      const res = await exportCSVMutation.mutateAsync({ formId: id });
      
      const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", res.filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to export submissions");
    }
  };

  const handleGenerateInsights = async () => {
    setIsInsightsGenerating(true);
    setInsightsError("");
    try {
      const insights = await generateInsightsMutation.mutateAsync({
        formId: id,
      });
      setAIInsights(insights);
      toast.success("AI Insights generated successfully!");
    } catch (e: any) {
      setInsightsError(e.message || "Failed to analyze submissions");
    } finally {
      setIsInsightsGenerating(false);
    }
  };

  const handleDeleteForm = async () => {
    if (!window.confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteFormMutation.mutateAsync({ id });
      utils.forms.list.invalidate();
      toast.success("Form deleted successfully");
      router.push("/dashboard/my-forms");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete form");
    }
  };

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [status, router]);

  if (isFormLoading || status === "loading") {
    return (
      <div className="flex-1 p-6 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-80 rounded-lg" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-[350px] w-full rounded-2xl pt-6" />
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <Layers className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="font-outfit text-base font-bold text-foreground">Form not found</h3>
        <p className="text-muted-foreground text-xs max-w-sm mt-1">This form does not exist or you do not have permission to view it.</p>
        <Link href="/dashboard/my-forms" className="mt-6">
          <Button variant="outline" className="h-9 gap-1.5 rounded-xl border border-border">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Forms
          </Button>
        </Link>
      </div>
    );
  }

  const fields = (form.schemaJson as any)?.fields || [];
  const hostOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const publicFormUrl = `${hostOrigin}/f/${form.slug}`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-transparent">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between border-b border-border bg-card/10 backdrop-blur-[1px] px-6 sm:px-8 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/my-forms">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-outfit text-lg font-black text-foreground tracking-tight leading-none truncate max-w-[280px] sm:max-w-md" title={form.title}>
                {form.title}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                form.visibility === "public" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : form.visibility === "unlisted"
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                  : "bg-muted border-border/80 text-muted-foreground"
              }`}>
                {form.visibility.toUpperCase()}
              </span>
            </div>
            {form.description && (
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm truncate">{form.description}</p>
            )}
          </div>
        </div>

        {/* Toolbar CTA Actions */}
        <div className="flex items-center gap-2">
          {form.visibility !== "draft" && (
            <a href={publicFormUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="h-9 items-center gap-1 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground">
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">View Live</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
              </Button>
            </a>
          )}
          <Link href={`/dashboard/builder/${form.id}`}>
            <Button size="sm" className="h-9 items-center gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm">
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Form</span>
            </Button>
          </Link>
          <Button size="sm" onClick={handleDeleteForm} variant="outline" className="h-9 w-9 p-0 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Row 1: Metrics stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between text-card-foreground">
            <div className="text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Total Views</span>
              <span className="mt-2 text-2xl font-bold font-outfit text-foreground block">{analytics?.totalViews ?? 0}</span>
            </div>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary shrink-0">
              <Eye className="h-5 w-5" />
            </div>
          </Card>
          
          <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between text-card-foreground">
            <div className="text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Total Submissions</span>
              <span className="mt-2 text-2xl font-bold font-outfit text-foreground block">{analytics?.totalResponses ?? 0}</span>
            </div>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 shrink-0">
              <Inbox className="h-5 w-5" />
            </div>
          </Card>

          <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center justify-between text-card-foreground">
            <div className="text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Conversion Rate</span>
              <span className="mt-2 text-2xl font-bold font-outfit text-foreground block">
                {analytics?.conversionRate ?? 0}%
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 shrink-0">
              <Percent className="h-5 w-5" />
            </div>
          </Card>
        </div>

        {/* Row 2: Sub-navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-border pb-px">
          <button
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "analytics" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics & Trend
          </button>
          <button
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "responses" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("responses")}
          >
            Submissions List ({analytics?.totalResponses ?? 0})
          </button>
          <button
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "insights" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("insights")}
          >
            AI Insight Report
          </button>
        </div>

        {/* Row 3: Active Tab Body Content */}
        <div>
          {/* TAB 1: ANALYTICS & TREND GRAPH */}
          {activeTab === "analytics" && (
            <Card className="border border-border bg-card p-6 shadow-sm rounded-2xl flex flex-col min-h-[360px] animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <h3 className="font-outfit font-bold text-foreground text-sm">30-Day Activity Trend</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Views and submissions mapped daily over time</p>
                </div>
                {analytics?.timeline && analytics.timeline.length > 0 && (
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      <span className="text-muted-foreground">Submissions</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-[240px] w-full relative">
                {isAnalyticsLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner className="w-8 h-8" />
                  </div>
                ) : !analytics?.timeline || analytics.timeline.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-xl bg-muted/5">
                    <Layers className="h-10 w-10 text-muted-foreground/30 mb-2" />
                    <h4 className="font-outfit text-xs font-bold text-muted-foreground">No trend activity yet</h4>
                    <p className="text-[10px] text-muted-foreground/80 max-w-[260px] mt-0.5">Visits and views on the live form URL will start drawing your activity timeline.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.timeline} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="detailViewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.18}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="detailSubsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.08)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(str) => {
                          const parts = str.split("-");
                          return parts[2] ? `${parts[1]}/${parts[2]}` : "";
                        }} 
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={9} 
                        tickLine={false} 
                        axisLine={false} 
                        width={20}
                      />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                          fontSize: "11px",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                        }}
                      />
                      <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={1.5} fillOpacity={1} fill="url(#detailViewsGrad)" name="Views" />
                      <Area type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={1.8} fillOpacity={1} fill="url(#detailSubsGrad)" name="Submissions" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          )}

          {/* TAB 2: SUBMISSIONS LIST TABLE */}
          {activeTab === "responses" && (
            <Card className="border border-border bg-card p-6 shadow-sm rounded-2xl flex flex-col min-h-[360px] animate-in fade-in-50 duration-200">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <div>
                  <h3 className="font-outfit font-bold text-foreground text-sm">All Form Submissions</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">List of raw answer sheets received from participants</p>
                </div>
                {submissions && submissions.length > 0 && (
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

              {isSubmissionsLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <LoadingSpinner className="w-8 h-8" />
                </div>
              ) : !submissions || submissions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-xl bg-muted/5">
                  <Layers className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <h4 className="font-outfit text-xs font-bold text-muted-foreground">No submissions yet</h4>
                  <p className="text-[10px] text-muted-foreground/80 max-w-[260px] mt-0.5">Your respondents' submission data will be collected and loaded here.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {submissions.map((sub: any, idx) => {
                    const answers = sub.answersJson as Record<string, any>;
                    return (
                      <Card key={sub.id} className="p-4 bg-muted/10 hover:bg-muted/20 border border-border/60 space-y-3 shadow-none text-xs transition-colors rounded-xl">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="font-bold text-foreground">Response #{submissions.length - idx}</span>
                          <span className="text-[10px] text-muted-foreground font-medium shrink-0 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(sub.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-1">
                          {fields.map((field: any) => {
                            const ans = answers[field.id];
                            if (ans === undefined || ans === null || ans === "") return null;
                            return (
                              <div key={field.id} className="space-y-0.5 border-b border-border/10 pb-1.5">
                                <span className="text-[10px] text-muted-foreground font-semibold uppercase block tracking-wider">{field.label}</span>
                                <span className="text-foreground font-semibold text-xs leading-relaxed block break-words">
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
            </Card>
          )}

          {/* TAB 3: AI INSIGHTS */}
          {activeTab === "insights" && (
            <Card className="border border-border bg-card p-6 shadow-sm rounded-2xl flex flex-col min-h-[360px] animate-in fade-in-50 duration-200">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-2 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-foreground text-sm">AI Submissions Insight</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Let Gemini analyze submission trends and extract anomalies</p>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateInsights}
                  disabled={isInsightsGenerating || !analytics || analytics.totalResponses === 0}
                  className="h-9 items-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs disabled:opacity-50 px-4 transition-colors rounded-xl shadow-sm"
                >
                  {isInsightsGenerating ? (
                    <>
                      <LoadingSpinner className="w-3.5 h-3.5 mr-1" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Generate Insight Report</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {isInsightsGenerating ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <LoadingSpinner className="w-8 h-8" color="text-primary" />
                    <span className="text-xs text-muted-foreground font-semibold animate-pulse">Gemini is processing your submissions...</span>
                  </div>
                ) : insightsError ? (
                  <div className="text-center p-6 text-red-500 text-xs font-semibold">{insightsError}</div>
                ) : !aiInsights ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
                    <Sparkles className="h-10 w-10 text-primary/40 mb-3 animate-pulse" />
                    <h4 className="font-outfit text-xs font-bold text-muted-foreground">AI Analysis Pending</h4>
                    <p className="text-[10px] text-muted-foreground/80 mt-1.5 leading-relaxed">
                      Click the button above to run standard sentiment extraction and distribution reports on your collected submissions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs leading-relaxed max-w-4xl text-card-foreground bg-muted/5 border border-border/40 p-5 rounded-xl overflow-y-auto max-h-[420px] custom-scrollbar">
                    <div className="flex items-center gap-1.5 text-primary font-bold border-b border-border/60 pb-2 mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-outfit text-xs">Gemini Form Insight Summary</span>
                    </div>
                    {/* Render paragraph chunks beautifully */}
                    <div className="space-y-3 whitespace-pre-line text-foreground font-medium">
                      {aiInsights.insights || aiInsights}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
