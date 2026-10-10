"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField, FieldType } from "@sec-form/validators";
import { ThemeConfig } from "@sec-form/shared";
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
} from "lucide-react";
import { MorphSelect, MorphSelectItem } from "@/components/arc/morph-select/morph-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const FIELD_TYPE_ITEMS: MorphSelectItem[] = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "select", label: "Single Select" },
  { value: "multiselect", label: "Multi Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "rating", label: "Rating" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "step_break", label: "Page Break" },
];

interface WYSIWYGFieldItemProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (field: FormField) => void;
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
  activeTheme,
}: WYSIWYGFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const borderRadius = activeTheme?.borderRadius || "14px";
  const primaryColor = activeTheme?.primaryColor || "var(--primary)";
  const inputBgColor = activeTheme?.inputBgColor || "transparent";
  const inputBorderColor = activeTheme?.inputBorderColor || "rgba(128,128,128,0.25)";

  // Page break rendering
  if (field.type === "step_break") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        onClick={onSelect}
        className={`group relative p-5 my-6 rounded-2xl border-2 border-dashed transition-all duration-200 ${
          isSelected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border/70 hover:border-primary/50 bg-secondary/30 backdrop-blur-sm"
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
      className={`group relative p-6 sm:p-7 rounded-[22px] transition-all duration-200 border ${
        isSelected
          ? "border-primary/70 ring-2 ring-primary/25 bg-card/90 shadow-xl backdrop-blur-xl"
          : "border-border/70 hover:border-border bg-card/60 hover:bg-card/85 shadow-sm hover:shadow-md backdrop-blur-lg"
      }`}
    >
      {/* Top Header Row: Drag Handle & Field Type Selector on Left, Action Toolbar on Right */}
      <div
        className={`flex items-center justify-between gap-3 pb-4 mb-4 border-b border-border/50 transition-opacity duration-150 ${
          isSelected ? "opacity-100" : "opacity-70 group-hover:opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Drag Handle & Type Switcher */}
        <div className="flex items-center gap-2.5">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-muted-foreground/60 hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/60"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex items-center">
            <MorphSelect
              label="Field Type"
              hideLabel
              items={FIELD_TYPE_ITEMS}
              value={field.type}
              onValueChange={(val) => onUpdate(field.id, { type: val as FieldType })}
              panelWidth={230}
            />
          </div>
        </div>

        {/* Right Side: Required Switch, Duplicate, Settings, Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Required Switch Button */}
          <button
            type="button"
            onClick={() => onUpdate(field.id, { required: !field.required })}
            className={`h-8 px-2.5 flex items-center gap-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              field.required
                ? "bg-destructive/15 text-destructive border-destructive/30"
                : "border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
            title={field.required ? "Required field" : "Optional field"}
          >
            <Asterisk className="w-3.5 h-3.5" />
            <span>Required</span>
          </button>

          {/* Duplicate Button */}
          {onDuplicate && (
            <button
              type="button"
              onClick={() => onDuplicate(field)}
              className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors cursor-pointer"
              title="Duplicate question"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Settings Popover */}
          <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors cursor-pointer"
                title="Validation settings"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 space-y-3.5 rounded-2xl shadow-xl backdrop-blur-xl bg-card/95 border border-border" align="end">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Question Settings</h4>
                <span className="text-[11px] font-mono text-muted-foreground uppercase">{field.type}</span>
              </div>
              
              {["number", "rating"].includes(field.type) && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-bold">Minimum</label>
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
                    <label className="text-[10px] text-muted-foreground uppercase font-bold">Maximum</label>
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

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(field.id)}
            className="h-8 w-8 flex items-center justify-center text-destructive hover:bg-destructive/15 rounded-xl transition-colors cursor-pointer"
            title="Delete question"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Field Content Body */}
      <div className="space-y-3">
        {/* In-place Editable Label (Upper-case subtitle or clean title) */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Question label (e.g., Full Name)..."
              className="w-full text-base sm:text-lg font-bold text-foreground bg-transparent border-b border-transparent hover:border-border/60 focus:border-primary focus:outline-none transition-colors pb-0.5 tracking-tight"
            />
            {field.required && (
              <span className="text-destructive font-bold text-base shrink-0 select-none">*</span>
            )}
          </div>

          {/* In-place Editable Description */}
          <input
            type="text"
            value={field.description || ""}
            onChange={(e) => onUpdate(field.id, { description: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            placeholder="Add description or instructions (optional)..."
            className="w-full text-xs text-muted-foreground/80 bg-transparent border-b border-transparent hover:border-border/50 focus:border-primary/60 focus:outline-none transition-colors"
          />
        </div>

        {/* Live Input Field Styled Exactly Like Published Form */}
        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
          {/* Short text, Email, Phone, Number */}
          {["text", "email", "phone", "number"].includes(field.type) && (
            <div className="relative">
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                placeholder="Click here to edit placeholder text..."
                className="w-full h-12 px-4 text-sm text-foreground bg-background/50 hover:bg-background/70 focus:bg-background/90 border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 shadow-xs"
                style={{
                  borderRadius,
                  borderColor: inputBorderColor,
                  backgroundColor: inputBgColor,
                }}
              />
              <span className="absolute right-4 top-3.5 text-[10px] text-muted-foreground/50 pointer-events-none select-none uppercase font-mono tracking-wider">
                {field.type}
              </span>
            </div>
          )}

          {/* Long Text / Textarea */}
          {field.type === "textarea" && (
            <div className="relative">
              <textarea
                rows={3}
                value={field.placeholder || ""}
                onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                placeholder="Click to edit long text placeholder..."
                className="w-full p-4 text-sm text-foreground bg-background/50 hover:bg-background/70 focus:bg-background/90 border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 shadow-xs resize-none"
                style={{
                  borderRadius,
                  borderColor: inputBorderColor,
                  backgroundColor: inputBgColor,
                }}
              />
              <span className="absolute right-4 bottom-3 text-[10px] text-muted-foreground/50 pointer-events-none select-none uppercase font-mono tracking-wider">
                long text
              </span>
            </div>
          )}

          {/* Choices: Single Select & Multi Select */}
          {["select", "multiselect"].includes(field.type) && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2.5 items-center">
                {(field.options || []).map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex items-center gap-2 px-3.5 py-2 bg-secondary/80 border border-border/80 text-xs rounded-xl shadow-xs transition-all hover:border-primary/40"
                    style={{ borderRadius }}
                  >
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...(field.options || [])];
                        updated[optIdx] = e.target.value;
                        onUpdate(field.id, { options: updated });
                      }}
                      className="bg-transparent border-none text-xs font-medium text-foreground focus:outline-none min-w-[70px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (field.options || []).filter((_, i) => i !== optIdx);
                        onUpdate(field.id, { options: updated });
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const current = field.options || [];
                    onUpdate(field.id, {
                      options: [...current, `Option ${current.length + 1}`],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs text-primary font-semibold hover:bg-primary/10 border border-dashed border-primary/40 rounded-xl transition-all cursor-pointer"
                  style={{ borderRadius }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Option</span>
                </button>
              </div>
            </div>
          )}

          {/* Checkbox */}
          {field.type === "checkbox" && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-secondary/40">
              <div
                className="w-5 h-5 rounded-lg border flex items-center justify-center text-primary-foreground transition-colors cursor-pointer shadow-xs"
                style={{ borderColor: primaryColor, backgroundColor: primaryColor }}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Respondent checks this box to accept or agree
              </span>
            </div>
          )}

          {/* Rating */}
          {field.type === "rating" && (
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border/60 bg-secondary/30">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: field.validation?.max || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-7 h-7 text-yellow-400 fill-yellow-400/90 cursor-pointer hover:scale-110 transition-transform drop-shadow-sm"
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-3 font-medium">
                (Scale: 1 to {field.validation?.max || 5})
              </span>
            </div>
          )}

          {/* Date Picker Preview */}
          {field.type === "date" && (
            <div
              className="flex items-center gap-3 px-4 h-12 border text-xs text-muted-foreground bg-background/50"
              style={{
                borderRadius,
                borderColor: inputBorderColor,
                backgroundColor: inputBgColor,
              }}
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span>Select date (YYYY-MM-DD)</span>
            </div>
          )}

          {/* Time Picker Preview */}
          {field.type === "time" && (
            <div
              className="flex items-center gap-3 px-4 h-12 border text-xs text-muted-foreground bg-background/50"
              style={{
                borderRadius,
                borderColor: inputBorderColor,
                backgroundColor: inputBgColor,
              }}
            >
              <Clock className="w-4 h-4 text-primary" />
              <span>Select time (HH:MM AM/PM)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
