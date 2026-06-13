"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { 
  ArrowLeft, FileText, Palette, Code, BarChart3, Settings, 
  Trash2, Plus, Sparkles, Copy, Eye, CheckCircle, AlertCircle, 
  ChevronUp, ChevronDown, CheckCircle2, QrCode, Download, RefreshCw
} from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { QRCodeSVG } from "qrcode.react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = params.id as string;
  const initialTab = searchParams.get("tab") || "build";
  
  const utils = trpc.useUtils();

  // Active Tab
  const [activeTab, setActiveTab] = useState(initialTab);

  // Queries
  const { data: form, isLoading: isFormLoading, error: formError } = trpc.forms.get.useQuery({ id });
  const { data: analytics, isLoading: isAnalyticsLoading } = trpc.analytics.getFormAnalytics.useQuery(
    { formId: id },
    { enabled: activeTab === "analytics" }
  );
  const { data: responses, isLoading: isResponsesLoading } = trpc.submissions.list.useQuery(
    { formId: id },
    { enabled: activeTab === "responses" }
  );

  // Mutations
  const updateFormMutation = trpc.forms.update.useMutation();
  const generateThemeMutation = trpc.ai.generateTheme.useMutation();
  const generateInsightsMutation = trpc.ai.generateInsights.useMutation();
  const exportCSVMutation = trpc.submissions.exportCSV.useMutation();

  // Local Form state
  const [fields, setFields] = useState<FormField[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  
  // Theme state
  const [activeTheme, setActiveTheme] = useState<ThemeConfig | null>(null);
  const [themePrompt, setThemePrompt] = useState("");
  const [isThemeGenerating, setIsThemeGenerating] = useState(false);

  // AI Insights state
  const [aiInsights, setAIInsights] = useState<any>(null);
  const [isInsightsGenerating, setIsInsightsGenerating] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Settings state
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<"draft" | "public" | "unlisted">("draft");
  
  // Notification banner
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");

  // Sync state from query load
  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setDescription(form.description || "");
      setFields((form.schemaJson as any).fields || []);
      setActiveTheme(form.themeJson as any);
      setSlug(form.slug);
      setVisibility(form.visibility as any);
    }
  }, [form]);

  // Track tab parameter changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Auto-Save Form Logic
  const saveForm = async (updatedFields: FormField[], updatedTheme?: ThemeConfig) => {
    setSaveStatus("saving");
    try {
      await updateFormMutation.mutateAsync({
        id,
        title,
        description,
        schemaJson: { fields: updatedFields },
        themeJson: updatedTheme || activeTheme || undefined,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e: any) {
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Auto-save failed");
    }
  };

  // ----------------------------------------------------
  // FIELD OPERATIONS
  // ----------------------------------------------------

  const handleAddField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `Untitled ${type.charAt(0).toUpperCase() + type.slice(1)} Question`,
      required: false,
      placeholder: "",
      options: ["select", "multiselect"].includes(type) ? ["Option 1", "Option 2"] : undefined,
    };
    const updated = [...fields, newField];
    setFields(updated);
    setSelectedFieldId(newField.id);
    saveForm(updated);
  };

  const handleDeleteField = (fieldId: string) => {
    const updated = fields.filter((f) => f.id !== fieldId);
    setFields(updated);
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
    saveForm(updated);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updated = fields.map((f) => {
      if (f.id === fieldId) {
        return { ...f, ...updates } as FormField;
      }
      return f;
    });
    setFields(updated);
    saveForm(updated);
  };

  const handleReorder = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === fields.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...fields];
    
    // Swap
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setFields(updated);
    saveForm(updated);
  };

  // ----------------------------------------------------
  // AI THEME GENERATION
  // ----------------------------------------------------

  const handleGenerateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!themePrompt.trim()) return;

    setIsThemeGenerating(true);
    try {
      const generatedTheme = await generateThemeMutation.mutateAsync({
        prompt: themePrompt,
      });

      setActiveTheme(generatedTheme);
      saveForm(fields, generatedTheme);
      setThemePrompt("");
    } catch (e: any) {
      alert("Failed to generate theme: " + e.message);
    } finally {
      setIsThemeGenerating(false);
    }
  };

  // ----------------------------------------------------
  // AI INSIGHTS GENERATION
  // ----------------------------------------------------

  const handleGenerateInsights = async () => {
    setIsInsightsGenerating(true);
    setInsightsError("");
    try {
      const insights = await generateInsightsMutation.mutateAsync({
        formId: id,
      });
      setAIInsights(insights);
    } catch (e: any) {
      setInsightsError(e.message || "Failed to analyze submissions");
    } finally {
      setIsInsightsGenerating(false);
    }
  };

  // ----------------------------------------------------
  // SETTINGS & PUBLISHING
  // ----------------------------------------------------

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      await updateFormMutation.mutateAsync({
        id,
        title,
        description,
        slug,
        visibility,
      });
      utils.forms.get.invalidate({ id });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (e: any) {
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Failed to save settings");
    }
  };

  // ----------------------------------------------------
  // CSV RESPONSE EXPORT
  // ----------------------------------------------------

  const handleExportCSV = async () => {
    try {
      const res = await exportCSVMutation.mutateAsync({ formId: id });
      
      // Create download link browser side
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

  // Loader state
  if (isFormLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner className="w-10 h-10" color="text-indigo-600" />
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className="min-h-screen p-10 flex flex-col items-center justify-center bg-slate-50 gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h2 className="font-outfit text-2xl font-bold text-slate-800">Form Not Found</h2>
        <p className="text-slate-500">The requested form does not exist or you do not have permission to view it.</p>
        <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const focusedField = fields.find((f) => f.id === selectedFieldId);
  const publicFormUrl = `${window.location.origin}/f/${form.slug}`;

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full gap-6">
      {/* Workspace Header Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-outfit text-2xl font-bold text-slate-900 leading-none truncate max-w-[280px] md:max-w-md">{title}</h1>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ring-1 ring-inset ${
                visibility === "public" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10" :
                visibility === "unlisted" ? "bg-amber-50 text-amber-700 ring-amber-600/10" : "bg-slate-100 text-slate-600 ring-slate-500/10"
              }`}>
                {visibility}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1 truncate max-w-[280px] md:max-w-md">{description || "No description loaded."}</p>
          </div>
        </div>

        {/* Tab Controls & AutoSave Status */}
        <div className="flex flex-wrap items-center gap-3">
          {saveStatus === "saving" && <span className="text-xs text-slate-400 flex items-center gap-1.5"><RefreshCw className="h-3 w-3 animate-spin text-indigo-600" /> Saving changes...</span>}
          {saveStatus === "saved" && <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Saved</span>}
          {saveStatus === "error" && <span className="text-xs text-rose-600 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {saveErrorMessage}</span>}

          <div className="flex bg-slate-200/60 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button onClick={() => setActiveTab("build")} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === "build" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-950"}`}>
              <FileText className="h-3.5 w-3.5" /> Builder
            </button>
            <button onClick={() => setActiveTab("theme")} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === "theme" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-950"}`}>
              <Palette className="h-3.5 w-3.5" /> Themes
            </button>
            <button onClick={() => setActiveTab("embed")} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === "embed" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-950"}`}>
              <Code className="h-3.5 w-3.5" /> Embed
            </button>
            <button onClick={() => setActiveTab("responses")} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === "responses" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-950"}`}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Responses
            </button>
            <button onClick={() => setActiveTab("analytics")} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === "analytics" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-950"}`}>
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </button>
            <button onClick={() => setActiveTab("settings")} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === "settings" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-950"}`}>
              <Settings className="h-3.5 w-3.5" /> Settings
            </button>
          </div>

          <a href={publicFormUrl} target="_blank" className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
            <Eye className="h-4 w-4" /> Live Form
          </a>
        </div>
      </div>

      {/* WORKSPACE CONTENT PANELS */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* TAB 1: FORM BUILDER */}
        {activeTab === "build" && (
          <>
            {/* Visual canvas editor */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-6">
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      saveForm(fields);
                    }}
                    className="w-full text-2xl font-bold font-outfit border-none focus:outline-none focus:border-b focus:border-slate-200 pb-1"
                    placeholder="Form Title"
                  />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      saveForm(fields);
                    }}
                    className="w-full text-sm text-slate-400 border-none focus:outline-none focus:border-b focus:border-slate-200 mt-2 pb-1"
                    placeholder="Add description..."
                  />
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-4">
                  {fields.length === 0 ? (
                    <div className="py-12 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-sm">
                      Click standard field options on the sidebar to add questions to your form.
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <div
                        key={field.id}
                        onClick={() => setSelectedFieldId(field.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                          selectedFieldId === field.id
                            ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                            : "border-slate-200 bg-slate-50/40 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              {field.type} {field.required && <span className="text-rose-500">*</span>}
                            </span>
                            <div className="font-semibold text-slate-900 mt-1">{field.label}</div>
                            {field.description && <p className="text-slate-400 text-xs mt-1">{field.description}</p>}
                            
                            {/* Preview inputs in editor */}
                            <div className="mt-3">
                              {["text", "email", "date"].includes(field.type) && (
                                <input type="text" className="h-9 w-full max-w-sm rounded border border-slate-200 bg-white/60 px-3 text-xs" placeholder={field.placeholder || "Answer placeholder..."} disabled />
                              )}
                              {field.type === "textarea" && (
                                <textarea className="w-full max-w-md h-16 rounded border border-slate-200 bg-white/60 p-2 text-xs" placeholder={field.placeholder || "Long answer placeholder..."} disabled />
                              )}
                              {field.type === "number" && (
                                <input type="number" className="h-9 w-full max-w-[120px] rounded border border-slate-200 bg-white/60 px-3 text-xs" placeholder="0" disabled />
                              )}
                              {field.type === "checkbox" && (
                                <div className="flex items-center gap-2"><input type="checkbox" disabled /><span className="text-xs text-slate-500">Agree</span></div>
                              )}
                              {field.type === "rating" && (
                                <div className="flex gap-1.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="text-xl text-slate-300 select-none">★</span>
                                  ))}
                                </div>
                              )}
                              {["select", "multiselect"].includes(field.type) && field.options && (
                                <div className="flex flex-wrap gap-1">
                                  {field.options.map((opt) => (
                                    <span key={opt} className="rounded bg-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-300/40">
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Reordering and Delete Arrows */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(index, "up");
                              }}
                              className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(index, "down");
                              }}
                              className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                              disabled={index === fields.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteField(field.id);
                              }}
                              className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar properties layout */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Field Adder Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-outfit font-bold text-slate-950 text-sm mb-4">Add Field Type</h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                  <button onClick={() => handleAddField("text")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Short Text
                  </button>
                  <button onClick={() => handleAddField("textarea")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Long Text
                  </button>
                  <button onClick={() => handleAddField("email")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Email
                  </button>
                  <button onClick={() => handleAddField("number")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Number
                  </button>
                  <button onClick={() => handleAddField("select")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Single Select
                  </button>
                  <button onClick={() => handleAddField("multiselect")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Multi Select
                  </button>
                  <button onClick={() => handleAddField("checkbox")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Checkbox
                  </button>
                  <button onClick={() => handleAddField("rating")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Rating
                  </button>
                  <button onClick={() => handleAddField("date")} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    Date
                  </button>
                </div>
              </div>

              {/* Field Properties Editor */}
              {focusedField ? (
                <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm relative">
                  <h3 className="font-outfit font-bold text-slate-950 text-sm mb-4">Edit Question Properties</h3>
                  
                  <div className="space-y-4 text-xs font-semibold text-slate-600">
                    <div>
                      <label className="uppercase tracking-wider text-[10px] block mb-1">Question Label</label>
                      <input
                        type="text"
                        value={focusedField.label}
                        onChange={(e) => handleUpdateField(focusedField.id, { label: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 font-medium text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-wider text-[10px] block mb-1">Description (optional)</label>
                      <input
                        type="text"
                        value={focusedField.description || ""}
                        onChange={(e) => handleUpdateField(focusedField.id, { description: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-slate-200 font-medium text-slate-800 focus:outline-none"
                      />
                    </div>

                    {["text", "textarea", "email"].includes(focusedField.type) && (
                      <div>
                        <label className="uppercase tracking-wider text-[10px] block mb-1">Placeholder (optional)</label>
                        <input
                          type="text"
                          value={focusedField.placeholder || ""}
                          onChange={(e) => handleUpdateField(focusedField.id, { placeholder: e.target.value })}
                          className="h-9 w-full px-3 rounded-lg border border-slate-200 font-medium text-slate-800 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Options Editor (select, multiselect) */}
                    {["select", "multiselect"].includes(focusedField.type) && (
                      <div>
                        <label className="uppercase tracking-wider text-[10px] block mb-1">Options (comma separated)</label>
                        <input
                          type="text"
                          value={focusedField.options ? focusedField.options.join(", ") : ""}
                          onChange={(e) => {
                            const opts = e.target.value.split(",").map((o) => o.trim()).filter((o) => o.length > 0);
                            handleUpdateField(focusedField.id, { options: opts });
                          }}
                          className="h-9 w-full px-3 rounded-lg border border-slate-200 font-medium text-slate-800 focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="required-toggle"
                        checked={focusedField.required || false}
                        onChange={(e) => handleUpdateField(focusedField.id, { required: e.target.checked })}
                      />
                      <label htmlFor="required-toggle" className="text-slate-700 cursor-pointer">Required Question</label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center text-slate-400 text-xs py-12">
                  Select a question on the canvas to configure its settings.
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: THEME SELECTION */}
        {activeTab === "theme" && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/* AI Theme generator bar */}
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-tr from-indigo-50 to-purple-50 p-6 shadow-sm">
              <div className="flex items-center gap-1.5 text-indigo-800 font-bold mb-1">
                <Sparkles className="h-5 w-5 fill-indigo-200" />
                <h3 className="font-outfit text-lg">AI Theme Generator</h3>
              </div>
              <p className="text-slate-500 text-xs mb-4">Describe your brand color/mood (e.g. "dark cyberpunk matrix", "retro orange warm sunset"). AI will build custom borders, fonts, and hex colors.</p>
              
              <form onSubmit={handleGenerateTheme} className="flex gap-2">
                <input
                  type="text"
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  placeholder="e.g. Cyberpunk bright green and black"
                  className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                  required
                  disabled={isThemeGenerating}
                />
                <button
                  type="submit"
                  disabled={isThemeGenerating}
                  className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-100 flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                >
                  {isThemeGenerating ? <LoadingSpinner className="w-4 h-4" color="text-white" /> : <Sparkles className="h-4 w-4" />}
                  <span>Generate</span>
                </button>
              </form>
            </div>

            {/* Themes Presets catalog */}
            <div>
              <h3 className="font-outfit font-bold text-slate-900 text-lg mb-4">Built-in Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BUILTIN_THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setActiveTheme(theme);
                      saveForm(fields, theme);
                    }}
                    className={`rounded-2xl border p-5 bg-white shadow-sm flex flex-col justify-between cursor-pointer hover:border-slate-300 transition-all ${
                      activeTheme?.id === theme.id ? "ring-2 ring-indigo-600 border-indigo-600" : "border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-outfit font-bold text-slate-800 text-base">{theme.name}</span>
                        {activeTheme?.id === theme.id && <span className="text-xs text-indigo-600 font-bold">Selected</span>}
                      </div>
                      <div className="mt-4 flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded border border-slate-100" style={{ backgroundColor: theme.primaryColor }} title="Primary" />
                        <div className="h-6 w-6 rounded border border-slate-100" style={{ backgroundColor: theme.backgroundColor }} title="Background" />
                        <div className="h-6 w-6 rounded border border-slate-100" style={{ backgroundColor: theme.textColor }} title="Text Color" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EMBED SETTINGS */}
        {activeTab === "embed" && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Embed code blocks */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-outfit font-bold text-slate-950 text-base">Iframe Embed Code</h3>
                  <p className="text-slate-400 text-xs mt-1">Copy and paste this HTML snippet to embed the form inside any website.</p>
                  
                  <div className="mt-3 relative">
                    <pre className="bg-slate-100 p-3 rounded-xl text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono select-all pr-12 border border-slate-200">
                      {`<iframe src="${publicFormUrl}" width="100%" height="600px" frameborder="0"></iframe>`}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`<iframe src="${publicFormUrl}" width="100%" height="600px" frameborder="0"></iframe>`);
                        alert("Copied to clipboard!");
                      }}
                      className="absolute right-3 top-3 p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-outfit font-bold text-slate-950 text-base">JavaScript Script Tag (SDK)</h3>
                  <p className="text-slate-400 text-xs mt-1">Embed using a clean SDK wrapper injection.</p>
                  
                  <div className="mt-3 relative">
                    <pre className="bg-slate-100 p-3 rounded-xl text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono select-all pr-12 border border-slate-200">
                      {`<div id="formu-embed-${id}"></div>\n<script src="${window.location.origin}/embed.js" data-form="${id}" data-target="formu-embed-${id}"></script>`}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`<div id="formu-embed-${id}"></div>\n<script src="${window.location.origin}/embed.js" data-form="${id}" data-target="formu-embed-${id}"></script>`);
                        alert("Copied to clipboard!");
                      }}
                      className="absolute right-3 top-3 p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code sharing */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center justify-center">
                <QrCode className="h-8 w-8 text-indigo-600 mb-2" />
                <h3 className="font-outfit font-bold text-slate-950 text-base">QR Code Sharing</h3>
                <p className="text-slate-400 text-xs mt-1 mb-6">Scan to open the public submission form instantly on mobile devices.</p>
                
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <QRCodeSVG value={publicFormUrl} size={150} />
                </div>
                
                <span className="font-mono text-xs text-indigo-600 mt-4 select-all">{publicFormUrl}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RESPONSES LIST */}
        {activeTab === "responses" && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-full min-h-[400px]">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-outfit font-bold text-slate-950 text-base">Collected Submissions</h3>
                  <p className="text-slate-400 text-xs mt-0.5">List of raw submissions data saved for this form.</p>
                </div>
                {responses && responses.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                  >
                    <Download className="h-4 w-4" /> Export CSV
                  </button>
                )}
              </div>

              {isResponsesLoading ? (
                <div className="flex-1 flex items-center justify-center"><LoadingSpinner className="w-8 h-8" /></div>
              ) : !responses || responses.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
                  <FileText className="h-10 w-10 text-slate-300 mb-2" />
                  <span>No submissions received yet.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="p-3">Submitted At</th>
                        <th className="p-3">Answers Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {responses.map((sub) => {
                        const answers = sub.answersJson as Record<string, any>;
                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/50">
                            <td className="p-3 whitespace-nowrap text-slate-400">{new Date(sub.createdAt).toLocaleString()}</td>
                            <td className="p-3">
                              <div className="flex flex-col gap-1">
                                {fields.map((field) => {
                                  const ans = answers[field.id];
                                  if (ans === undefined || ans === null || ans === "") return null;
                                  return (
                                    <div key={field.id} className="flex gap-2">
                                      <span className="text-slate-400">{field.label}:</span>
                                      <span className="text-slate-800">{Array.isArray(ans) ? ans.join(", ") : String(ans)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS PANEL & AI INSIGHTS */}
        {activeTab === "analytics" && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {isAnalyticsLoading ? (
              <div className="py-20 flex items-center justify-center"><LoadingSpinner className="w-8 h-8" /></div>
            ) : !analytics ? (
              <div className="py-10 text-center text-slate-400">Failed to load analytics.</div>
            ) : (
              <>
                {/* Micro Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Views</span>
                    <div className="text-2xl font-bold font-outfit text-slate-800 mt-1">{analytics.totalViews}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Responses</span>
                    <div className="text-2xl font-bold font-outfit text-slate-800 mt-1">{analytics.totalResponses}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
                    <div className="text-2xl font-bold font-outfit text-slate-800 mt-1">{analytics.conversionRate}%</div>
                  </div>
                </div>

                {/* 30-Day Activity Recharts Timeline */}
                {analytics.timeline && analytics.timeline.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-outfit font-bold text-slate-900 text-sm mb-4">Submission & View Rates (Last 30 Days)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.timeline}>
                          <defs>
                            <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="submissions" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSub)" name="Submissions" />
                          <Area type="monotone" dataKey="views" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Views" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* AI INSIGHTS BLOCK */}
                <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-100 mb-6">
                    <div>
                      <div className="flex items-center gap-1 text-indigo-700 font-bold">
                        <Sparkles className="h-5 w-5 fill-indigo-100" />
                        <h3 className="font-outfit text-base">Gemini AI Submissions Analytics</h3>
                      </div>
                      <p className="text-slate-400 text-xs mt-0.5">Synthesize qualitative survey feedbacks automatically to outline customer sentiments and reports.</p>
                    </div>

                    <button
                      onClick={handleGenerateInsights}
                      disabled={isInsightsGenerating || analytics.totalResponses === 0}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-100 disabled:opacity-50 px-4 transition-colors"
                    >
                      {isInsightsGenerating ? <LoadingSpinner className="w-3.5 h-3.5" color="text-white" /> : <Sparkles className="h-3.5 w-3.5" />}
                      <span>Analyze Feedbacks</span>
                    </button>
                  </div>

                  {insightsError && (
                    <div className="rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                      <span>{insightsError}</span>
                    </div>
                  )}

                  {analytics.totalResponses === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      At least one submission is required to trigger AI Feedbacks analysis.
                    </div>
                  )}

                  {aiInsights && (
                    <div className="space-y-6 text-sm text-slate-700">
                      <div>
                        <span className="font-bold text-slate-800 block">Executive Summary</span>
                        <p className="mt-1 text-slate-600 leading-relaxed text-xs">{aiInsights.summary}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <span className="font-bold text-slate-800 block mb-1">Sentiment Rating</span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">{aiInsights.sentiment}</span>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <span className="font-bold text-slate-800 block mb-1.5">Top Keywords</span>
                          <div className="flex flex-wrap gap-1.5">
                            {aiInsights.topKeywords?.map((kw: string) => (
                              <span key={kw} className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300/40">{kw}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div>
                          <span className="font-bold text-slate-800 block mb-2">Common Complaints</span>
                          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                            {aiInsights.commonComplaints?.map((c: string, idx: number) => (
                              <li key={idx}>{c}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block mb-2">Actionable Recommendations</span>
                          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                            {aiInsights.recommendations?.map((r: string, idx: number) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS (SLUGS, VISIBILITY) */}
        {activeTab === "settings" && (
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-xl">
              <h3 className="font-outfit font-bold text-slate-950 text-base mb-6 pb-2 border-b border-slate-100">Visibility & custom configurations</h3>
              
              <form onSubmit={handleSaveSettings} className="space-y-6 text-sm text-slate-700">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Visibility Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setVisibility("draft")}
                      className={`p-3 rounded-xl border text-center font-semibold text-xs transition-colors ${
                        visibility === "draft" ? "border-indigo-600 bg-indigo-50/20 text-indigo-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility("public")}
                      className={`p-3 rounded-xl border text-center font-semibold text-xs transition-colors ${
                        visibility === "public" ? "border-indigo-600 bg-indigo-50/20 text-indigo-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility("unlisted")}
                      className={`p-3 rounded-xl border text-center font-semibold text-xs transition-colors ${
                        visibility === "unlisted" ? "border-indigo-600 bg-indigo-50/20 text-indigo-700" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      Unlisted
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {visibility === "draft" && "Draft forms are not accessible publicly and do not accept responses."}
                    {visibility === "public" && "Public forms are visible in the explore page/gallery and accept responses."}
                    {visibility === "unlisted" && "Unlisted forms accept responses, but are hidden from general explore listings."}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Custom Form URL Slug</label>
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                    <span className="text-xs font-mono text-slate-400 px-3 bg-slate-100 h-10 flex items-center border-r border-slate-200">{window.location.origin}/f/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1 h-10 px-3 bg-transparent text-sm focus:outline-none"
                      placeholder="custom-slug"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Shorthand slug name. Letters, numbers, and dashes only.</p>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
