import React from "react";
import { Settings, Undo2, Redo2, FileText, Palette } from "lucide-react";
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

interface BuilderCanvasProps {
  middleTab: "form" | "theme" | "responses" | "analytics" | "settings";
  setMiddleTab: (tab: "form" | "theme" | "responses" | "analytics" | "settings") => void;
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
  saveForm: (fields: FormField[], updatedTheme?: any, updatedLayoutMode?: "standard" | "single_field" | "custom_steps") => void;
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
  layoutMode?: "standard" | "single_field" | "custom_steps";
  setLayoutMode?: (mode: "standard" | "single_field" | "custom_steps") => void;
  slug: string;
  setSlug: (slug: string) => void;
  handleSaveSettings: (e: React.FormEvent) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  telegramEnabled: boolean;
  setTelegramEnabled: (v: boolean) => void;
  telegramChatId: string;
  setTelegramChatId: (v: string) => void;
  telegramChatName: string;
  setTelegramChatName: (v: string) => void;
  formId: string;
  allowedDomains?: string[];
  setAllowedDomains?: (domains: string[]) => void;
  activeTheme: any;
  setActiveTheme: (theme: any) => void;
  pushToHistory?: (fields: FormField[], theme: any | null) => void;
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
  setVisibility,
  layoutMode,
  setLayoutMode,
  slug,
  setSlug,
  handleSaveSettings,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  telegramEnabled,
  setTelegramEnabled,
  telegramChatId,
  setTelegramChatId,
  telegramChatName,
  setTelegramChatName,
  formId,
  allowedDomains,
  setAllowedDomains,
  activeTheme,
  setActiveTheme,
  pushToHistory,
}: BuilderCanvasProps) {
  const t = useTranslations("Builder");

  const [allowedDomainsText, setAllowedDomainsText] = React.useState("");
  const [manualChatIdInput, setManualChatIdInput] = React.useState(telegramChatId || "");

  React.useEffect(() => {
    if (allowedDomains) {
      setAllowedDomainsText(allowedDomains.join(", "));
    }
  }, [allowedDomains]);

  React.useEffect(() => {
    setManualChatIdInput(telegramChatId || "");
  }, [telegramChatId]);

  const handleDomainsChange = (text: string) => {
    setAllowedDomainsText(text);
    const parsed = text
      .split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    if (setAllowedDomains) {
      setAllowedDomains(parsed);
    }
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const MIDDLE_TABS = [
    { value: "form", label: t("tabBuild"), icon: FileText, iconColorClass: "text-indigo-500", shortcut: "ctrl+1" },
    { value: "theme", label: t("tabTheme"), icon: Palette, iconColorClass: "text-purple-500", shortcut: "ctrl+2" },
    { value: "settings", label: "Settings", icon: Settings, iconColorClass: "text-rose-500", shortcut: "ctrl+3" }
  ] as const;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative bg-transparent">
      {/* Tabs header with integrated left/right actions */}
      <div className="hidden md:block">
        <TabBar
          items={MIDDLE_TABS}
          selectedValue={middleTab}
          onChange={setMiddleTab}
          leftElement={
            middleTab === "form" && setLayoutMode ? (
              <div className="w-32 @[600px]:w-44 ml-3 animate-in fade-in zoom-in duration-200 hidden sm:block">
                <Select value={layoutMode} onValueChange={(val: any) => {
                  setLayoutMode(val);
                  saveForm(fields, null, val);
                }}>
                  <SelectTrigger className="h-8 text-xs bg-secondary/50 border-0 shadow-sm hover:bg-muted/40 transition-colors focus:ring-1 focus:ring-ring focus:ring-offset-0 backdrop-blur-sm w-full">
                    <SelectValue placeholder="Display Layout">
                      {layoutMode === "standard" && (
                        <>
                          <span className="hidden @[600px]:inline">Standard (All Fields)</span>
                          <span className="inline @[600px]:hidden">Standard</span>
                        </>
                      )}
                      {layoutMode === "single_field" && (
                        <>
                          <span className="hidden @[600px]:inline">One Field per Step</span>
                          <span className="inline @[600px]:hidden">1 Field/Step</span>
                        </>
                      )}
                      {layoutMode === "custom_steps" && (
                        <>
                          <span className="hidden @[600px]:inline">Grouped by Steps</span>
                          <span className="inline @[600px]:hidden">Grouped</span>
                        </>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-secondary/50 backdrop-blur-sm">
                    <SelectItem value="standard" className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold">Standard (All Fields)</span>
                        <span className="text-[10px] text-muted-foreground">All fields shown on one page</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="single_field" className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold">One Field per Step</span>
                        <span className="text-[10px] text-muted-foreground">Show one question at a time</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="custom_steps" className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold">Grouped by Steps</span>
                        <span className="text-[10px] text-muted-foreground">Use page break elements to group</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : undefined
          }
          rightElement={
            middleTab === "form" ? (
              <div className="items-center gap-1 bg-secondary/50 shadow-sm rounded-full p-0.5 mr-3 backdrop-blur-sm animate-in fade-in zoom-in duration-200 hidden sm:flex">
                 <Tooltip delayDuration={0}>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo} className="h-6 w-7 rounded-full">
                       <Undo2 className="h-3.5 w-3.5" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="bottom">Undo [Ctrl+Z]</TooltipContent>
                 </Tooltip>
                 <div className="w-[1px] h-3 bg-border" />
                 <Tooltip delayDuration={0}>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo} className="h-6 w-7 rounded-full">
                       <Redo2 className="h-3.5 w-3.5" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent side="bottom">Redo [Ctrl+Y]</TooltipContent>
                 </Tooltip>
              </div>
            ) : undefined
          }
        />
      </div>

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-14 pt-4 md:pt-20 min-w-0 relative z-10">
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
              setVisibility={setVisibility}
              layoutMode={layoutMode}
              setLayoutMode={setLayoutMode}
              slug={slug}
              setSlug={setSlug}
              telegramEnabled={telegramEnabled}
              setTelegramEnabled={setTelegramEnabled}
              telegramChatId={telegramChatId}
              setTelegramChatId={setTelegramChatId}
              telegramChatName={telegramChatName}
              setTelegramChatName={setTelegramChatName}
              formId={formId}
              allowedDomainsText={allowedDomainsText}
              handleDomainsChange={handleDomainsChange}
              manualChatIdInput={manualChatIdInput}
              setManualChatIdInput={setManualChatIdInput}
              handleSaveSettings={handleSaveSettings}
            />
          </div>
        )}
      </div>
    </div>
  );
}
