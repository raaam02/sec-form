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

  const [isEditingPlaceholder, setIsEditingPlaceholder] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const borderRadius = activeTheme?.borderRadius || "0.75rem";
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
        className={`group relative p-4 my-4 rounded-2xl border-2 border-dashed transition-all ${
          isSelected
            ? "border-primary bg-primary/5"
            : "border-border/70 hover:border-primary/50 bg-muted/20"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab opacity-40 hover:opacity-100 transition-opacity p-1"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
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
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              title="Delete page break"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground ml-7 mt-1">
          Questions below this line will appear on the next step or page for respondents.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative p-5 rounded-2xl transition-all border ${
        isSelected
          ? "border-primary/80 ring-2 ring-primary/20 bg-card shadow-md"
          : "border-border/60 hover:border-border hover:shadow-sm bg-card/40 hover:bg-card/70"
      }`}
    >
      {/* Floating Toolbar on Hover / Focus */}
      <div
        className={`absolute -top-3.5 right-4 z-20 flex items-center gap-1 bg-background/95 border border-border/80 shadow-sm rounded-xl px-1.5 py-0.5 backdrop-blur-md transition-opacity duration-150 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Morphing Field Type Switcher */}
        <div className="scale-90 origin-left">
          <MorphSelect
            label="Type"
            hideLabel
            items={FIELD_TYPE_ITEMS}
            value={field.type}
            onValueChange={(val) => onUpdate(field.id, { type: val as FieldType })}
            panelWidth={220}
          />
        </div>

        {/* Required Toggle */}
        <button
          type="button"
          onClick={() => onUpdate(field.id, { required: !field.required })}
          className={`h-7 px-2 flex items-center gap-1 text-[11px] font-medium rounded-lg transition-colors ${
            field.required
              ? "bg-destructive/15 text-destructive font-semibold"
              : "text-muted-foreground hover:bg-muted"
          }`}
          title={field.required ? "Required field" : "Optional field"}
        >
          <Asterisk className="w-3 h-3" />
          <span className="hidden sm:inline">Req</span>
        </button>

        {/* Duplicate Button */}
        {onDuplicate && (
          <button
            type="button"
            onClick={() => onDuplicate(field)}
            className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Duplicate field"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Settings Popover */}
        <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Field validation settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 space-y-3" align="end">
            <h4 className="font-semibold text-xs text-foreground">Field Settings</h4>
            
            {["number", "rating"].includes(field.type) && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">Min</label>
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
                    className="h-7 text-xs mt-1"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">Max</label>
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
                    className="h-7 text-xs mt-1"
                    placeholder="100"
                  />
                </div>
              </div>
            )}

            {["text", "textarea", "phone"].includes(field.type) && (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">
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
                    className="h-7 text-xs mt-1"
                    placeholder="^[A-Z0-9]+$"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Error Message
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
                    className="h-7 text-xs mt-1"
                    placeholder="Please match requested format"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-foreground font-medium">Required</span>
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
          className="h-7 w-7 flex items-center justify-center text-destructive hover:bg-destructive/15 rounded-lg transition-colors"
          title="Delete field"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab opacity-30 group-hover:opacity-100 hover:text-foreground transition-opacity p-0.5 rounded outline-none shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Field Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* In-place Editable Label */}
          <div className="flex items-baseline gap-1.5">
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Question title..."
              className="w-full text-base font-semibold text-foreground bg-transparent border-b border-transparent hover:border-border/60 focus:border-primary focus:outline-none transition-colors pb-0.5"
            />
            {field.required && (
              <span className="text-destructive font-bold text-sm shrink-0 select-none">*</span>
            )}
          </div>

          {/* In-place Editable Description / Help Text */}
          <input
            type="text"
            value={field.description || ""}
            onChange={(e) => onUpdate(field.id, { description: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            placeholder="Add description or instructions (optional)..."
            className="w-full text-xs text-muted-foreground bg-transparent border-b border-transparent hover:border-border/50 focus:border-primary/70 focus:outline-none transition-colors"
          />

          {/* Real Input / Interactive Preview Styled According to Active Theme */}
          <div className="pt-2" onClick={(e) => e.stopPropagation()}>
            {/* Short text, Email, Phone, Number */}
            {["text", "email", "phone", "number"].includes(field.type) && (
              <div className="relative">
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                  placeholder="Click here to edit placeholder text..."
                  className="w-full h-10 px-3.5 text-xs text-foreground bg-transparent border transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/60"
                  style={{
                    borderRadius,
                    borderColor: inputBorderColor,
                    backgroundColor: inputBgColor,
                  }}
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-muted-foreground/40 pointer-events-none select-none uppercase font-mono">
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
                  className="w-full p-3 text-xs text-foreground bg-transparent border transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/60 resize-none"
                  style={{
                    borderRadius,
                    borderColor: inputBorderColor,
                    backgroundColor: inputBgColor,
                  }}
                />
                <span className="absolute right-3 bottom-2.5 text-[10px] text-muted-foreground/40 pointer-events-none select-none uppercase font-mono">
                  long text
                </span>
              </div>
            )}

            {/* Single Select & Multi Select Options */}
            {["select", "multiselect"].includes(field.type) && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  {(field.options || []).map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 border border-border/80 text-xs rounded-lg group/opt transition-all"
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
                        className="bg-transparent border-none text-xs text-foreground focus:outline-none min-w-[60px]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (field.options || []).filter((_, i) => i !== optIdx);
                          onUpdate(field.id, { options: updated });
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-primary font-medium hover:bg-primary/10 border border-dashed border-primary/40 rounded-lg transition-colors cursor-pointer"
                    style={{ borderRadius }}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Option</span>
                  </button>
                </div>
              </div>
            )}

            {/* Checkbox */}
            {field.type === "checkbox" && (
              <div className="flex items-center gap-2.5 py-1">
                <div
                  className="w-4 h-4 rounded border flex items-center justify-center text-primary-foreground transition-colors cursor-pointer"
                  style={{ borderColor: primaryColor, backgroundColor: primaryColor }}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs text-muted-foreground">
                  User will check this box to confirm or agree
                </span>
              </div>
            )}

            {/* Rating */}
            {field.type === "rating" && (
              <div className="flex items-center gap-1.5 py-1">
                {Array.from({ length: field.validation?.max || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-yellow-400/80 cursor-pointer hover:scale-110 transition-transform"
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-3">
                  (Rating scale: 1 to {field.validation?.max || 5})
                </span>
              </div>
            )}

            {/* Date */}
            {field.type === "date" && (
              <div
                className="flex items-center gap-2 px-3.5 h-10 border text-xs text-muted-foreground"
                style={{
                  borderRadius,
                  borderColor: inputBorderColor,
                  backgroundColor: inputBgColor,
                }}
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Select a date (YYYY-MM-DD)</span>
              </div>
            )}

            {/* Time */}
            {field.type === "time" && (
              <div
                className="flex items-center gap-2 px-3.5 h-10 border text-xs text-muted-foreground"
                style={{
                  borderRadius,
                  borderColor: inputBorderColor,
                  backgroundColor: inputBgColor,
                }}
              >
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Select a time (HH:MM AM/PM)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
