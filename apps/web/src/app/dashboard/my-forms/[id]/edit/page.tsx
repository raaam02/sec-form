"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { getLocalForm, saveLocalForm, LocalForm, getLocalSubmissions, getLocalForms } from "@/utils/localForms";
import { ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { AlertCircle, Plus, Palette, Settings, Smartphone, Code } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";

import { BuilderHeader } from "@/components/builder/BuilderHeader";
import { BuilderSidebarLeft } from "@/components/builder/BuilderSidebarLeft";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { BuilderSidebarRight } from "@/components/builder/BuilderSidebarRight";
import { ShareModal } from "@/components/builder/ShareModal";
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { LimitModal } from "@/components/builder/LimitModal";
import { ContactAdminModal } from "@/components/builder/ContactAdminModal";
import { toast } from "sonner";

// Cast trpc to bypass Next.js 15 type collision checks
const trpcAny = trpc as any;

const PUBLIC_FORM_LIMIT = 5;

export default function BuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  
  const utils = trpcAny.useUtils();

  const { data: session } = useSession();
  const isDemo = session?.user?.email === "demo@demo.com";

  // Sub-tabs states for the three panels
  const [leftTab, setLeftTab] = useState<"builder" | "themes">("builder");
  const [middleTab, setMiddleTab] = useState<"form" | "responses" | "analytics" | "settings">("form");
  const [rightTab, setRightTab] = useState<"preview" | "embed">("preview");

  const [localForm, setLocalForm] = useState<LocalForm | null>(null);
  const [hasLoadedLocal, setHasLoadedLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const found = getLocalForm(id);
      if (found) {
        setLocalForm(found);
      }
      setHasLoadedLocal(true);
    }
  }, [id]);

  // Queries
  const { data: form, isLoading: isFormLoading, error: formError } = trpcAny.forms.get.useQuery(
    { id },
    { 
      enabled: !isDemo || (!hasLoadedLocal ? false : !localForm),
      refetchInterval: (data: any) => {
        const telegram = (data?.schemaJson as any)?.telegram;
        return (telegram?.enabled && !telegram?.chatId) ? 3000 : false;
      }
    }
  );

  const activeForm = isDemo && localForm ? localForm : form;

  const { data: analytics, isLoading: isAnalyticsLoading } = trpcAny.analytics.getFormAnalytics.useQuery(
    { formId: id },
    { enabled: middleTab === "analytics" && (!isDemo || !localForm) }
  );
  const { data: responses, isLoading: isResponsesLoading } = trpcAny.submissions.list.useQuery(
    { formId: id },
    { enabled: middleTab === "responses" && (!isDemo || !localForm) }
  );

  const activeResponses = isDemo && localForm ? getLocalSubmissions(id) : responses;
  const activeAnalytics = isDemo && localForm ? {
    totalViews: localForm.totalViews || 0,
    totalResponses: activeResponses?.length || 0,
    conversionRate: localForm.totalViews ? Math.round((activeResponses?.length || 0) / localForm.totalViews * 100) : 0,
    timeline: [],
  } : analytics;
  const activeIsFormLoading = isDemo ? !hasLoadedLocal || (activeForm ? false : isFormLoading) : isFormLoading;

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
  const [hasInitialized, setHasInitialized] = useState(false);
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<"draft" | "public" | "unlisted">("draft");
  const [layoutMode, setLayoutMode] = useState<"standard" | "single_field" | "custom_steps">("single_field");
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramChatName, setTelegramChatName] = useState("");
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"build" | "theme" | "preview" | "embed" | "settings">("build");
  const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(false);

  useEffect(() => {
    if (activeMobileTab === "preview" || activeMobileTab === "embed") {
      setActiveMobileTab(rightTab as any);
    }
  }, [rightTab]);

  useEffect(() => {
    if (activeMobileTab === "build" || activeMobileTab === "theme") {
      setActiveMobileTab(leftTab === "themes" ? "theme" : "build");
    }
  }, [leftTab]);

  useEffect(() => {
    if (middleTab === "settings") {
      setActiveMobileTab("settings");
    } else if (middleTab === "form" && activeMobileTab === "settings") {
      setActiveMobileTab("build");
    }
  }, [middleTab]);

  const { data: formsList } = trpcAny.forms.list.useQuery();
  const { data: plansList } = trpcAny.admin.getPlans.useQuery();
  
  // Share state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Notification banner / Auto-save status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [, setSaveErrorMessage] = useState("");

  // History state for Undo/Redo
  const [formHistory, setFormHistory] = useState<{
    states: { fields: FormField[]; theme: ThemeConfig | null }[];
    index: number;
  }>({ states: [], index: -1 });

  const pushToHistory = (newFields: FormField[], newTheme: ThemeConfig | null) => {
    setFormHistory((prev) => {
      const currentStates = prev.states.slice(0, prev.index + 1);
      currentStates.push({ 
        fields: JSON.parse(JSON.stringify(newFields)), 
        theme: newTheme ? JSON.parse(JSON.stringify(newTheme)) : null 
      });
      if (currentStates.length > 100) currentStates.shift();
      return {
        states: currentStates,
        index: currentStates.length - 1
      };
    });
  };

  const handleUndo = () => {
    if (formHistory.index > 0) {
      const newIndex = formHistory.index - 1;
      const prev = formHistory.states[newIndex];
      setFields(prev.fields);
      setActiveTheme(prev.theme);
      setFormHistory((current) => ({ ...current, index: newIndex }));
      saveForm(prev.fields, prev.theme);
    }
  };

  const handleRedo = () => {
    if (formHistory.index >= 0 && formHistory.index < formHistory.states.length - 1) {
      const newIndex = formHistory.index + 1;
      const next = formHistory.states[newIndex];
      setFields(next.fields);
      setActiveTheme(next.theme);
      setFormHistory((current) => ({ ...current, index: newIndex }));
      saveForm(next.fields, next.theme);
    }
  };

  useGlobalShortcut("undo-action", "ctrl+z", "Undo", handleUndo, "Builder Tools");
  useGlobalShortcut("redo-action", "ctrl+y", "Redo", handleRedo, "Builder Tools");

  useGlobalShortcut("save-form", "ctrl+s", "Save Form", () => {
    saveForm(fields);
  }, "Builder Tools");

  useGlobalShortcut("share-form", "ctrl+e", "Share / Embed", () => {
    setIsShareModalOpen(true);
  }, "Builder Tools");

  useGlobalShortcut("preview-form", "ctrl+p", "Preview Form", () => {
    setRightTab("preview");
  }, "Builder Tools");

  useGlobalShortcut("build-tab-1", "ctrl+1", "Build Canvas", () => {
    setLeftTab("builder");
    setMiddleTab("form");
  }, "Builder Navigation");

  useGlobalShortcut("theme-tab", "ctrl+2", "Theme Presets", () => {
    setLeftTab("themes");
  }, "Builder Navigation");

  useGlobalShortcut("build-tab-3", "ctrl+3", "Build Canvas", () => {
    setLeftTab("builder");
    setMiddleTab("form");
  }, "Builder Navigation");



  useGlobalShortcut("settings-tab", "ctrl+6", "Settings", () => {
    setMiddleTab("settings");
  }, "Builder Navigation");

  useGlobalShortcut("preview-tab", "ctrl+7", "Preview Mode", () => {
    setRightTab("preview");
  }, "Builder Navigation");

  useGlobalShortcut("embed-tab", "ctrl+8", "Embed Mode", () => {
    setRightTab("embed");
  }, "Builder Navigation");

  useEffect(() => {
    setHasInitialized(false);
  }, [id]);

  // Sync state from query load
  useEffect(() => {
    if (activeForm && !hasInitialized) {
      setTitle(activeForm.title);
      setDescription(activeForm.description || "");
      
      const loadedFields = (activeForm.schemaJson as any).fields || [];
      const loadedTheme = activeForm.themeJson as any;
      setFields(loadedFields);
      setActiveTheme(loadedTheme);
      setSlug(activeForm.slug);
      setVisibility(activeForm.visibility as any);
      setLayoutMode((activeForm.schemaJson as any).layout?.mode || "single_field");
      setAllowedDomains((activeForm.schemaJson as any).allowedDomains || []);

      const telegram = (activeForm.schemaJson as any).telegram || {};
      setTelegramEnabled(telegram.enabled || false);
      setTelegramChatId(telegram.chatId || "");
      setTelegramChatName(telegram.chatName || "");

      setFormHistory((prev) => {
        if (prev.states.length === 0) {
          return {
            states: [{ fields: loadedFields, theme: loadedTheme }],
            index: 0
          };
        }
        return prev;
      });
      setHasInitialized(true);
    }
  }, [activeForm, hasInitialized]);

  // Sync Telegram status from activeForm in the background
  useEffect(() => {
    if (activeForm) {
      const telegram = (activeForm.schemaJson as any).telegram || {};
      setTelegramChatId((prevId) => {
        const newId = telegram.chatId || "";
        if (newId !== prevId) {
          setTelegramChatName(telegram.chatName || "");
          setTelegramEnabled(telegram.enabled || false);
          return newId;
        }
        return prevId;
      });
    }
  }, [activeForm]);

  // Track tab parameter changes from deep links
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      if (tab === "build" || tab === "builder") {
        setLeftTab("builder");
        setMiddleTab("form");
      } else if (tab === "theme" || tab === "themes") {
        setLeftTab("themes");
      } else if (tab === "settings") {
        setMiddleTab("settings");
      } else if (tab === "embed") {
        setRightTab("embed");
      }
    }
  }, [searchParams]);

  // Auto-Save Form Logic
  const saveForm = async (updatedFields: FormField[], updatedTheme?: ThemeConfig | null, updatedLayoutMode?: "standard" | "single_field" | "custom_steps") => {
    setSaveStatus("saving");
    
    let nextVisibility = visibility;
    if (visibility === "public" || visibility === "unlisted") {
      nextVisibility = "draft";
      setVisibility("draft");
      toast.info("Form reverted to draft due to live edits. Please publish again to make changes public.");
    }
    
    if (isDemo) {
      try {
        const updatedLocal: LocalForm = {
          id,
          title: title.trim() === "" ? "Untitled Form" : title,
          description,
          slug,
          visibility: nextVisibility,
          schemaJson: { 
            fields: updatedFields,
            layout: { mode: updatedLayoutMode || layoutMode },
            telegram: {
              enabled: telegramEnabled,
              chatId: telegramChatId || undefined,
              chatName: telegramChatName || undefined,
            },
            allowedDomains
          },
          themeJson: updatedTheme !== undefined ? updatedTheme : (activeTheme || null),
          userId: "demo-user-id",
          createdAt: activeForm?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalViews: activeForm?.totalViews || 0,
          totalResponses: activeForm?.totalResponses || 0,
        };
        saveLocalForm(updatedLocal);
        setLocalForm(updatedLocal);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } catch (err: any) {
        setSaveStatus("error");
        setSaveErrorMessage(err.message || "Auto-save failed");
      }
      return;
    }

    try {
      await updateFormMutation.mutateAsync({
        id,
        title: title.trim() === "" ? "Untitled Form" : title,
        description,
        schemaJson: { 
          fields: updatedFields,
          layout: { mode: updatedLayoutMode || layoutMode },
          telegram: {
            enabled: telegramEnabled,
            chatId: telegramChatId || undefined,
            chatName: telegramChatName || undefined,
          },
          allowedDomains
        },
        themeJson: updatedTheme || activeTheme || undefined,
        visibility: nextVisibility,
      });
      utils.forms.get.invalidate({ id });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e: any) {
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Auto-save failed");
    }
  };

  // Refs to prevent stale closure in debounced save
  const saveFormRef = React.useRef(saveForm);
  React.useEffect(() => {
    saveFormRef.current = saveForm;
  });

  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const saveFormDebounced = React.useCallback((updatedFields: FormField[], updatedTheme?: ThemeConfig | null, updatedLayoutMode?: "standard" | "single_field" | "custom_steps") => {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveFormRef.current(updatedFields, updatedTheme, updatedLayoutMode);
    }, 1000);
  }, []);

  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
    pushToHistory(updated, activeTheme);
  };

  const handleDeleteField = (fieldId: string) => {
    const updated = fields.filter((f) => f.id !== fieldId);
    setFields(updated);
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
    saveForm(updated);
    pushToHistory(updated, activeTheme);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updated = fields.map((f) => {
      if (f.id === fieldId) {
        return { ...f, ...updates } as FormField;
      }
      return f;
    });
    setFields(updated);
    saveFormDebounced(updated);
    pushToHistory(updated, activeTheme);
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
    pushToHistory(updated, activeTheme);
  };

  const handleDragReorder = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    
    const updated = [...fields];
    const [movedItem] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, movedItem);
    
    setFields(updated);
    saveForm(updated);
    pushToHistory(updated, activeTheme);
  };



  const checkPublicLimit = (targetVisibility: "draft" | "public" | "unlisted") => {
    if (targetVisibility === "public") {
      const otherPublicForms = formsList?.filter((f: any) => f.visibility === "public" && f.id !== id) || [];
      console.log("[EditPage] otherPublicForms count:", otherPublicForms.length, "formsList:", formsList);
      
      const userPlanId = session?.user?.planId || "free";
      const currentPlan = plansList?.find((p: any) => p.id === userPlanId);
      const limit = currentPlan?.maxPublicForms ?? PUBLIC_FORM_LIMIT;
      
      if (otherPublicForms.length >= limit) {
        console.log("[EditPage] Limit reached! Showing limit modal.");
        setShowLimitModal(true);
        return true;
      }
    }
    return false;
  };

  const handleUpdateVisibility = async (newVisibility: "draft" | "public" | "unlisted") => {
    console.log("[EditPage] handleUpdateVisibility called with:", newVisibility);
    if (checkPublicLimit(newVisibility)) {
      return;
    }
    setVisibility(newVisibility);
    setSaveStatus("saving");

    if (isDemo) {
      try {
        const localForms = getLocalForms();
        const conflictLocal = localForms.some(f => f.slug === slug && f.id !== id);
        if (conflictLocal) {
          setSaveStatus("error");
          toast.error("This custom slug is already taken. Please choose another.");
          return;
        }

        try {
          const dbForm = await utils.forms.getBySlug.fetch({ slug });
          if (dbForm && dbForm.id !== id) {
            setSaveStatus("error");
            toast.error("This custom slug is already taken. Please choose another.");
            return;
          }
        } catch (err: any) {
          const isNotFound = err.message?.toLowerCase().includes("not found");
          if (!isNotFound) {
            setSaveStatus("error");
            toast.error("This custom slug is already taken. Please choose another.");
            return;
          }
        }

        const updatedLocal: LocalForm = {
          id,
          title,
          description,
          slug,
          visibility: newVisibility,
          schemaJson: {
            fields,
            layout: { mode: layoutMode }
          },
          themeJson: activeTheme || null,
          userId: "demo-user-id",
          createdAt: activeForm?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalViews: activeForm?.totalViews || 0,
          totalResponses: activeForm?.totalResponses || 0,
        };
        saveLocalForm(updatedLocal);
        setLocalForm(updatedLocal);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);

        if (newVisibility === "public") {
          setIsShareModalOpen(true);
        }
      } catch (err: any) {
        setSaveStatus("error");
        setSaveErrorMessage(err.message || "Failed to update visibility");
      }
      return;
    }

    try {
      await updateFormMutation.mutateAsync({
        id,
        title,
        description,
        slug,
        visibility: newVisibility,
      });
      utils.forms.get.invalidate({ id });
      utils.forms.list.invalidate();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);

      if (newVisibility === "public") {
        setIsShareModalOpen(true);
      }
    } catch (e: any) {
      if (e.message?.includes("LIMIT_REACHED")) {
        setShowLimitModal(true);
        setSaveStatus("idle");
        return;
      }
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Failed to update visibility");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[EditPage] handleSaveSettings called. visibility:", visibility);
    if (checkPublicLimit(visibility)) {
      return;
    }
    setSaveStatus("saving");

    if (isDemo) {
      try {
        const localForms = getLocalForms();
        const conflictLocal = localForms.some(f => f.slug === slug && f.id !== id);
        if (conflictLocal) {
          setSaveStatus("error");
          toast.error("This custom slug is already taken. Please choose another.");
          return;
        }

        try {
          const dbForm = await utils.forms.getBySlug.fetch({ slug });
          if (dbForm && dbForm.id !== id) {
            setSaveStatus("error");
            toast.error("This custom slug is already taken. Please choose another.");
            return;
          }
        } catch (err: any) {
          const isNotFound = err.message?.toLowerCase().includes("not found");
          if (!isNotFound) {
            setSaveStatus("error");
            toast.error("This custom slug is already taken. Please choose another.");
            return;
          }
        }

        const updatedLocal: LocalForm = {
          id,
          title: title.trim() === "" ? "Untitled Form" : title,
          description,
          slug,
          visibility,
          schemaJson: {
            fields,
            layout: { mode: layoutMode },
            telegram: {
              enabled: telegramEnabled,
              chatId: telegramChatId || undefined,
              chatName: telegramChatName || undefined,
            },
            allowedDomains
          },
          themeJson: activeTheme || null,
          userId: "demo-user-id",
          createdAt: activeForm?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalViews: activeForm?.totalViews || 0,
          totalResponses: activeForm?.totalResponses || 0,
        };
        saveLocalForm(updatedLocal);
        setLocalForm(updatedLocal);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);

        if (visibility === "public") {
          setIsShareModalOpen(true);
        }
      } catch (err: any) {
        setSaveStatus("error");
        setSaveErrorMessage(err.message || "Failed to save settings");
      }
      return;
    }

    try {
      await updateFormMutation.mutateAsync({
        id,
        title: title.trim() === "" ? "Untitled Form" : title,
        description,
        slug,
        visibility,
        schemaJson: {
          fields,
          layout: { mode: layoutMode },
          telegram: {
            enabled: telegramEnabled,
            chatId: telegramChatId || undefined,
            chatName: telegramChatName || undefined,
          },
          allowedDomains
        }
      });
      utils.forms.get.invalidate({ id });
      utils.forms.list.invalidate();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
      
      if (visibility === "public") {
        setIsShareModalOpen(true);
      }
    } catch (e: any) {
      if (e.message?.includes("LIMIT_REACHED")) {
        setShowLimitModal(true);
        setSaveStatus("idle");
        return;
      }
      setSaveStatus("error");
      setSaveErrorMessage(e.message || "Failed to save settings");
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
    } catch (e: any) {
      setInsightsError(e.message || "Failed to analyze submissions");
    } finally {
      setIsInsightsGenerating(false);
    }
  };

  const handleExportCSV = async () => {
    if (isDemo && localForm) {
      try {
        const localSubs = getLocalSubmissions(id);
        const headers = ["Submission ID", "Created At", ...fields.map(f => f.label)];
        const rows = localSubs.map(sub => {
          const answers = sub.answersJson || {};
          return [
            sub.id,
            sub.createdAt,
            ...fields.map(f => {
              const ans = answers[f.id];
              if (ans === undefined || ans === null) return "-";
              if (Array.isArray(ans)) return ans.join(", ");
              return String(ans);
            })
          ];
        });
        const csvContent = [headers.join(","), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `submissions-${slug || activeForm?.slug || id}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exported successfully");
      } catch (err: any) {
        toast.error("Export failed: " + err.message);
      }
      return;
    }

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

  if (activeIsFormLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <LoadingSpinner className="w-10 h-10" color="text-primary" />
      </div>
    );
  }

  if ((formError && !localForm) || (!activeIsFormLoading && !activeForm)) {
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
  const publicFormUrl = `${hostOrigin}/f/${slug || activeForm?.slug}`;

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

      {/* WORKSPACE AREA */}
      {/* Desktop View (md and up) */}
      <div className="hidden md:flex flex-1 overflow-hidden min-h-0 bg-muted/20">
        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          
          {/* PANEL A: LEFT SIDEBAR (Builder / Themes) */}
          <ResizablePanel defaultSize="10" minSize="12" maxSize="20" className="flex flex-col">
            <BuilderSidebarLeft
              leftTab={leftTab}
              setLeftTab={setLeftTab}
              focusedField={focusedField || null}
              handleUpdateField={handleUpdateField}
              handleAddField={handleAddField}
              activeTheme={activeTheme}
              setActiveTheme={setActiveTheme}
              saveForm={saveForm}
              pushToHistory={pushToHistory}
              fields={fields}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* PANEL B: MIDDLE CANVAS (Form Editor / Responses / Analytics / Settings) */}
          <ResizablePanel defaultSize="65" minSize="40" className="flex flex-col">
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
              layoutMode={layoutMode}
              setLayoutMode={(mode: "standard" | "single_field" | "custom_steps") => {
                setLayoutMode(mode);
                saveForm(fields, activeTheme, mode);
              }}
              handleReorder={handleReorder}
              handleDragReorder={handleDragReorder}
              handleDeleteField={handleDeleteField}
              handleUpdateField={handleUpdateField}
              saveForm={saveFormDebounced}
              responses={activeResponses}
              isResponsesLoading={isResponsesLoading && !localForm}
              handleExportCSV={handleExportCSV}
              analytics={activeAnalytics}
              isAnalyticsLoading={isAnalyticsLoading && !localForm}
              aiInsights={aiInsights}
              isInsightsGenerating={isInsightsGenerating}
              insightsError={insightsError}
              handleGenerateInsights={handleGenerateInsights}
              visibility={visibility}
              setVisibility={setVisibility}
              slug={slug}
              setSlug={setSlug}
              handleSaveSettings={handleSaveSettings}
              allowedDomains={allowedDomains}
              setAllowedDomains={setAllowedDomains}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              canUndo={formHistory.index > 0}
              canRedo={formHistory.index >= 0 && formHistory.index < formHistory.states.length - 1}
              telegramEnabled={telegramEnabled}
              setTelegramEnabled={setTelegramEnabled}
              telegramChatId={telegramChatId}
              setTelegramChatId={setTelegramChatId}
              telegramChatName={telegramChatName}
              setTelegramChatName={setTelegramChatName}
              formId={id}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* PANEL C: RIGHT SIDEBAR (Preview / Embed) */}
          <ResizablePanel defaultSize="25" minSize="25" maxSize="30" className="flex flex-col">
            <BuilderSidebarRight
              rightTab={rightTab}
              setRightTab={setRightTab}
              title={title}
              description={description}
              fields={fields}
              activeTheme={activeTheme}
              layoutMode={layoutMode}
              publicFormUrl={publicFormUrl}
              id={id}
              hostOrigin={hostOrigin}
            />
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>

      {/* Mobile View (under md breakpoint) */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0 bg-muted/20 relative pb-16">
        {/* Mobile Viewport based on computed active tab */}
        <div className="flex-1 flex overflow-hidden min-h-0 relative">
          {activeMobileTab === "build" && (
            <div className={`shrink-0 transition-all duration-300 ${isLeftSidebarExpanded ? "w-40" : "w-14"}`}>
              <BuilderSidebarLeft
                leftTab={leftTab}
                setLeftTab={setLeftTab}
                focusedField={focusedField || null}
                handleUpdateField={handleUpdateField}
                handleAddField={handleAddField}
                activeTheme={activeTheme}
                setActiveTheme={setActiveTheme}
                saveForm={saveForm}
                pushToHistory={pushToHistory}
                fields={fields}
                isExpanded={isLeftSidebarExpanded}
                setIsExpanded={setIsLeftSidebarExpanded}
              />
            </div>
          )}

          {activeMobileTab === "theme" && (
            <div className="w-full h-full">
              <BuilderSidebarLeft
                leftTab={leftTab}
                setLeftTab={setLeftTab}
                focusedField={focusedField || null}
                handleUpdateField={handleUpdateField}
                handleAddField={handleAddField}
                activeTheme={activeTheme}
                setActiveTheme={setActiveTheme}
                saveForm={saveForm}
                pushToHistory={pushToHistory}
                fields={fields}
              />
            </div>
          )}

          {(activeMobileTab === "preview" || activeMobileTab === "embed") && (
            <div className="w-full h-full">
              <BuilderSidebarRight
                rightTab={rightTab}
                setRightTab={setRightTab}
                title={title}
                description={description}
                fields={fields}
                activeTheme={activeTheme}
                layoutMode={layoutMode}
                publicFormUrl={publicFormUrl}
                id={id}
                hostOrigin={hostOrigin}
              />
            </div>
          )}

          {(activeMobileTab === "build" || activeMobileTab === "settings") && (
            <div className="flex-1 flex flex-col min-w-0">
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
                layoutMode={layoutMode}
                setLayoutMode={(mode: "standard" | "single_field" | "custom_steps") => {
                  setLayoutMode(mode);
                  saveForm(fields, activeTheme, mode);
                }}
                handleReorder={handleReorder}
                handleDragReorder={handleDragReorder}
                handleDeleteField={handleDeleteField}
                handleUpdateField={handleUpdateField}
                saveForm={saveFormDebounced}
                responses={activeResponses}
                isResponsesLoading={isResponsesLoading && !localForm}
                handleExportCSV={handleExportCSV}
                analytics={activeAnalytics}
                isAnalyticsLoading={isAnalyticsLoading && !localForm}
                aiInsights={aiInsights}
                isInsightsGenerating={isInsightsGenerating}
                insightsError={insightsError}
                handleGenerateInsights={handleGenerateInsights}
                visibility={visibility}
                setVisibility={setVisibility}
                slug={slug}
                setSlug={setSlug}
                handleSaveSettings={handleSaveSettings}
                allowedDomains={allowedDomains}
                setAllowedDomains={setAllowedDomains}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                canUndo={formHistory.index > 0}
                canRedo={formHistory.index >= 0 && formHistory.index < formHistory.states.length - 1}
                telegramEnabled={telegramEnabled}
                setTelegramEnabled={setTelegramEnabled}
                telegramChatId={telegramChatId}
                setTelegramChatId={setTelegramChatId}
                telegramChatName={telegramChatName}
                setTelegramChatName={setTelegramChatName}
                formId={id}
              />
            </div>
          )}
        </div>

        {/* Bottom Tab Bar Navigation */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-30 px-2 pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={() => {
              setActiveMobileTab("build");
              setMiddleTab("form");
              setLeftTab("builder");
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeMobileTab === "build" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>Build</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMobileTab("theme");
              setMiddleTab("form");
              setLeftTab("themes");
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeMobileTab === "theme" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Palette className="h-5 w-5" />
            <span>Theme</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMobileTab("preview");
              setRightTab("preview");
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeMobileTab === "preview" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-5 w-5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMobileTab("embed");
              setRightTab("embed");
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeMobileTab === "embed" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="h-5 w-5" />
            <span>Embed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMobileTab("settings");
              setMiddleTab("settings");
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeMobileTab === "settings" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
        publicFormUrl={publicFormUrl}
      />

      {/* LIMIT MODAL */}
      <LimitModal
        isOpen={showLimitModal}
        onOpenChange={setShowLimitModal}
        onContactAdmin={() => setShowContactAdminModal(true)}
      />

      {/* CONTACT ADMIN MODAL */}
      <ContactAdminModal
        isOpen={showContactAdminModal}
        onOpenChange={setShowContactAdminModal}
        defaultPlan="pro"
      />

    </div>
  );
}

