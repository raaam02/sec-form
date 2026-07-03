import React from "react";
import { Settings, Undo2, Redo2, FileText, Palette, Code } from "lucide-react";
import { FormField } from "@sec-form/validators";
import { TabBar } from "../TabBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/ThemeProvider";
import { FormCanvasTab } from "./FormCanvasTab";
import { SettingsCanvasTab } from "./SettingsCanvasTab";
import { ThemeCanvasTab } from "./ThemeCanvasTab";
import { EmbedCanvasTab } from "./EmbedCanvasTab";

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
}: BuilderCanvasProps) {
  const t = useTranslations("Builder");

  const [manualChatIdInput, setManualChatIdInput] = React.useState(telegramChatId || "");

  React.useEffect(() => {
    setManualChatIdInput(telegramChatId || "");
  }, [telegramChatId]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const MIDDLE_TABS = [
    { value: "form", label: t("tabBuild"), icon: FileText, iconColorClass: "text-indigo-500", shortcut: "ctrl+1" },
    { value: "theme", label: t("tabTheme"), icon: Palette, iconColorClass: "text-purple-500", shortcut: "ctrl+2" },
    { value: "settings", label: "Settings", icon: Settings, iconColorClass: "text-rose-500", shortcut: "ctrl+3" },
    { value: "embed", label: "Embed", icon: Code, iconColorClass: "text-teal-500", shortcut: "ctrl+4" }
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative bg-transparent">
      {/* Tabs header with integrated left/right actions */}
      <div className="hidden md:block">
        <TabBar
          items={MIDDLE_TABS}
          selectedValue={middleTab}
          onChange={setMiddleTab}
        />
      </div>

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto canvas-scrollbar p-4 sm:p-14 pt-4 md:pt-20 min-w-0 relative z-10">
        {middleTab === "form" && (
          <div className="max-w-2xl mx-auto space-y-6 relative pb-10">
            {/* Mobile-only Canvas Controls to prevent TabBar clustering */}
            <div className="flex sm:hidden justify-between items-center gap-2 bg-secondary/30 backdrop-blur-sm rounded-xl p-2 mb-2 pointer-events-auto">
              {/* Layout Mode Select */}
              {setLayoutMode && (
                <div className="w-32">
                  <Select value={layoutMode} onValueChange={(val: any) => {
                    setLayoutMode(val);
                    saveForm(fields, null, val);
                  }}>
                    <SelectTrigger className="h-8 text-xs bg-background/80 border border-border shadow-sm">
                      <SelectValue placeholder="Display Layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="single_field">1 Field/Step</SelectItem>
                      <SelectItem value="custom_steps">Grouped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Undo / Redo */}
              <div className="flex items-center gap-1 bg-background/80 border border-border rounded-lg p-0.5">
                <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo} className="h-7 w-7 rounded-md">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo} className="h-7 w-7 rounded-md">
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

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
              saveForm={(f) => saveForm(f)}
              handleReorder={handleReorder}
              handleDragReorder={handleDragReorder}
            />
          </div>
        )}

        {middleTab === "theme" && (
          <div className="max-w-xl mx-auto space-y-6">
            <ThemeCanvasTab
              activeTheme={activeTheme}
              setActiveTheme={setActiveTheme}
              saveForm={saveForm}
              pushToHistory={pushToHistory}
              fields={fields}
            />
          </div>
        )}

        {middleTab === "settings" && (
          <div className="max-w-xl mx-auto space-y-6">
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
            />
          </div>
        )}

        {middleTab === "embed" && (
          <div className="max-w-xl mx-auto space-y-6">
            <EmbedCanvasTab
              publicFormUrl={publicFormUrl}
              id={formId}
              hostOrigin={hostOrigin}
            />
          </div>
        )}
      </div>

      {/* Floating Undo/Redo bar at bottom (desktop only, form tab) */}
      {middleTab === "form" && (
        <div className="hidden sm:flex absolute bottom-4 right-4 z-20 items-center gap-1 bg-transparent border border-border shadow-md rounded-full px-1.5 py-1 backdrop-blur-[1px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo} className="h-7 w-7 rounded-full">
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Undo [Ctrl+Z]</TooltipContent>
          </Tooltip>
          <div className="w-[1px] h-3.5 bg-border" />
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo} className="h-7 w-7 rounded-full">
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Redo [Ctrl+Y]</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
