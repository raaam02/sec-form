"use client";

import React from "react";
import { Undo2, Redo2, FileText, Palette, Settings } from "lucide-react";
import { FormField, FieldType } from "@sec-form/validators";
import { resolveThemeValues } from "@sec-form/shared";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { DirectionAwareTabs, DirectionAwareTab } from "@/components/ui/direction-aware-tabs";
import { FormCanvasTab } from "./FormCanvasTab";
import { SettingsCanvasTab } from "./SettingsCanvasTab";
import { ThemeCanvasTab } from "./ThemeCanvasTab";

interface BuilderCanvasProps {
  middleTab: "form" | "theme" | "responses" | "analytics" | "settings" | "embed";
  setMiddleTab: (tab: "form" | "theme" | "responses" | "analytics" | "settings" | "embed") => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  fields: FormField[];
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleReorder: (index: number, direction: "up" | "down") => void;
  handleDragReorder?: (oldIndex: number, newIndex: number) => void;
  handleDeleteField: (id: string) => void;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleAddField?: (type: FieldType, atIndex?: number) => void;
  saveForm: (
    updatedFields: FormField[],
    updatedTheme?: any,
    updatedLayoutMode?: "standard" | "single_field" | "custom_steps",
    updatedVisibility?: "draft" | "public" | "unlisted",
    updatedSlug?: string,
    updatedTelegram?: { enabled: boolean; chatId?: string; chatName?: string },
    updatedAllowedDomains?: string[]
  ) => void;
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
  onSaveVisibility: (mode: "draft" | "public" | "unlisted") => Promise<void>;
  layoutMode?: "standard" | "single_field" | "custom_steps";
  setLayoutMode?: (mode: "standard" | "single_field" | "custom_steps") => void;
  slug: string;
  initialSlug: string;
  onSaveSlug: (slug: string) => Promise<void>;
  onValidateSlug: (slug: string) => Promise<"available" | "taken" | "invalid" | "network_error">;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  telegramEnabled: boolean;
  onSaveTelegram: (telegram: { enabled: boolean; chatId?: string; chatName?: string }) => Promise<void>;
  telegramChatId: string;
  telegramChatName: string;
  formId: string;
  allowedDomains?: string[];
  onSaveAllowedDomains: (domains: string[]) => Promise<void>;
  activeTheme: any;
  setActiveTheme: (theme: any) => void;
  pushToHistory?: (fields: FormField[], theme: any | null) => void;
  publicFormUrl: string;
  hostOrigin: string;
  isTelegramSyncing?: boolean;
  isTelegramFetching?: boolean;
  onStartTelegramSync?: () => void;
  onCheckTelegramStatus?: () => void;
  isPublicBuilder?: boolean;
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
  handleDragReorder,
  handleDeleteField,
  handleUpdateField,
  handleAddField,
  saveForm,
  visibility,
  onSaveVisibility,
  layoutMode,
  setLayoutMode,
  slug,
  initialSlug,
  onSaveSlug,
  onValidateSlug,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  telegramEnabled,
  onSaveTelegram,
  telegramChatId,
  telegramChatName,
  formId,
  allowedDomains,
  onSaveAllowedDomains,
  activeTheme,
  setActiveTheme,
  pushToHistory,
  publicFormUrl,
  hostOrigin,
  isTelegramSyncing,
  isTelegramFetching,
  onStartTelegramSync,
  onCheckTelegramStatus,
  isPublicBuilder,
}: BuilderCanvasProps) {
  const t = useTranslations("Builder");

  const [manualChatIdInput, setManualChatIdInput] = React.useState(telegramChatId || "");

  React.useEffect(() => {
    setManualChatIdInput(telegramChatId || "");
  }, [telegramChatId]);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const effectiveTheme = resolveThemeValues(activeTheme, isDark);

  const tabMapping: ("form" | "theme" | "settings")[] = isPublicBuilder
    ? ["form", "theme"]
    : ["form", "theme", "settings"];
  const activeTabIndex = Math.max(0, tabMapping.indexOf(middleTab as any));

  const handleTabChange = (index: number) => {
    if (tabMapping[index]) {
      setMiddleTab(tabMapping[index]);
    }
  };

  const allTabs: DirectionAwareTab[] = [
    {
      id: 0,
      label: "Build",
      icon: FileText,
      iconColorClass: "text-indigo-400",
      content: (
        <div className="w-full max-w-2xl mx-auto space-y-6 relative pb-16">
          <FormCanvasTab
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            fields={fields}
            selectedFieldId={selectedFieldId}
            setSelectedFieldId={setSelectedFieldId}
            handleUpdateField={handleUpdateField}
            handleDeleteField={handleDeleteField}
            handleAddField={handleAddField}
            saveForm={(f) => saveForm(f, activeTheme, layoutMode)}
            handleReorder={handleReorder}
            handleDragReorder={handleDragReorder}
            activeTheme={activeTheme}
          />
        </div>
      ),
    },
    {
      id: 1,
      label: "Theme",
      icon: Palette,
      iconColorClass: "text-purple-400",
      content: (
        <div className="max-w-xl mx-auto space-y-6 pb-16">
          <ThemeCanvasTab
            activeTheme={activeTheme}
            setActiveTheme={setActiveTheme}
            saveForm={saveForm}
            pushToHistory={pushToHistory}
            fields={fields}
          />
        </div>
      ),
    },
    {
      id: 2,
      label: "Settings",
      icon: Settings,
      iconColorClass: "text-rose-400",
      content: (
        <div className="max-w-xl mx-auto space-y-6 pb-16">
          <SettingsCanvasTab
            visibility={visibility}
            onSaveVisibility={onSaveVisibility}
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            slug={slug}
            initialSlug={initialSlug}
            onSaveSlug={onSaveSlug}
            onValidateSlug={onValidateSlug}
            telegramEnabled={telegramEnabled}
            onSaveTelegram={onSaveTelegram}
            telegramChatId={telegramChatId}
            telegramChatName={telegramChatName}
            formId={formId}
            allowedDomains={allowedDomains || []}
            onSaveAllowedDomains={onSaveAllowedDomains}
            manualChatIdInput={manualChatIdInput}
            setManualChatIdInput={setManualChatIdInput}
            publicFormUrl={publicFormUrl}
            isTelegramSyncing={isTelegramSyncing}
            isTelegramFetching={isTelegramFetching}
            onStartTelegramSync={onStartTelegramSync}
            onCheckTelegramStatus={onCheckTelegramStatus}
          />
        </div>
      ),
    },
  ];

  const canvasTabs = isPublicBuilder ? allTabs.slice(0, 2) : allTabs;

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden min-w-0 relative transition-colors duration-300 bg-background/50"
      style={{
        backgroundColor: effectiveTheme.backgroundColor || undefined,
      }}
    >
      {/* Top Bar with DirectionAwareTabs with Icons + Undo/Redo */}
      <div className="border-b border-border/60 bg-background/60 backdrop-blur-xl px-6 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="w-20 hidden sm:block" />

        {/* Direction-Aware Navigation Tabs (showContent=false so it only acts as tab bar!) */}
        <div className="flex-1 flex justify-center max-w-lg mx-auto">
          <DirectionAwareTabs
            tabs={canvasTabs}
            activeTab={activeTabIndex}
            onTabChange={handleTabChange}
            showContent={false}
          />
        </div>

        {/* Action Controls (Undo / Redo) */}
        <div className="w-20 hidden sm:flex items-center justify-end gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={!canUndo}
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={!canRedo}
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Scrollable Canvas Content Area (Rendered ONCE here) */}
      <div className="flex-1 overflow-y-auto canvas-scrollbar p-4 sm:p-8 md:p-12 min-w-0 relative z-10">
        {canvasTabs[activeTabIndex]?.content}
      </div>
    </div>
  );
}
