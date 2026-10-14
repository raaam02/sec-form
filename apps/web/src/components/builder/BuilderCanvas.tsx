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

  const [activeSidebar, setActiveSidebar] = React.useState<"theme" | "settings" | null>(
    middleTab === "theme" || middleTab === "settings" ? middleTab : null
  );

  React.useEffect(() => {
    if (middleTab === "theme" || middleTab === "settings") {
      setActiveSidebar(middleTab);
    } else if (middleTab === "form") {
      setActiveSidebar(null);
    }
  }, [middleTab]);

  const toggleSidebar = (target: "theme" | "settings") => {
    if (activeSidebar === target) {
      setActiveSidebar(null);
      setMiddleTab("form");
    } else {
      setActiveSidebar(target);
      setMiddleTab(target);
    }
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden min-w-0 relative transition-colors duration-300 bg-background/50"
      style={{
        backgroundColor: effectiveTheme.backgroundColor || undefined,
      }}
    >
      {/* Top Bar with Customize / Settings Togglers + Undo/Redo */}
      <div className="border-b border-border/60 bg-background/70 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 z-20">
        {/* Left side indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/40 text-[11px] font-medium text-muted-foreground border border-border/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Editor</span>
          </div>
        </div>

        {/* Right side controls: Customize, Settings, Undo, Redo */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Customize / Theme Toggler */}
          <Button
            variant={activeSidebar === "theme" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => toggleSidebar("theme")}
            className={cn(
              "h-8 px-3 rounded-xl gap-1.5 text-xs font-medium transition-all",
              activeSidebar === "theme"
                ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
            title="Customize theme & styling"
          >
            <Palette className="h-3.5 w-3.5 text-purple-500" />
            <span>Theme</span>
          </Button>

          {/* Settings Toggler (hidden in public builder) */}
          {!isPublicBuilder && (
            <Button
              variant={activeSidebar === "settings" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => toggleSidebar("settings")}
              className={cn(
                "h-8 px-3 rounded-xl gap-1.5 text-xs font-medium transition-all",
                activeSidebar === "settings"
                  ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              title="Form settings & configuration"
            >
              <Settings className="h-3.5 w-3.5 text-rose-500" />
              <span>Settings</span>
            </Button>
          )}

          {/* Divider */}
          <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={!canUndo}
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={!canRedo}
              className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground disabled:opacity-30"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Always Live Form Canvas + Optional Right Slide-out Sidebar */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Main Scrollable Canvas Area (ALWAYS FormCanvasTab for authentic live editing) */}
        <div className="flex-1 overflow-y-auto canvas-scrollbar p-4 sm:p-8 md:p-12 min-w-0 relative z-10">
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
          {activeSidebar && (
            <motion.aside
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="absolute sm:relative right-0 top-0 bottom-0 w-full sm:w-[380px] md:w-[420px] shrink-0 border-l border-border/70 bg-card/95 backdrop-blur-2xl flex flex-col z-30 shadow-2xl overflow-hidden"
            >
              {/* Sidebar Header */}
              <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between shrink-0 bg-background/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    {activeSidebar === "theme" ? (
                      <Palette className="h-4 w-4 text-purple-500" />
                    ) : (
                      <Settings className="h-4 w-4 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {activeSidebar === "theme" ? "Customize Theme" : "Form Settings"}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {activeSidebar === "theme"
                        ? "Live preview updates in real-time"
                        : "Configure submissions, links & domains"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setActiveSidebar(null);
                    setMiddleTab("form");
                  }}
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Sidebar Scrollable Body */}
              <div className="flex-1 overflow-y-auto canvas-scrollbar p-4 sm:p-5 space-y-6">
                {activeSidebar === "theme" && (
                  <ThemeCanvasTab
                    activeTheme={activeTheme}
                    setActiveTheme={setActiveTheme}
                    saveForm={saveForm}
                    pushToHistory={pushToHistory}
                    fields={fields}
                  />
                )}
                {activeSidebar === "settings" && (
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
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
