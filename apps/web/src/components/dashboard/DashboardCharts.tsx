import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, FileBarChart, Layers, Eye, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface DashboardChartsProps {
  stats: {
    timeline?: Array<{ date: string; submissions: number; views: number }>;
    topForms?: Array<{ id: string; title: string; views: number; submissions: number }>;
  } | null | undefined;
  isLoading: boolean;
}

export function DashboardCharts({ stats, isLoading }: DashboardChartsProps) {
  const timeline = stats?.timeline || [];
  const topForms = stats?.topForms || [];

  // Render Skeleton loader while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border bg-card p-6 shadow-sm rounded-2xl flex flex-col h-[320px]">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="flex-1 w-full relative">
            <Skeleton className="absolute inset-0 rounded-xl" />
          </div>
        </Card>
        <Card className="lg:col-span-1 border border-border bg-card p-6 shadow-sm rounded-2xl flex flex-col h-[320px]">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex-1 w-full space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Handle empty state gracefully
  const hasTimelineData = timeline.some(t => t.submissions > 0 || t.views > 0);
  const hasTopForms = topForms.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* ── Graph 1: 30-Day Activity Area Chart (Submissions & Views) ── */}
      <Card className="lg:col-span-2 border border-border bg-card p-6 shadow-sm rounded-2xl flex flex-col min-h-[320px] transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-foreground text-sm">Form Submissions Trend</h3>
              <p className="text-[11px] text-muted-foreground">Daily aggregate views and responses over the last 30 days</p>
            </div>
          </div>
          {hasTimelineData && (
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-muted-foreground">Responses</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-[220px] w-full relative">
          {!hasTimelineData ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-muted/5 rounded-xl border border-dashed border-border/40">
              <Layers className="h-8 w-8 text-muted-foreground/35 mb-2.5 animate-pulse" />
              <h4 className="font-outfit text-xs font-bold text-muted-foreground">No submission data yet</h4>
              <p className="text-[10px] text-muted-foreground/80 max-w-[240px] mt-0.5">Create and publish forms to start tracking your views and submission trends here.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardColorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="dashboardColorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
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
                  labelClassName="font-bold text-foreground"
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={1.5} 
                  fillOpacity={1} 
                  fill="url(#dashboardColorViews)" 
                  name="Views" 
                />
                <Area 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#6366f1" 
                  strokeWidth={1.8} 
                  fillOpacity={1} 
                  fill="url(#dashboardColorSubs)" 
                  name="Submissions" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* ── Graph 2: Top Forms Performance ── */}
      <Card className="lg:col-span-1 border border-border bg-card p-6 shadow-sm rounded-2xl flex flex-col min-h-[320px] transition-all hover:shadow-md">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <FileBarChart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-foreground text-sm">Top Performing Forms</h3>
            <p className="text-[11px] text-muted-foreground">Most active form submissions and views</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start">
          {!hasTopForms ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-muted/5 rounded-xl border border-dashed border-border/40">
              <FileBarChart className="h-7 w-7 text-muted-foreground/35 mb-2" />
              <h4 className="font-outfit text-xs font-bold text-muted-foreground">No active forms</h4>
              <p className="text-[10px] text-muted-foreground/80 max-w-[200px] mt-0.5">Your forms and their responses will be ranked here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topForms.map((item, idx) => {
                const maxSubmissions = Math.max(...topForms.map(t => t.submissions), 1);
                const widthPercent = Math.max(10, Math.round((item.submissions / maxSubmissions) * 100));

                return (
                  <div key={item.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs gap-3">
                      <Link 
                        href={`/dashboard/my-forms/${item.id}?tab=analytics`}
                        className="font-semibold text-foreground truncate max-w-[170px] hover:text-primary hover:underline transition-colors"
                        title={item.title}
                      >
                        {idx + 1}. {item.title}
                      </Link>
                      <div className="flex items-center gap-3 text-muted-foreground font-medium shrink-0">
                        <Link 
                          href={`/dashboard/my-forms/${item.id}?tab=analytics`}
                          className="flex items-center gap-0.5 hover:text-foreground transition-colors"
                          title="View Analytics"
                        >
                          <Eye className="h-3.5 w-3.5" /> {item.views}
                        </Link>
                        <Link 
                          href={`/dashboard/my-forms/${item.id}?tab=responses`}
                          className="flex items-center gap-0.5 text-primary font-bold hover:opacity-85 transition-opacity"
                          title="View Responses"
                        >
                          <Inbox className="h-3.5 w-3.5" /> {item.submissions}
                        </Link>
                      </div>
                    </div>
                    {/* Visual bar tracker */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
