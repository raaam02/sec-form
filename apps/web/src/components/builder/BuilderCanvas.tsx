import React from "react";
import {
  AlertCircle, 
  Settings,
  Undo2,
  Redo2,
  FileText,
  CheckCircle2,
  Send,} from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { FormField } from "@sec-form/validators";
import { TabBar } from "../TabBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/ThemeProvider";
import { SortableFieldItem } from "./SortableFieldItem";

interface BuilderCanvasProps {
  middleTab: "form" | "responses" | "analytics" | "settings";
  setMiddleTab: (tab: "form" | "responses" | "analytics" | "settings") => void;
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
}: BuilderCanvasProps) {
  const t = useTranslations("Builder");
  const tCommon = useTranslations("Common");

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
    { value: "form", label: t("tabBuild"), icon: FileText, iconColorClass: "text-indigo-500", shortcut: "ctrl+3" },
    { value: "settings", label: "Settings", icon: Settings, iconColorClass: "text-rose-500", shortcut: "ctrl+6" }
  ] as const;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (handleDragReorder) {
        handleDragReorder(oldIndex, newIndex);
      } else {
        // Fallback or use standard logic if not provided
        if (oldIndex < newIndex) {
          for (let i = oldIndex; i < newIndex; i++) handleReorder(i, "down");
        } else {
          for (let i = oldIndex; i > newIndex; i--) handleReorder(i, "up");
        }
      }
    }
  }

  return (
    <div className={`flex-1 flex flex-col overflow-hidden min-w-0 relative ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Theme-aware Noise Colored Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: isDark ? "#000000" : "#ffffff",
          backgroundImage: isDark
            ? `
              radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.25) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.2) 1px, transparent 0)
            `
            : `
              radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.25) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.22) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.18) 1px, transparent 0)
            `,
          backgroundSize: "20px 20px, 30px 30px, 25px 25px",
          backgroundPosition: "0 0, 10px 10px, 15px 5px",
        }}
      />
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

            <Card className="border-border rounded-3xl bg-card/20 backdrop-blur-[1px] p-6 shadow-sm flex flex-col gap-5 relative">
              <div className="">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    saveForm(fields);
                  }}
                  className="w-full text-2xl font-bold font-outfit border-none focus:outline-none bg-transparent text-foreground border-b border-transparent focus:border-border pb-1 transition-colors"
                  placeholder={t("canvasTitlePlaceholder")}
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    saveForm(fields);
                  }}
                  className="w-full text-sm text-muted-foreground border-none focus:outline-none bg-transparent border-b border-transparent focus:border-border mt-2 pb-1 transition-colors"
                  placeholder={t("canvasDescPlaceholder")}
                />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                {fields.length === 0 ? (
                  <div className="py-16 border border-dashed border-border rounded-2xl text-center text-muted-foreground text-sm">
                    {t("canvasEmptyDesc")}
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                      {fields.map((field, index) => (
                        <SortableFieldItem 
                          key={field.id}
                          field={field}
                          index={index}
                          selectedFieldId={selectedFieldId}
                          setSelectedFieldId={setSelectedFieldId}
                          handleUpdateField={handleUpdateField}
                          handleDeleteField={handleDeleteField}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </Card>
          </div>
        )}



        {middleTab === "settings" && (
          <div className="max-w-xl mx-auto space-y-6">
            {/* <h3 className="font-outfit font-bold text-foreground text-sm pb-2 border-b border-border">Visibility & Custom URL</h3> */}
            
            <form onSubmit={handleSaveSettings} className="backdrop-blur-[1px] p-4 rounded-3xl border border-border/70 space-y-5 flex flex-col gap-2 text-xs text-muted-foreground font-semibold">
              <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
                <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-2">Visibility Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["public", "unlisted"] as const).map((mode) => (
                    <Button
                      key={mode}
                      type="button"
                      variant={visibility === mode ? "default" : "outline"}
                      onClick={() => setVisibility(mode)}
                      className={`h-9 w-full font-bold text-xs capitalize transition-colors rounded-xl`}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-normal leading-normal">
                  {visibility === "public" && "Public forms are open for anyone to view and submit responses."}
                  {visibility === "unlisted" && "Unlisted forms are private. Only the creator can view it; public submissions are disabled."}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
                <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-2">Form Display Layout</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mode: "standard", label: "Standard (1 Page)" },
                    { mode: "single_field", label: "Single Field per Step" },
                    { mode: "custom_steps", label: "Custom Steps" }
                  ].map((option) => (
                    <Button
                      key={option.mode}
                      type="button"
                      variant={layoutMode === option.mode ? "default" : "outline"}
                      onClick={() => setLayoutMode && setLayoutMode(option.mode as any)}
                      className={`h-9 w-full font-bold text-xs transition-colors rounded-xl`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-normal leading-normal">
                  {layoutMode === "standard" && "All fields are displayed on a single page."}
                  {layoutMode === "single_field" && "Each field gets its own separate page with Next/Back buttons."}
                  {layoutMode === "custom_steps" && "Drag and drop 'Step Break' fields into the canvas to split the form into custom pages."}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
                <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1">Custom Form URL Slug</label>
                <div className="flex items-center rounded-xl border border-border overflow-hidden">
                  <span className="text-xs font-mono text-muted-foreground px-3 bg-muted/40 h-9 flex items-center border-r border-border">/f/</span>
                  <Input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 h-9 px-3 bg-transparent border-0 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    placeholder="custom-slug"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-normal">Shorthand slug name. Letters, numbers, and dashes only.</p>
              </div>

              {/* Telegram Notifications */}
              <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1">Telegram Notifications</label>
                    <p className="text-xs text-muted-foreground font-normal leading-normal">
                      Receive real-time notifications in your own Telegram chats when answers are submitted.
                    </p>
                  </div>
                  <Switch
                    checked={telegramEnabled}
                    onCheckedChange={setTelegramEnabled}
                  />
                </div>

                {telegramEnabled && (
                  <div className="space-y-4 mt-2">
                    {telegramChatId ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <div>
                            <div className="text-[10px] font-bold">Connected to Telegram</div>
                            <div className="text-[9px] font-normal opacity-90">
                              Linked chat: <span className="font-semibold">{telegramChatName || telegramChatId}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            setTelegramChatId("");
                            setTelegramChatName("");
                          }}
                          className="h-8 px-3 text-[10px] font-bold rounded-xl"
                        >
                          Disconnect Telegram
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="border-t border-border/60 my-2" />

                        <div className="space-y-2">
                          <div className="text-xs font-bold text-muted-foreground">
                            Option 1: Quick Connect (Simplest)
                            <p className="mt-0.5 text-xs text-muted-foreground font-normal leading-normal">
                              Click the button below to open our Telegram Bot, then press <strong>Start</strong> to link this form.
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "FormuAIBot";
                              window.open(`https://t.me/${botName}?start=${formId}`, "_blank");
                            }}
                            className="h-8 px-3 font-bold text-[10px] uppercase rounded-xl flex items-center justify-center gap-1.5"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Connect Telegram Bot
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-muted-foreground">
                            Option 2: Manual Chat ID Connection
                            <p className="mt-0.5 text-xs text-muted-foreground font-normal leading-normal">
                              Or enter your Telegram Chat ID manually. You can get your Chat ID by messaging the bot <code>@userinfobot</code> on Telegram.
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              value={manualChatIdInput}
                              onChange={(e) => setManualChatIdInput(e.target.value)}
                              placeholder="e.g. 535123456"
                              className="h-9 px-3 bg-muted/50 text-xs text-foreground rounded-xl flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() => {
                                if (manualChatIdInput.trim()) {
                                  setTelegramChatId(manualChatIdInput.trim());
                                  setTelegramChatName("Manual Input");
                                }
                              }}
                              disabled={!manualChatIdInput.trim()}
                              className="h-9 px-4 font-bold text-[10px] uppercase rounded-xl shrink-0"
                            >
                              Link Chat
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
                <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1">Allowed Embed Domains</label>
                <Input
                  type="text"
                  value={allowedDomainsText}
                  onChange={(e) => handleDomainsChange(e.target.value)}
                  className="h-9 px-3 bg-transparent text-xs text-foreground rounded-xl"
                  placeholder="e.g. mywebsite.com, anotherdomain.com"
                />
                <p className="text-xs text-muted-foreground mt-1 font-normal leading-normal">
                  Restrict where your form can be embedded. Enter a comma-separated list of domains. Leave empty to allow embedding anywhere.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="submit"
                  className="h-9 px-4 font-semibold text-xs rounded-xl"
                >
                  {tCommon("save")}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
