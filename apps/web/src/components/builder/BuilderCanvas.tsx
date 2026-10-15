"use client";

import React from "react";
import { Undo2, Redo2, Palette, Settings, X } from "lucide-react";
import { FormField, FieldType } from "@sec-form/validators";
import { resolveThemeValues } from "@sec-form/shared";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
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
  activeSidebar?: "theme" | "settings" | null;
  setActiveSidebar?: (val: "theme" | "settings" | null) => void;
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
  activeSidebar: propActiveSidebar,
  setActiveSidebar: propSetActiveSidebar,
}: BuilderCanvasProps) {
  const t = useTranslations("Builder");

  const [manualChatIdInput, setManualChatIdInput] = React.useState(telegramChatId || "");

  React.useEffect(() => {
    setManualChatIdInput(telegramChatId || "");
  }, [telegramChatId]);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const effectiveTheme = resolveThemeValues(activeTheme, isDark);

  const [localActiveSidebar, setLocalActiveSidebar] = React.useState<"theme" | "settings" | null>(
    middleTab === "theme" || middleTab === "settings" ? middleTab : null
  );

  const currentSidebar = propActiveSidebar !== undefined ? propActiveSidebar : localActiveSidebar;
  const setSidebar = propSetActiveSidebar !== undefined ? propSetActiveSidebar : setLocalActiveSidebar;

  React.useEffect(() => {
    if (middleTab === "theme" || middleTab === "settings") {
      setSidebar(middleTab);
    } else if (middleTab === "form") {
      setSidebar(null);
    }
  }, [middleTab]);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden min-w-0 relative transition-colors duration-300 bg-background/50"
      style={{
        backgroundColor: effectiveTheme.backgroundColor || undefined,
      }}
    >
      {/* Main Workspace: Always Live Form Canvas + Optional Right Slide-out Sidebar */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Main Scrollable Canvas Area (ALWAYS FormCanvasTab for authentic live editing) */}
        <div className="flex-1 overflow-y-auto canvas-scrollbar p-4 sm:p-8 md:p-12 min-w-0 relative z-10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {/* Floating Undo / Redo Controls fixed on top right corner and slides with sidebar */}
          <div className="sticky top-0 z-20 flex justify-end pointer-events-none mb-[-36px]">
            <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-card/90 backdrop-blur-md border border-border/60 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={!canUndo}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer shadow-none"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
              <div className="h-3.5 w-px bg-border/60" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={!canRedo}
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer shadow-none"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="w-full max-w-2xl mx-auto space-y-6 relative pb-24">
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
        </div>

        {/* Right Slide-out Inspector Sidebar for Theme or Settings */}
        <AnimatePresence>
          {currentSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full border-l border-border/60 bg-card/95 backdrop-blur-2xl flex flex-col z-30 shadow-xl overflow-hidden shrink-0"
            >
              <div className="w-[380px] h-full flex flex-col">
                {/* Sidebar Header: clean label without icon, without bottom border, not uppercase */}
                <div className="px-5 pt-4 pb-2 flex items-center justify-between shrink-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {currentSidebar === "theme" ? "Customize theme" : "Form settings"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSidebar(null);
                      setMiddleTab("form");
                    }}
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shadow-none"
                    title="Close sidebar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sidebar Scrollable Body */}
                <div className="flex-1 overflow-y-auto canvas-scrollbar p-5 space-y-6">
                  {currentSidebar === "theme" && (
                    <ThemeCanvasTab
                      activeTheme={activeTheme}
                      setActiveTheme={setActiveTheme}
                      saveForm={saveForm}
                      pushToHistory={pushToHistory}
                      fields={fields}
                    />
                  )}
                  {currentSidebar === "settings" && (
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
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
