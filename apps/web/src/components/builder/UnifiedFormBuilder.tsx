"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import {
  getLocalForm,
  saveLocalForm,
  deleteLocalForm,
  LocalForm,
  getLocalSubmissions,
  getLocalForms,
} from "@/utils/localForms";
import { ThemeConfig } from "@sec-form/shared";
import { FormField, FieldType } from "@sec-form/validators";
import { AlertCircle, X, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";

import { BuilderHeader } from "./BuilderHeader";
import { BuilderSidebarLeft } from "./BuilderSidebarLeft";
import { BuilderCanvas } from "./BuilderCanvas";
import { ShareModal } from "./ShareModal";
import { PublishAuthModal } from "./PublishAuthModal";
import { LimitModal } from "./LimitModal";
import { ContactAdminModal } from "./ContactAdminModal";
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import { toast } from "sonner";

const trpcAny = trpc as any;
const PUBLIC_FORM_LIMIT = 5;

interface UnifiedFormBuilderProps {
  id: string;
  isExpandable?: boolean;
  onExit?: () => void;
}

export function UnifiedFormBuilder({ id, isExpandable, onExit }: UnifiedFormBuilderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam && ["form", "theme", "responses", "analytics", "settings", "embed"].includes(tabParam)
      ? (tabParam as any)
      : "form";

  const utils = trpcAny.useUtils();
  const { data: session, status: authStatus } = useSession();

  const [localForm, setLocalForm] = useState<LocalForm | null>(null);
  const isDemo = !session?.user || !!localForm || session?.user?.email === "demo@demo.com";
  const [isPublishAuthModalOpen, setIsPublishAuthModalOpen] = useState(false);

  const [middleTab, setMiddleTab] = useState<"form" | "theme" | "responses" | "analytics" | "settings" | "embed">(
    initialTab
  );
  const [hasLoadedLocal, setHasLoadedLocal] = useState(false);
  const [isLeftSidebarExpanded, setIsLeftSidebarExpanded] = useState(true);

  const isPublicBuilder = !session?.user || isExpandable;

  useEffect(() => {
    if (isPublicBuilder && (middleTab === "settings" || middleTab === "embed")) {
      setMiddleTab("form");
    }
  }, [isPublicBuilder, middleTab]);

  // Load from local storage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const found = getLocalForm(id);
      if (found) {
        setLocalForm(found);
      }
      setHasLoadedLocal(true);
    }
  }, [id]);

  const isAuthLoading = authStatus === "loading";
  const isAuthed = authStatus === "authenticated";

  // Form Queries
  const {
    data: form,
    isLoading: isFormLoading,
    error: formError,
    isFetching,
  } = trpcAny.forms.get.useQuery(
    { id },
    {
      enabled: hasLoadedLocal && !localForm && isAuthed,
    }
  );

  const { data: formsList } = trpcAny.forms.list.useQuery(undefined, {
    enabled: isAuthed && !localForm,
  });

  const { data: responses, isLoading: isResponsesLoading } = trpcAny.submissions.list.useQuery(
    { formId: id },
    { enabled: !localForm && isAuthed }
  );

  const { data: analytics, isLoading: isAnalyticsLoading } = trpcAny.analytics.getFormAnalytics.useQuery(
    { formId: id },
    { enabled: !localForm && isAuthed }
  );

  const activeForm = localForm || form;
  const activeResponses = localForm ? getLocalSubmissions(id) : responses;
  const activeAnalytics = localForm
    ? {
        totalViews: localForm.totalViews || 0,
        totalResponses: activeResponses?.length || 0,
        conversionRate: localForm.totalViews
          ? Math.round(((activeResponses?.length || 0) / localForm.totalViews) * 100)
          : 0,
        timeline: [],
      }
    : analytics;

  const activeIsFormLoading = !hasLoadedLocal
    ? true
    : localForm
    ? false
    : isAuthLoading || (isAuthed && isFetching && !form && !formError);

  // Mutations
  const createFormMutation = trpcAny.forms.create.useMutation();
  const updateFormMutation = trpcAny.forms.update.useMutation();
  const publishFormMutation = trpcAny.forms.publish.useMutation();
  const generateInsightsMutation = trpcAny.ai.generateInsights.useMutation();

  // Local Form state
  const [fields, setFields] = useState<FormField[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Theme state
  const [activeTheme, setActiveTheme] = useState<ThemeConfig | null>(null);

  // AI Insights
  const [aiInsights, setAIInsights] = useState<any>(null);
  const [isInsightsGenerating, setIsInsightsGenerating] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  // Settings
  const [hasInitialized, setHasInitialized] = useState(false);
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<"draft" | "public" | "unlisted">("unlisted");
  const [layoutMode, setLayoutMode] = useState<"standard" | "single_field" | "custom_steps">("standard");
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramChatName, setTelegramChatName] = useState("");
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);

  // History for Undo/Redo
  const [formHistory, setFormHistory] = useState<{
    states: { fields: FormField[]; theme: ThemeConfig | null }[];
    index: number;
  }>({
    states: [],
    index: -1,
  });

  const pushToHistory = useCallback((newFields: FormField[], newTheme: ThemeConfig | null) => {
    setFormHistory((prev) => {
      const nextStates = prev.states.slice(0, prev.index + 1);
      nextStates.push({
        fields: JSON.parse(JSON.stringify(newFields)),
        theme: newTheme ? JSON.parse(JSON.stringify(newTheme)) : null,
      });
      return {
        states: nextStates,
        index: nextStates.length - 1,
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    if (formHistory.index > 0) {
      const targetState = formHistory.states[formHistory.index - 1];
      setFields(targetState.fields);
      setActiveTheme(targetState.theme);
      setFormHistory((prev) => ({ ...prev, index: prev.index - 1 }));
    }
  }, [formHistory]);

  const handleRedo = useCallback(() => {
    if (formHistory.index < formHistory.states.length - 1) {
      const targetState = formHistory.states[formHistory.index + 1];
      setFields(targetState.fields);
      setActiveTheme(targetState.theme);
      setFormHistory((prev) => ({ ...prev, index: prev.index + 1 }));
    }
  }, [formHistory]);

  // Saving indicators
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Initialize state once form is retrieved
  useEffect(() => {
    if (activeForm && !hasInitialized) {
      const rawFields = (activeForm.schemaJson as any)?.fields || [];
      const safeFields: FormField[] = rawFields.map((f: any) => ({
        id: f.id || crypto.randomUUID(),
        type: f.type || "text",
        label: f.label || "Untitled Question",
        description: f.description || undefined,
        placeholder: f.placeholder || undefined,
        required: typeof f.required === "boolean" ? f.required : false,
        options: Array.isArray(f.options) ? f.options : undefined,
        validation: f.validation || undefined,
      }));

      setFields(safeFields);
      setTitle(activeForm.title || "");
      setDescription(activeForm.description || "");
      setActiveTheme(activeForm.themeJson as any);
      setSlug(activeForm.slug || "");
      setVisibility((activeForm.visibility as any) || "unlisted");

      const layout = (activeForm.schemaJson as any)?.layout?.mode;
      if (layout) setLayoutMode(layout);

      const telegram = (activeForm.schemaJson as any)?.telegram;
      if (telegram) {
        setTelegramEnabled(telegram.enabled || false);
        setTelegramChatId(telegram.chatId || "");
        setTelegramChatName(telegram.chatName || "");
      }

      const domains = (activeForm.schemaJson as any)?.allowedDomains;
      if (Array.isArray(domains)) setAllowedDomains(domains);

      pushToHistory(safeFields, activeForm.themeJson as any);
      setHasInitialized(true);
    }
  }, [activeForm, hasInitialized, pushToHistory]);

  // Debounced auto-save function
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveForm = useCallback(
    async (
      updatedFields: FormField[],
      updatedTheme?: any,
      updatedLayoutMode?: "standard" | "single_field" | "custom_steps",
      updatedVisibility?: "draft" | "public" | "unlisted",
      updatedSlug?: string,
      updatedTelegram?: { enabled: boolean; chatId?: string; chatName?: string },
      updatedAllowedDomains?: string[]
    ) => {
      setSaveStatus("saving");
      setHasUnpublishedChanges(true);

      const currentTheme = updatedTheme !== undefined ? updatedTheme : activeTheme;
      const currentLayoutMode = updatedLayoutMode || layoutMode;
      const currentVisibility = updatedVisibility || visibility;
      const currentSlug = updatedSlug !== undefined ? updatedSlug : slug;
      const currentTelegram =
        updatedTelegram !== undefined
          ? updatedTelegram
          : { enabled: telegramEnabled, chatId: telegramChatId, chatName: telegramChatName };
      const currentAllowedDomains =
        updatedAllowedDomains !== undefined ? updatedAllowedDomains : allowedDomains;

      if (localForm || !session?.user) {
        const updatedLocal: LocalForm = {
          id,
          title,
          description,
          slug: currentSlug,
          visibility: currentVisibility,
          schemaJson: {
            fields: updatedFields,
            layout: { mode: currentLayoutMode },
            telegram: currentTelegram,
            allowedDomains: currentAllowedDomains,
          },
          themeJson: currentTheme,
          userId: session?.user?.id || "local-user",
          createdAt: activeForm?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalViews: activeForm?.totalViews || 0,
          totalResponses: activeForm?.totalResponses || 0,
        };
        saveLocalForm(updatedLocal);
        setLocalForm(updatedLocal);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
        return;
      }

      if (form) {
        try {
          await updateFormMutation.mutateAsync({
            id,
            title,
            description,
            slug: currentSlug,
            visibility: currentVisibility,
            schemaJson: {
              fields: updatedFields,
              layout: { mode: currentLayoutMode },
              telegram: currentTelegram,
              allowedDomains: currentAllowedDomains,
            },
            themeJson: currentTheme || undefined,
          });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (err: any) {
          setSaveStatus("error");
          toast.error(err.message || "Auto-save failed");
        }
      }
    },
    [
      id,
      title,
      description,
      slug,
      visibility,
      layoutMode,
      telegramEnabled,
      telegramChatId,
      telegramChatName,
      allowedDomains,
      activeTheme,
      localForm,
      session?.user,
      form,
      activeForm,
      updateFormMutation,
    ]
  );

  const saveFormDebounced = useCallback(
    (
      updatedFields: FormField[],
      updatedTheme?: any,
      updatedLayoutMode?: "standard" | "single_field" | "custom_steps"
    ) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setSaveStatus("saving");
      saveTimeoutRef.current = setTimeout(() => {
        saveForm(updatedFields, updatedTheme, updatedLayoutMode);
      }, 600);
    },
    [saveForm]
  );

  // Field manipulation helpers
  const handleAddField = (type: FieldType, atIndex?: number) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `Untitled ${type.replace("_", " ")}`,
      required: false,
      placeholder: "Your answer here...",
      options: ["select", "multiselect"].includes(type)
        ? ["Option 1", "Option 2", "Option 3"]
        : undefined,
    };
    const updated = [...fields];
    if (atIndex !== undefined && atIndex >= 0 && atIndex <= fields.length) {
      updated.splice(atIndex, 0, newField);
    } else {
      updated.push(newField);
    }
    setFields(updated);
    setSelectedFieldId(newField.id);
    saveFormDebounced(updated, activeTheme, layoutMode);
    pushToHistory(updated, activeTheme);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    const updated = fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f));
    setFields(updated);
    saveFormDebounced(updated, activeTheme, layoutMode);
  };

  const handleDeleteField = (fieldId: string) => {
    const updated = fields.filter((f) => f.id !== fieldId);
    setFields(updated);
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
    saveFormDebounced(updated, activeTheme, layoutMode);
    pushToHistory(updated, activeTheme);
  };

  const handleReorder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    const updated = [...fields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFields(updated);
    saveFormDebounced(updated, activeTheme, layoutMode);
    pushToHistory(updated, activeTheme);
  };

  const handleDragReorder = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;
    const updated = [...fields];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);
    setFields(updated);
    saveFormDebounced(updated, activeTheme, layoutMode);
    pushToHistory(updated, activeTheme);
  };

  // Publish flow
  const handlePublish = async () => {
    if (!session?.user) {
      setIsPublishAuthModalOpen(true);
      return;
    }

    if (localForm) {
      try {
        setIsPublishing(true);
        const createdDbForm = await createFormMutation.mutateAsync({
          title: title || "Untitled Form",
          description: description || "",
        });
        await updateFormMutation.mutateAsync({
          id: createdDbForm.id,
          title: title || "Untitled Form",
          description: description || "",
          slug: slug || createdDbForm.slug,
          visibility: "public",
          schemaJson: {
            fields,
            layout: { mode: layoutMode },
            telegram: {
              enabled: telegramEnabled,
              chatId: telegramChatId || undefined,
              chatName: telegramChatName || undefined,
            },
            allowedDomains,
          },
          themeJson: activeTheme || undefined,
        });
        await publishFormMutation.mutateAsync({ id: createdDbForm.id });
        deleteLocalForm(id);
        utils.forms.list.invalidate();
        setVisibility("public");
        setHasUnpublishedChanges(false);
        toast.success("🎉 Form published successfully!");
        setIsShareModalOpen(true);
        router.push(`/dashboard/my-forms/${createdDbForm.id}/edit`);
      } catch (err: any) {
        toast.error(err.message || "Failed to publish form");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    if (form) {
      try {
        setIsPublishing(true);
        await publishFormMutation.mutateAsync({ id });
        setVisibility("public");
        setHasUnpublishedChanges(false);
        toast.success("🎉 Form published live!");
        setIsShareModalOpen(true);
      } catch (err: any) {
        toast.error(err.message || "Failed to publish form");
      } finally {
        setIsPublishing(false);
      }
    }
  };

  const handleUpdateVisibility = async (newVisibility: "draft" | "public" | "unlisted") => {
    setVisibility(newVisibility);
    await saveForm(fields, activeTheme, layoutMode, newVisibility);
  };

  const onSaveSlug = async (newSlug: string) => {
    setSlug(newSlug);
    await saveForm(fields, activeTheme, layoutMode, visibility, newSlug);
  };

  const onValidateSlug = async (slugToCheck: string): Promise<"available" | "taken" | "invalid" | "network_error"> => {
    const localConflict = getLocalForms().some((f) => f.slug === slugToCheck && f.id !== id);
    if (localConflict) return "taken";
    try {
      const dbForm = await utils.forms.getBySlug.fetch({ slug: slugToCheck });
      if (dbForm && dbForm.id !== id) return "taken";
      return "available";
    } catch {
      return "available";
    }
  };

  const onSaveTelegram = async (telegram: { enabled: boolean; chatId?: string; chatName?: string }) => {
    setTelegramEnabled(telegram.enabled);
    if (telegram.chatId !== undefined) setTelegramChatId(telegram.chatId);
    if (telegram.chatName !== undefined) setTelegramChatName(telegram.chatName);
    await saveForm(fields, activeTheme, layoutMode, visibility, slug, telegram);
  };

  const onSaveAllowedDomains = async (domains: string[]) => {
    setAllowedDomains(domains);
    await saveForm(fields, activeTheme, layoutMode, visibility, slug, undefined, domains);
  };

  const handleGenerateInsights = async () => {
    setIsInsightsGenerating(true);
    setInsightsError("");
    try {
      const res = await generateInsightsMutation.mutateAsync({ formId: id });
      setAIInsights(res);
    } catch (e: any) {
      setInsightsError(e.message || "Failed to generate AI insights");
    } finally {
      setIsInsightsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Submitted At", ...fields.map((f) => f.label)];
    const rows = (activeResponses || []).map((sub: any) => [
      new Date(sub.createdAt).toLocaleString(),
      ...fields.map((f) => {
        const val = sub.answersJson?.[f.id];
        return Array.isArray(val) ? val.join("; ") : val ?? "";
      }),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r: any) => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "form"}-responses.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard Shortcuts
  useGlobalShortcut("undo", "z", "Undo", handleUndo, "Builder");
  useGlobalShortcut("redo", "y", "Redo", handleRedo, "Builder");

  if (activeIsFormLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <LoadingSpinner className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-medium text-muted-foreground">Loading form workspace...</span>
      </div>
    );
  }

  if (formError && !localForm) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold text-foreground">Form not found or inaccessible</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {formError.message || "We could not locate this form in your account."}
        </p>
        <button
          onClick={() => (onExit ? onExit() : router.push("/dashboard/my-forms"))}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const hostOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const publicFormUrl = slug ? `${hostOrigin}/f/${slug}` : "";

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background select-none">
      {/* Top Header */}
      <div className="relative z-30 shrink-0">
        <BuilderHeader
          title={title}
          description={description}
          saveStatus={saveStatus}
          visibility={visibility}
          handleUpdateVisibility={handleUpdateVisibility}
          setIsShareModalOpen={setIsShareModalOpen}
          publicFormUrl={publicFormUrl}
          hasUnpublishedChanges={hasUnpublishedChanges}
          handlePublish={handlePublish}
          isPublishing={isPublishing}
          onExit={onExit}
        />
      </div>

      {/* Main Workspace: Left Palette + WYSIWYG Live Canvas */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-muted/15 relative">
        {/* Left Field Palette Sidebar (Default Open) */}
        <BuilderSidebarLeft
          focusedField={fields.find((f) => f.id === selectedFieldId) || null}
          handleUpdateField={handleUpdateField}
          handleAddField={handleAddField}
          isExpanded={isLeftSidebarExpanded}
          setIsExpanded={setIsLeftSidebarExpanded}
        />

        {/* Center Live WYSIWYG Form Canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
            handleDragReorder={handleDragReorder}
            handleDeleteField={handleDeleteField}
            handleUpdateField={handleUpdateField}
            handleAddField={handleAddField}
            saveForm={saveFormDebounced}
            responses={activeResponses}
            isResponsesLoading={isResponsesLoading}
            handleExportCSV={handleExportCSV}
            analytics={activeAnalytics}
            isAnalyticsLoading={isAnalyticsLoading}
            aiInsights={aiInsights}
            isInsightsGenerating={isInsightsGenerating}
            insightsError={insightsError}
            handleGenerateInsights={handleGenerateInsights}
            visibility={visibility}
            onSaveVisibility={handleUpdateVisibility}
            layoutMode={layoutMode}
            setLayoutMode={(mode) => {
              setLayoutMode(mode);
              saveForm(fields, activeTheme, mode);
            }}
            slug={slug}
            initialSlug={activeForm?.slug || ""}
            onSaveSlug={onSaveSlug}
            onValidateSlug={onValidateSlug}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            canUndo={formHistory.index > 0}
            canRedo={formHistory.index >= 0 && formHistory.index < formHistory.states.length - 1}
            telegramEnabled={telegramEnabled}
            onSaveTelegram={onSaveTelegram}
            telegramChatId={telegramChatId}
            telegramChatName={telegramChatName}
            formId={id}
            allowedDomains={allowedDomains}
            onSaveAllowedDomains={onSaveAllowedDomains}
            activeTheme={activeTheme}
            setActiveTheme={(th) => {
              setActiveTheme(th);
              saveForm(fields, th);
            }}
            pushToHistory={pushToHistory}
            publicFormUrl={publicFormUrl}
            hostOrigin={hostOrigin}
            isPublicBuilder={isPublicBuilder}
          />
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
        publicFormUrl={publicFormUrl}
        formId={id}
        hostOrigin={hostOrigin}
      />

      <PublishAuthModal
        isOpen={isPublishAuthModalOpen}
        setIsOpen={setIsPublishAuthModalOpen}
        formId={id}
      />

      <LimitModal
        isOpen={showLimitModal}
        onOpenChange={setShowLimitModal}
        onContactAdmin={() => setShowContactAdminModal(true)}
      />

      <ContactAdminModal
        isOpen={showContactAdminModal}
        onOpenChange={setShowContactAdminModal}
      />
    </div>
  );
}
