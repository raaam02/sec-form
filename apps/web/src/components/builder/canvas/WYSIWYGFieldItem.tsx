"use client";

import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField, FieldType } from "@sec-form/validators";
import { ThemeConfig, resolveThemeValues } from "@sec-form/shared";
import { useTheme } from "@/components/ThemeProvider";
import {
  GripVertical,
  Trash2,
  Copy,
  Settings2,
  Plus,
  X,
  Asterisk,
  Check,
  Star,
  Calendar,
  Clock,
  SplitSquareVertical,
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  List,
  CheckSquare,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field-label";

interface FieldTypeMeta {
  type: FieldType;
  label: string;
  badge: string;
  icon: React.ElementType;
  iconColor: string;
}

const FIELD_TYPE_METAS: FieldTypeMeta[] = [
  { type: "text", label: "Short Text", badge: "Aa", icon: Type, iconColor: "text-indigo-400" },
  { type: "textarea", label: "Long Text", badge: "¶", icon: AlignLeft, iconColor: "text-blue-400" },
  { type: "email", label: "Email Address", badge: "@", icon: Mail, iconColor: "text-emerald-400" },
  { type: "phone", label: "Phone Number", badge: "+1", icon: Phone, iconColor: "text-rose-400" },
  { type: "number", label: "Number", badge: "#", icon: Hash, iconColor: "text-amber-400" },
  { type: "select", label: "Single Select", badge: "▾", icon: List, iconColor: "text-orange-400" },
  { type: "multiselect", label: "Multi Select", badge: "☑", icon: CheckSquare, iconColor: "text-teal-400" },
  { type: "checkbox", label: "Checkbox", badge: "✓", icon: CheckSquare, iconColor: "text-purple-400" },
  { type: "rating", label: "Rating Score", badge: "★", icon: Star, iconColor: "text-yellow-400" },
  { type: "date", label: "Date Picker", badge: "📅", icon: Calendar, iconColor: "text-pink-400" },
  { type: "time", label: "Time Picker", badge: "⏰", icon: Clock, iconColor: "text-rose-400" },
  { type: "step_break", label: "Page Break", badge: "§", icon: SplitSquareVertical, iconColor: "text-slate-400" },
];

const CHOICE_COLOR_PALETTES = [
  { bg: "bg-red-500/15 dark:bg-red-500/20", text: "text-red-700 dark:text-red-300", border: "border-red-500/30" },
  { bg: "bg-amber-500/15 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-300", border: "border-amber-500/30" },
  { bg: "bg-yellow-500/15 dark:bg-yellow-500/20", text: "text-yellow-800 dark:text-yellow-300", border: "border-yellow-500/30" },
  { bg: "bg-emerald-500/15 dark:bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-500/30" },
  { bg: "bg-teal-500/15 dark:bg-teal-500/20", text: "text-teal-700 dark:text-teal-300", border: "border-teal-500/30" },
  { bg: "bg-blue-500/15 dark:bg-blue-500/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-500/30" },
  { bg: "bg-indigo-500/15 dark:bg-indigo-500/20", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-500/30" },
  { bg: "bg-purple-500/15 dark:bg-purple-500/20", text: "text-purple-700 dark:text-purple-300", border: "border-purple-500/30" },
  { bg: "bg-pink-500/15 dark:bg-pink-500/20", text: "text-pink-700 dark:text-pink-300", border: "border-pink-500/30" },
];

interface WYSIWYGFieldItemProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (field: FormField) => void;
  onInsertAfter?: (type: FieldType) => void;
  onEnter?: () => void;
  activeTheme?: ThemeConfig | null;
}

export function WYSIWYGFieldItem({
  field,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onInsertAfter,
  onEnter,
  activeTheme,
}: WYSIWYGFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const effectiveTheme = resolveThemeValues(activeTheme, isDark);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(
    Boolean(field.description && field.description.trim().length > 0)
  );

  useEffect(() => {
    if (field.description && field.description.trim().length > 0) {
      setShowDescription(true);
    }
  }, [field.description]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const borderRadius = effectiveTheme.borderRadius || "12px";
  const primaryColor = effectiveTheme.primaryColor || "var(--primary)";
  const inputBgColor = effectiveTheme.inputBgColor || "transparent";
  const inputBorderColor = effectiveTheme.inputBorderColor || (isDark ? "#27272a" : "#e2e8f0");

  const currentMeta = FIELD_TYPE_METAS.find((m) => m.type === field.type) || FIELD_TYPE_METAS[0];
  const CurrentIcon = currentMeta.icon;

  // Page break rendering
  if (field.type === "step_break") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        onClick={onSelect}
        className={`group relative p-4 my-8 rounded-2xl border-2 border-dashed transition-all duration-200 ${
          isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border/60 hover:border-primary/40 bg-secondary/20"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab text-muted-foreground/60 hover:text-foreground transition-colors p-1"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <SplitSquareVertical className="w-4 h-4 text-primary" />
              <span className="font-semibold text-xs tracking-wider uppercase text-foreground">
                Page Break (Step {index + 1})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(field.id);
              }}
              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-xl"
              title="Delete page break"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground ml-8 mt-1">
          Questions below this line will appear on the next page/step for respondents.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative py-3.5 px-3 -mx-3 rounded-2xl transition-all duration-200 ${
        isSelected
          ? "bg-muted/30 ring-1 ring-primary/20"
          : "hover:bg-muted/15"
      }`}
    >
      {/* Left Gutter: Clean Drag Handle aligned with question title row */}
      <div
        className={`absolute -left-7 sm:-left-8 top-3.5 flex items-center transition-opacity duration-150 z-20 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          {...attributes}
          {...listeners}
          className="h-7 w-7 flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground hover:bg-muted/70 rounded-md transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Main Question Block */}
      <div className="space-y-2">
        {/* Question Title & Actions Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Question Label with Required Asterisk attached directly to it */}
          <FieldLabel
            label={field.label}
            required={field.required}
            editable
            onChange={(val) => onUpdate(field.id, { label: val })}
            onEnter={onEnter}
            placeholder="Question title..."
          />

          {/* Right Header Controls: Type Badge + Description Toggle + Required Toggle + Settings */}
          <div
            className={`flex items-center gap-1 shrink-0 transition-opacity duration-150 ${
              isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Field Type Badge (Clean, informational pill - no dropdown) */}
            <div
              className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-muted-foreground/80 bg-muted/40 rounded-lg border border-border/40 select-none"
              title={`Field type: ${currentMeta.label}`}
            >
              <CurrentIcon className={`w-3.5 h-3.5 ${currentMeta.iconColor}`} />
              <span className="hidden sm:inline">{currentMeta.label}</span>
            </div>

            {/* Description Toggler Button */}
            <button
              type="button"
              onClick={() => {
                if (showDescription && (!field.description || field.description.trim() === "")) {
                  setShowDescription(false);
                } else if (showDescription && field.description) {
                  onUpdate(field.id, { description: undefined });
                  setShowDescription(false);
                } else {
                  setShowDescription(true);
                }
              }}
              className={`h-7 px-2 flex items-center gap-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                showDescription || field.description
                  ? "bg-secondary text-foreground border-border shadow-xs"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Toggle question description"
            >
              <AlignLeft className="w-3 h-3" />
              <span className="hidden md:inline">Description</span>
            </button>

            {/* Required Star Button */}
            <button
              type="button"
              onClick={() => onUpdate(field.id, { required: !field.required })}
              className={`h-7 px-2 flex items-center gap-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                field.required
                  ? "bg-destructive/15 text-destructive border-destructive/30"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title={field.required ? "Required field" : "Optional field"}
            >
              <Asterisk className="w-3 h-3" />
              <span className="hidden md:inline">Required</span>
            </button>

            {/* Duplicate Button */}
            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(field)}
                className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer"
                title="Duplicate question"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}

            {/* Validation Settings Popover */}
            <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors cursor-pointer"
                  title="Field settings"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-4 space-y-3.5 rounded-2xl shadow-2xl backdrop-blur-xl bg-card/95 border border-border z-50"
                align="end"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Field Validation
                  </h4>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    {field.type}
                  </span>
                </div>

                {["number", "rating"].includes(field.type) && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">
                        Minimum
                      </label>
                      <Input
                        type="number"
                        value={field.validation?.min ?? ""}
                        onChange={(e) =>
                          onUpdate(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              min: e.target.value === "" ? undefined : Number(e.target.value),
                            },
                          })
                        }
                        className="h-8 text-xs mt-1 rounded-xl"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">
                        Maximum
                      </label>
                      <Input
                        type="number"
                        value={field.validation?.max ?? ""}
                        onChange={(e) =>
                          onUpdate(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              max: e.target.value === "" ? undefined : Number(e.target.value),
                            },
                          })
                        }
                        className="h-8 text-xs mt-1 rounded-xl"
                        placeholder="100"
                      />
                    </div>
                  </div>
                )}

                {["text", "textarea", "phone"].includes(field.type) && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">
                        Regex Pattern
                      </label>
                      <Input
                        type="text"
                        value={field.validation?.pattern || ""}
                        onChange={(e) =>
                          onUpdate(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              pattern: e.target.value || undefined,
                            },
                          })
                        }
                        className="h-8 text-xs mt-1 rounded-xl"
                        placeholder="e.g. ^[0-9]{10}$"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-bold">
                        Custom Error Message
                      </label>
                      <Input
                        type="text"
                        value={field.validation?.errorMessage || ""}
                        onChange={(e) =>
                          onUpdate(field.id, {
                            validation: {
                              ...(field.validation || {}),
                              errorMessage: e.target.value || undefined,
                            },
                          })
                        }
                        className="h-8 text-xs mt-1 rounded-xl"
                        placeholder="Please enter a valid format"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <span className="text-xs text-foreground font-semibold">Required Question</span>
                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) => onUpdate(field.id, { required: checked })}
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* Clean Delete Button */}
            <button
              type="button"
              onClick={() => onDelete(field.id)}
              className="h-7 w-7 flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
              title="Delete question"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optional Description (only shown when toggled on or if content exists) */}
        {(showDescription || (field.description && field.description.trim().length > 0)) && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <input
              type="text"
              value={field.description || ""}
              onChange={(e) => onUpdate(field.id, { description: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Add description or instructions (optional)..."
              className="flex-1 text-xs text-muted-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/40 leading-normal"
              autoFocus={showDescription && !field.description}
            />
            <button
              type="button"
              onClick={() => {
                onUpdate(field.id, { description: undefined });
                setShowDescription(false);
              }}
              className="h-5 w-5 flex items-center justify-center text-muted-foreground/40 hover:text-foreground rounded transition-colors"
              title="Remove description"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Real Live Form Inputs (Tally / Typeform Style) */}
        <div className="pt-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Short Text, Email, Phone, Number */}
          {["text", "email", "phone", "number"].includes(field.type) && (
            <div className="relative">
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                placeholder={
                  field.type === "email"
                    ? "Type placeholder e.g. name@example.com"
                    : field.type === "phone"
                    ? "Type placeholder e.g. +1 (555) 000-0000"
                    : field.type === "number"
                    ? "Type placeholder e.g. 0"
                    : "Type placeholder text..."
                }
                className="w-full h-10 px-3.5 pr-10 text-sm text-foreground bg-background/40 hover:bg-background/60 focus:bg-background/80 border transition-all focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40"
                style={{
                  borderRadius,
                  borderColor: inputBorderColor,
                  backgroundColor: inputBgColor,
                }}
              />
              <div className="absolute right-3 top-2.5 text-xs font-mono text-muted-foreground/40 pointer-events-none select-none">
                {currentMeta.badge}
              </div>
            </div>
          )}

          {/* Long Text / Textarea */}
          {field.type === "textarea" && (
            <div className="relative">
              <textarea
                rows={2}
                value={field.placeholder || ""}
                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                placeholder="Type placeholder text for multiline response..."
                className="w-full p-3 pr-10 text-sm text-foreground bg-background/40 hover:bg-background/60 focus:bg-background/80 border transition-all focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40 resize-none"
                style={{
                  borderRadius,
                  borderColor: inputBorderColor,
                  backgroundColor: inputBgColor,
                }}
              />
              <div className="absolute right-3 bottom-2.5 text-xs font-mono text-muted-foreground/40 pointer-events-none select-none">
                ¶
              </div>
            </div>
          )}

          {/* Choices: Single Select & Multi Select (Tally-Style Vertical Colored Pills) */}
          {["select", "multiselect"].includes(field.type) && (
            <div className="space-y-2 pt-1">
              <div className="flex flex-col gap-1.5 items-start">
                {(field.options || ["Option 1", "Option 2"]).map((opt, optIdx) => {
                  const palette = CHOICE_COLOR_PALETTES[optIdx % CHOICE_COLOR_PALETTES.length];
                  return (
                    <div
                      key={optIdx}
                      className={`group/opt inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${palette.bg} ${palette.text} ${palette.border}`}
                    >
                      <Check className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...(field.options || [])];
                          updated[optIdx] = e.target.value;
                          onUpdate(field.id, { options: updated });
                        }}
                        className="bg-transparent border-none text-xs font-medium focus:outline-none min-w-[100px] text-inherit"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (field.options || []).filter((_, i) => i !== optIdx);
                          onUpdate(field.id, { options: updated });
                        }}
                        className="opacity-0 group-hover/opt:opacity-100 hover:text-destructive transition-opacity ml-1 cursor-pointer"
                        title="Remove option"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add Option Trigger */}
              <button
                type="button"
                onClick={() => {
                  const current = field.options || [];
                  onUpdate(field.id, {
                    options: [...current, `Option ${current.length + 1}`],
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-muted-foreground hover:text-foreground font-medium rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add option</span>
              </button>
            </div>
          )}

          {/* Checkbox (Agreement / Opt-in) */}
          {field.type === "checkbox" && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border/50 bg-secondary/30">
              <div
                className="w-4 h-4 rounded-md border flex items-center justify-center text-primary-foreground shadow-xs shrink-0"
                style={{ borderColor: primaryColor, backgroundColor: primaryColor }}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs text-muted-foreground select-none">
                Respondent checks this box to accept or agree
              </span>
            </div>
          )}

          {/* Rating */}
          {field.type === "rating" && (
            <div className="flex items-center gap-2 p-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: field.validation?.max || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-yellow-400/90 hover:scale-110 transition-transform cursor-pointer drop-shadow-xs"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-medium">
                (1 to {field.validation?.max || 5})
              </span>
            </div>
          )}

          {/* Date Picker Preview */}
          {field.type === "date" && (
            <div
              className="flex items-center gap-3 px-3.5 h-10 border text-xs text-muted-foreground bg-background/40"
              style={{
                borderRadius,
                borderColor: inputBorderColor,
                backgroundColor: inputBgColor,
              }}
            >
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>Select date (YYYY-MM-DD)</span>
            </div>
          )}

          {/* Time Picker Preview */}
          {field.type === "time" && (
            <div
              className="flex items-center gap-3 px-3.5 h-10 border text-xs text-muted-foreground bg-background/40"
              style={{
                borderRadius,
                borderColor: inputBorderColor,
                backgroundColor: inputBgColor,
              }}
            >
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>Select time (HH:MM AM/PM)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
