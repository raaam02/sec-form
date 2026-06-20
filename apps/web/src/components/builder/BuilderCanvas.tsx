import React from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Download, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  CheckCircle2,
  Eye,
  Percent,
  Plus,
  GripVertical,
  Undo2,
  Redo2,
  Send
} from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { FormField } from "@sec-form/validators";
import { LoadingSpinner } from "@sec-form/ui";
import { TabBar } from "../TabBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/ThemeProvider";

function SortableFieldItem({
  field, index, selectedFieldId, setSelectedFieldId, handleUpdateField, handleDeleteField
}: {
  field: FormField;
  index: number;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleDeleteField: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedFieldId(field.id)}
      className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex gap-3 items-start ${
        selectedFieldId === field.id
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card/40 hover:border-border/80"
      }`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-1 cursor-grab opacity-50 hover:opacity-100 shrink-0 outline-none"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex justify-between items-start gap-4 flex-1">
        <div className="min-w-0 flex-1">
          {field.type === "step_break" ? (
            <div className="font-semibold text-muted-foreground italic flex flex-col items-center justify-center py-2 mt-2 w-full border border-dashed border-border/50 bg-background/50 rounded-lg">
              <span>--- Page Break ---</span>
              <span className="text-[10px] font-normal mt-1 opacity-70 text-center max-w-[200px]">Fields below this will appear on the next page in the live form</span>
            </div>
          ) : (
            <>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                {field.type} {field.required && <span className="text-destructive">*</span>}
              </span>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-foreground mt-0.5 w-full bg-transparent border-b border-transparent focus:border-primary focus:outline-none transition-colors"
                placeholder="Field Label"
              />
              {selectedFieldId === field.id && (
                <input
                  type="text"
                  value={field.description || ""}
                  onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground text-xs mt-0.5 w-full bg-transparent border-b border-transparent focus:border-primary focus:outline-none transition-colors"
                  placeholder="Field description (optional)"
                />
              )}
            </>
          )}
          {/* Card Field Input Template Previews (Only if selected/expanded) */}
          {selectedFieldId === field.id && field.type !== "step_break" && (
            <div className="mt-3">
              {["text", "email", "date"].includes(field.type) && (
                <Input type="text" className="h-9 w-full max-w-sm rounded-lg border border-border bg-background/40 px-3 text-xs" placeholder={field.placeholder || "Response goes here..."} disabled />
              )}
              {field.type === "time" && (
                <Input type="time" className="h-9 w-32 rounded-lg border border-border bg-background/40 px-3 text-xs" disabled />
              )}
              {field.type === "textarea" && (
                <textarea className="w-full max-w-md h-16 rounded-lg border border-border bg-background/40 p-2 text-xs focus:outline-none focus:ring-0" placeholder={field.placeholder || "Write long response..."} disabled />
              )}
              {field.type === "number" && (
                <Input type="number" className="h-9 w-28 rounded-lg border border-border bg-background/40 px-3 text-xs" placeholder="0" disabled />
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center gap-2"><input type="checkbox" className="rounded border-border text-primary focus:ring-0 focus:ring-offset-0" disabled /><span className="text-xs text-muted-foreground">Agree to terms</span></div>
              )}
              {field.type === "rating" && (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-xl text-muted-foreground select-none">★</span>
                  ))}
                </div>
              )}
              {["select", "multiselect"].includes(field.type) && field.options && (
                <div className="flex flex-wrap gap-1">
                  {field.options.map((opt) => (
                    <span key={opt} className="rounded bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground border border-border/40">
                      {opt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Advanced Options & Required Switch (Only if selected) */}
          {selectedFieldId === field.id && field.type !== "step_break" && (
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Required Field</span>
                <Switch 
                  checked={field.required}
                  onCheckedChange={(checked) => handleUpdateField(field.id, { required: checked })}
                />
              </div>

              {/* Placeholder Field */}
                {["text", "textarea", "email", "phone", "number", "select", "date", "time"].includes(field.type) && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Placeholder</span>
                    <Input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                      className="h-8 text-xs bg-card"
                      placeholder="Enter placeholder text"
                    />
                  </div>
                )}

                {/* Min / Max Validation */}
                {["number", "rating"].includes(field.type) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Minimum Value</span>
                      <Input
                        type="number"
                        value={field.validation?.min !== undefined ? field.validation.min : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : Number(e.target.value);
                          handleUpdateField(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              min: val
                            }
                          });
                        }}
                        className="h-8 text-xs bg-card"
                        placeholder="e.g. 0"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Maximum Value</span>
                      <Input
                        type="number"
                        value={field.validation?.max !== undefined ? field.validation.max : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? undefined : Number(e.target.value);
                          handleUpdateField(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              max: val
                            }
                          });
                        }}
                        className="h-8 text-xs bg-card"
                        placeholder="e.g. 100"
                      />
                    </div>
                  </div>
                )}

                {/* Custom Pattern Regex Validation */}
                {["text", "textarea", "phone"].includes(field.type) && (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Regex Validation Pattern</span>
                      <Input
                        type="text"
                        value={field.validation?.pattern || ""}
                        onChange={(e) => {
                          handleUpdateField(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              pattern: e.target.value || undefined
                            }
                          });
                        }}
                        className="h-8 text-xs bg-card"
                        placeholder="e.g. ^[0-9]{5}$"
                      />
                    </div>
                    {field.validation?.pattern && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Custom Error Message</span>
                        <Input
                          type="text"
                          value={field.validation?.errorMessage || ""}
                          onChange={(e) => {
                            handleUpdateField(field.id, {
                              validation: {
                                ...(field.validation || {}),
                                errorMessage: e.target.value || undefined
                              }
                            });
                          }}
                          className="h-8 text-xs bg-card"
                          placeholder="Custom error if pattern fails"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Options list for select, multiselect */}
                {["select", "multiselect"].includes(field.type) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Options</span>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="h-6 px-2 text-[10px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentOptions = field.options || [];
                          handleUpdateField(field.id, { options: [...currentOptions, `Option ${currentOptions.length + 1}`] });
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Option
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                      {(field.options || []).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <Input 
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...(field.options || [])];
                              newOptions[optIndex] = e.target.value;
                              handleUpdateField(field.id, { options: newOptions });
                            }}
                            className="h-7 text-xs bg-card"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newOptions = [...(field.options || [])];
                              newOptions.splice(optIndex, 1);
                              handleUpdateField(field.id, { options: newOptions });
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        {/* Actions (Delete and Collapse/Expand) */}
        <div className="flex items-center gap-1 shrink-0 self-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (selectedFieldId === field.id) {
                setSelectedFieldId(null);
              } else {
                setSelectedFieldId(field.id);
              }
            }}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
          >
            {selectedFieldId === field.id ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.stopPropagation();
                handleDeleteField(field.id);
            }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  responses,
  isResponsesLoading,
  handleExportCSV,
  analytics,
  isAnalyticsLoading,
  aiInsights,
  isInsightsGenerating,
  insightsError,
  handleGenerateInsights,
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
}: BuilderCanvasProps) {
  const t = useTranslations("Builder");
  const tCommon = useTranslations("Common");
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

            {visibility === "public" && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-left">
                  <p className="font-bold">You are editing a live public form</p>
                  <p className="opacity-90">Any changes you make here will automatically revert the form to <strong>Draft</strong> mode to prevent displaying a half-edited form publicly.</p>
                </div>
              </div>
            )}

            <Card className="border-border bg-card/20 backdrop-blur-[1px] p-6 shadow-sm flex flex-col gap-5 relative">
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
          <div className="max-w-xl mx-auto space-y-6 bg-transparent backdrop-blur-[1px] p-6 rounded-2xl border">
            <h3 className="font-outfit font-bold text-foreground text-sm pb-2 border-b border-border">Visibility & Custom URL</h3>
            
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs text-muted-foreground font-semibold">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Visibility Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["draft", "public", "unlisted"] as const).map((mode) => (
                    <Button
                      key={mode}
                      type="button"
                      variant={visibility === mode ? "default" : "outline"}
                      onClick={() => setVisibility(mode)}
                      className={`h-9 w-full font-bold text-[10px] uppercase transition-colors rounded-xl`}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 font-normal leading-normal">
                  {visibility === "draft" && "Draft forms are not accessible publicly and do not accept responses."}
                  {visibility === "public" && "Public forms are visible in the explore page/gallery and accept responses."}
                  {visibility === "unlisted" && "Unlisted forms accept responses, but are hidden from general explore listings."}
                </p>
              </div>

              <div className="pt-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Form Display Layout</label>
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
                      className={`h-9 w-full font-bold text-[10px] uppercase transition-colors rounded-xl`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 font-normal leading-normal">
                  {layoutMode === "standard" && "All fields are displayed on a single page."}
                  {layoutMode === "single_field" && "Each field gets its own separate page with Next/Back buttons."}
                  {layoutMode === "custom_steps" && "Drag and drop 'Step Break' fields into the canvas to split the form into custom pages."}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Custom Form URL Slug</label>
                <div className="flex items-center rounded-xl border border-border overflow-hidden bg-muted/50">
                  <span className="text-[10px] font-mono text-muted-foreground px-3 bg-muted h-9 flex items-center border-r border-border">/f/</span>
                  <Input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 h-9 px-3 bg-transparent border-0 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    placeholder="custom-slug"
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 font-normal">Shorthand slug name. Letters, numbers, and dashes only.</p>
              </div>

              {/* Telegram Notifications */}
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Telegram Notifications</label>
                    <p className="text-[11px] text-muted-foreground font-normal leading-normal">
                      Receive real-time notifications in your own Telegram chats when answers are submitted.
                    </p>
                  </div>
                  <Switch
                    checked={telegramEnabled}
                    onCheckedChange={setTelegramEnabled}
                  />
                </div>

                {telegramEnabled && (
                  <div className="space-y-4 pt-2 bg-muted/20 p-4 rounded-xl border border-border">
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
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-foreground">Option 1: Quick Connect (Simplest)</div>
                          <p className="text-[11px] text-muted-foreground font-normal leading-normal">
                            Click the button below to open our Telegram Bot, then press <strong>Start</strong> to link this form.
                          </p>
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

                        <div className="border-t border-border/60 my-2" />

                        <div className="space-y-2">
                          <div className="text-xs font-bold text-foreground">Option 2: Manual Chat ID Connection</div>
                          <p className="text-[11px] text-muted-foreground font-normal leading-normal">
                            Or enter your Telegram Chat ID manually. You can get your Chat ID by messaging the bot <code>@userinfobot</code> on Telegram.
                          </p>
                          <Input
                            type="text"
                            value={telegramChatId}
                            onChange={(e) => {
                              setTelegramChatId(e.target.value);
                              setTelegramChatName("Manual Input");
                            }}
                            placeholder="e.g. 555123456"
                            className="h-9 px-3 bg-muted/50 text-xs text-foreground rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border">
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
