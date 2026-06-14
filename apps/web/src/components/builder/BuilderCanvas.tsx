import React from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Download, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  CheckCircle2,
  Eye,
  Percent
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { FormField } from "@sec-form/validators";
import { LoadingSpinner } from "@sec-form/ui";
import { TabBar } from "../TabBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface BuilderCanvasProps {
  middleTab: "form" | "responses" | "analytics" | "settings";
  setMiddleTab: (tab: "form" | "responses" | "analytics" | "settings") => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  fields: FormField[];
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleReorder: (index: number, direction: "up" | "down") => void;
  handleDeleteField: (id: string) => void;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  saveForm: (fields: FormField[]) => void;
  responses: any;
  isResponsesLoading: boolean;
  handleExportCSV: () => void;
  analytics: any;
  isAnalyticsLoading: boolean;
  aiInsights: any;
  isInsightsGenerating: boolean;
  insightsError: string;
  handleGenerateInsights: () => void;
  visibility: "draft" | "public" | "unlisted";
  setVisibility: (mode: "draft" | "public" | "unlisted") => void;
  slug: string;
  setSlug: (slug: string) => void;
  handleSaveSettings: (e: React.FormEvent) => void;
}

export function BuilderCanvas({
  middleTab,
  setMiddleTab,
  title,
  setTitle,
  description,
  setDescription,
  fields,
  selectedFieldId,
  setSelectedFieldId,
  handleReorder,
  handleDeleteField,
  handleUpdateField,
  saveForm,
  responses,
  isResponsesLoading,
  handleExportCSV,
  analytics,
  isAnalyticsLoading,
  aiInsights,
  isInsightsGenerating,
  insightsError,
  handleGenerateInsights,
  visibility,
  setVisibility,
  slug,
  setSlug,
  handleSaveSettings,
}: BuilderCanvasProps) {
  const t = useTranslations("Builder");
  const tCommon = useTranslations("Common");

  const MIDDLE_TABS = [
    { value: "form", label: t("tabBuild"), icon: FileText, iconColorClass: "text-indigo-500", shortcut: "ctrl+3" },
    { value: "responses", label: t("tabSubmissions"), icon: CheckCircle2, iconColorClass: "text-emerald-500", shortcut: "ctrl+4" },
    { value: "analytics", label: "Analytics", icon: BarChart3, iconColorClass: "text-amber-500", shortcut: "ctrl+5" },
    { value: "settings", label: "Settings", icon: Settings, iconColorClass: "text-rose-500", shortcut: "ctrl+6" }
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-muted/5">
      {/* Tabs header */}
      <TabBar
        items={MIDDLE_TABS}
        selectedValue={middleTab}
        onChange={setMiddleTab}
      />

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 min-w-0">
        {middleTab === "form" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-border bg-card p-6 shadow-sm flex flex-col gap-5">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    saveForm(fields);
                  }}
                  className="w-full text-2xl font-bold font-outfit border-none focus:outline-none bg-transparent text-foreground border-b border-transparent focus:border-border pb-1 transition-colors"
                  placeholder={t("canvasTitlePlaceholder")}
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    saveForm(fields);
                  }}
                  className="w-full text-sm text-muted-foreground border-none focus:outline-none bg-transparent border-b border-transparent focus:border-border mt-2 pb-1 transition-colors"
                  placeholder={t("canvasDescPlaceholder")}
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                {fields.length === 0 ? (
                  <div className="py-16 border border-dashed border-border rounded-2xl text-center text-muted-foreground text-sm">
                    {t("canvasEmptyDesc")}
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                        selectedFieldId === field.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card/40 hover:border-border/80"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {field.type} {field.required && <span className="text-destructive">*</span>}
                          </span>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className="font-semibold text-foreground mt-0.5 w-full bg-transparent border-b border-transparent focus:border-primary focus:outline-none transition-colors"
                            placeholder="Field Label"
                          />
                          <input
                            type="text"
                            value={field.description || ""}
                            onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground text-xs mt-0.5 w-full bg-transparent border-b border-transparent focus:border-primary focus:outline-none transition-colors"
                            placeholder="Field description (optional)"
                          />
                          
                          {/* Card Field Input Template Previews */}
                          <div className="mt-3">
                            {["text", "email", "date"].includes(field.type) && (
                              <Input type="text" className="h-9 w-full max-w-sm rounded-lg border border-border bg-background/40 px-3 text-xs" placeholder={field.placeholder || "Response goes here..."} disabled />
                            )}
                            {field.type === "time" && (
                              <Input type="time" className="h-9 w-32 rounded-lg border border-border bg-background/40 px-3 text-xs" disabled />
                            )}
                            {field.type === "textarea" && (
                              <textarea className="w-full max-w-md h-16 rounded-lg border border-border bg-background/40 p-2 text-xs focus:outline-none focus:ring-0" placeholder={field.placeholder || "Write long response..."} disabled />
                            )}
                            {field.type === "number" && (
                              <Input type="number" className="h-9 w-28 rounded-lg border border-border bg-background/40 px-3 text-xs" placeholder="0" disabled />
                            )}
                            {field.type === "checkbox" && (
                              <div className="flex items-center gap-2"><input type="checkbox" className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0" disabled /><span className="text-xs text-muted-foreground">Agree to terms</span></div>
                            )}
                            {field.type === "rating" && (
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className="text-xl text-muted-foreground select-none">★</span>
                                ))}
                              </div>
                            )}
                            {["select", "multiselect"].includes(field.type) && field.options && (
                              <div className="flex flex-wrap gap-1">
                                {field.options.map((opt) => (
                                  <span key={opt} className="rounded bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground border border-border/40">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reordering Controls & Delete Action */}
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(index, "up");
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(index, "down");
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            disabled={index === fields.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteField(field.id);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {middleTab === "responses" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <div>
                <h3 className="font-outfit font-bold text-foreground text-sm">{t("subTotal")}</h3>
                <p className="text-muted-foreground text-[10px] mt-0.5">List of submissions for this form.</p>
              </div>
              {responses && responses.length > 0 && (
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  size="sm"
                  className="h-8 items-center gap-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground shadow-sm shrink-0"
                >
                  <Download className="h-3.5 w-3.5" /> {t("shareCopy")}
                </Button>
              )}
            </div>

            {isResponsesLoading ? (
              <div className="flex items-center justify-center py-10"><LoadingSpinner className="w-6 h-6" /></div>
            ) : !responses || responses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-xs">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <span>{t("subNoData")}</span>
              </div>
            ) : (
              <div className="space-y-4">
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
                        {fields.map((field) => {
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

        {middleTab === "analytics" && (
          <div className="max-w-3xl mx-auto space-y-6">
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
                    <h3 className="font-outfit font-bold text-foreground text-xs mb-3">{t("submissionsTrend")}</h3>
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
                          <Tooltip />
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
                      <h3 className="font-outfit text-xs">{t("aiInsightsTitle")}</h3>
                    </div>

                    <Button
                      onClick={handleGenerateInsights}
                      disabled={isInsightsGenerating || analytics.totalResponses === 0}
                      size="sm"
                      className="h-7 items-center gap-1 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-[10px] disabled:opacity-50 px-2.5 transition-colors"
                    >
                      {isInsightsGenerating ? <LoadingSpinner className="w-3 h-3" color="text-primary-foreground" /> : <Sparkles className="h-3 w-3" />}
                      <span>{t("aiInsightsGenerate")}</span>
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
                      {t("aiInsightsNoData")}
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

        {middleTab === "settings" && (
          <div className="max-w-xl mx-auto space-y-6">
            <h3 className="font-outfit font-bold text-foreground text-sm pb-2 border-b border-border">Visibility & Custom URL</h3>
            
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs text-muted-foreground font-semibold">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Visibility Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["draft", "public", "unlisted"] as const).map((mode) => (
                    <Button
                      key={mode}
                      type="button"
                      variant={visibility === mode ? "default" : "outline"}
                      onClick={() => setVisibility(mode)}
                      className={`h-9 w-full font-bold text-[10px] uppercase transition-colors rounded-xl`}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground mt-2 font-normal leading-normal">
                  {visibility === "draft" && "Draft forms are not accessible publicly and do not accept responses."}
                  {visibility === "public" && "Public forms are visible in the explore page/gallery and accept responses."}
                  {visibility === "unlisted" && "Unlisted forms accept responses, but are hidden from general explore listings."}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Custom Form URL Slug</label>
                <div className="flex items-center rounded-xl border border-border overflow-hidden bg-muted/50">
                  <span className="text-[10px] font-mono text-muted-foreground px-3 bg-muted h-9 flex items-center border-r border-border">/f/</span>
                  <Input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 h-9 px-3 bg-transparent border-0 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    placeholder="custom-slug"
                    required
                  />
                </div>
                <p className="text-[9px] text-muted-foreground mt-1 font-normal">Shorthand slug name. Letters, numbers, and dashes only.</p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <Button
                  type="submit"
                  className="h-9 px-4 font-semibold text-xs rounded-xl"
                >
                  {tCommon("save")}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
