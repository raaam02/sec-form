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
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  // Mutations
  const updateFormMutation = trpcAny.forms.update.useMutation();

  // Local Form state
  const [fields, setFields] = useState<FormField[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  
  // Theme state
  const [activeTheme, setActiveTheme] = useState<ThemeConfig | null>(null);



  // Settings state
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState<"draft" | "public" | "unlisted">("draft");
  const [layoutMode, setLayoutMode] = useState<"standard" | "single_field" | "custom_steps">("single_field");
  
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

  // Sync state from query load
  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setDescription(form.description || "");
      
      const loadedFields = (form.schemaJson as any).fields || [];
      const loadedTheme = form.themeJson as any;
      setFields(loadedFields);
      setActiveTheme(loadedTheme);
      setSlug(form.slug);
      setVisibility(form.visibility as any);
      setLayoutMode((form.schemaJson as any).layout?.mode || "single_field");

      setFormHistory((prev) => {
        if (prev.states.length === 0) {
          return {
            states: [{ fields: loadedFields, theme: loadedTheme }],
            index: 0
          };
        }
        return prev;
      });
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
    try {
      await updateFormMutation.mutateAsync({
        id,
        title,
        description,
        schemaJson: { 
          fields: updatedFields,
          layout: { mode: updatedLayoutMode || layoutMode }
        },
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
    saveForm(updated);
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
      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden min-h-0 bg-muted/20">
        
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
            saveForm={saveForm}
            visibility={visibility}
            setVisibility={setVisibility}
            slug={slug}
            setSlug={setSlug}
            handleSaveSettings={handleSaveSettings}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            canUndo={formHistory.index > 0}
            canRedo={formHistory.index >= 0 && formHistory.index < formHistory.states.length - 1}
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

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        setIsOpen={setIsShareModalOpen}
        publicFormUrl={publicFormUrl}
      />

    </div>
  );
}

