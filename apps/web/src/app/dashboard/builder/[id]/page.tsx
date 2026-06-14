"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";

import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderSidebarLeft } from "@/components/builder/BuilderSidebarLeft";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { BuilderSidebarRight } from "@/components/builder/BuilderSidebarRight";
import { ShareModal } from "@/components/builder/ShareModal";

// Cast trpc to bypass Next.js 15 type collision checks
const trpcAny = trpc as any;

export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  
  const utils = trpcAny.useUtils();

  // Sub-tabs states for the three panels
  const [leftTab, setLeftTab] = useState<"builder" | "themes">("builder");
  const [middleTab, setMiddleTab] = useState<"form" | "responses" | "analytics" | "settings">("form");
  const [rightTab, setRightTab] = useState<"preview" | "embed">("preview");

  // Queries
  const { data: form, isLoading: isFormLoading, error: formError } = trpcAny.forms.get.useQuery({ id });
  const { data: analytics, isLoading: isAnalyticsLoading } = trpcAny.analytics.getFormAnalytics.useQuery(
    { formId: id },
    { enabled: middleTab === "analytics" }
  );
  const { data: responses, isLoading: isResponsesLoading } = trpcAny.submissions.list.useQuery(
    { formId: id },
    { enabled: middleTab === "responses" }
  );

  // Mutations
  const updateFormMutation = trpcAny.forms.update.useMutation();
  const generateInsightsMutation = trpcAny.ai.generateInsights.useMutation();
  const exportCSVMutation = trpcAny.submissions.exportCSV.useMutation();

  // Local Form state
  const [fields, setFields] = useState<FormField[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  
  // Theme state
  const [activeTheme, setActiveTheme] = useState<ThemeConfig | null>(null);

  // AI Insights state
  const [aiInsights, setAIInsights] = useState<any>(null);
  const [isInsightsGenerating, setIsInsightsGenerating] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Settings state
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<"draft" | "public" | "unlisted">("draft");
  
  // Share state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Notification banner / Auto-save status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [, setSaveErrorMessage] = useState("");

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

  // Track tab parameter changes from deep links
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      if (tab === "build" || tab === "builder") {
        setLeftTab("builder");
        setMiddleTab("form");
      } else if (tab === "theme" || tab === "themes") {
        setLeftTab("themes");
      } else if (tab === "responses") {
        setMiddleTab("responses");
      } else if (tab === "analytics") {
        setMiddleTab("analytics");
      } else if (tab === "settings") {
        setMiddleTab("settings");
      } else if (tab === "embed") {
        setRightTab("embed");
      }
    }
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
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e: any) {
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Auto-save failed");
    }
  };

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

  const handleUpdateVisibility = async (newVisibility: "draft" | "public" | "unlisted") => {
    setVisibility(newVisibility);
    setSaveStatus("saving");
    try {
      await updateFormMutation.mutateAsync({
        id,
        title,
        description,
        slug,
        visibility: newVisibility,
      });
      utils.forms.get.invalidate({ id });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);

      if (newVisibility === "public") {
        setIsShareModalOpen(true);
      }
    } catch (e: any) {
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Failed to update visibility");
    }
  };

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
      setTimeout(() => setSaveStatus("idle"), 2500);
      
      if (visibility === "public") {
        setIsShareModalOpen(true);
      }
    } catch (e: any) {
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Failed to save settings");
    }
  };

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
    } catch (e: any) {
      alert("Export failed: " + e.message);
    }
  };

  if (isFormLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <LoadingSpinner className="w-10 h-10" color="text-primary" />
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className="h-full w-full p-10 flex flex-col items-center justify-center bg-background gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="font-outfit text-2xl font-bold text-foreground">Form Not Found</h2>
        <p className="text-muted-foreground">The requested form does not exist or you do not have permission to view it.</p>
        <Link href="/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const focusedField = fields.find((f) => f.id === selectedFieldId);
  const hostOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const publicFormUrl = `${hostOrigin}/f/${slug || form.slug}`;

  return (
    <div className="h-full flex flex-col overflow-hidden text-foreground bg-transparent">
      
      {/* Top Fixed Header */}
      <BuilderHeader
        title={title}
        description={description}
        saveStatus={saveStatus}
        visibility={visibility}
        handleUpdateVisibility={handleUpdateVisibility}
        setIsShareModalOpen={setIsShareModalOpen}
        publicFormUrl={publicFormUrl}
      />

      {/* WORKSPACE 3-PANE CONTAINER */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-muted/20">
        
        {/* PANEL A: LEFT SIDEBAR (Builder / Themes) */}
        <BuilderSidebarLeft
          leftTab={leftTab}
          setLeftTab={setLeftTab}
          focusedField={focusedField || null}
          handleUpdateField={handleUpdateField}
          handleAddField={handleAddField}
          activeTheme={activeTheme}
          setActiveTheme={setActiveTheme}
          saveForm={saveForm}
          fields={fields}
        />

        {/* PANEL B: MIDDLE CANVAS (Form Editor / Responses / Analytics / Settings) */}
        <BuilderCanvas
          middleTab={middleTab}
          setMiddleTab={setMiddleTab}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          fields={fields}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
          handleReorder={handleReorder}
          handleDeleteField={handleDeleteField}
          saveForm={saveForm}
          responses={responses}
          isResponsesLoading={isResponsesLoading}
          handleExportCSV={handleExportCSV}
          analytics={analytics}
          isAnalyticsLoading={isAnalyticsLoading}
          aiInsights={aiInsights}
          isInsightsGenerating={isInsightsGenerating}
          insightsError={insightsError}
          handleGenerateInsights={handleGenerateInsights}
          visibility={visibility}
          setVisibility={setVisibility}
          slug={slug}
          setSlug={setSlug}
          handleSaveSettings={handleSaveSettings}
        />

        {/* PANEL C: RIGHT SIDEBAR (Preview / Embed) */}
        <BuilderSidebarRight
          rightTab={rightTab}
          setRightTab={setRightTab}
          title={title}
          description={description}
          fields={fields}
          activeTheme={activeTheme}
          publicFormUrl={publicFormUrl}
          id={id}
          hostOrigin={hostOrigin}
        />

      </div>

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
        publicFormUrl={publicFormUrl}
      />

    </div>
  );
}

