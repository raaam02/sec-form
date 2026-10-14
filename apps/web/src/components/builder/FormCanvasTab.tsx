"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormField, FieldType, createDefaultField } from "@sec-form/validators";
import { ThemeConfig, resolveThemeValues } from "@sec-form/shared";
import { useTheme } from "@/components/ThemeProvider";
import { Plus, Sparkles, Send, GripVertical } from "lucide-react";
import { WYSIWYGFieldItem } from "./canvas/WYSIWYGFieldItem";
import { SlashCommandMenu } from "./canvas/SlashCommandMenu";
import { useTranslations } from "next-intl";

interface FormCanvasTabProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  fields: FormField[];
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleDeleteField: (id: string) => void;
  saveForm: (fields: FormField[]) => void;
  handleReorder: (index: number, direction: "up" | "down") => void;
  handleDragReorder?: (oldIndex: number, newIndex: number) => void;
  handleAddField?: (type: FieldType, atIndex?: number) => void;
  activeTheme?: ThemeConfig | null;
}

export function FormCanvasTab({
  title,
  setTitle,
  description,
  setDescription,
  fields,
  selectedFieldId,
  setSelectedFieldId,
  handleUpdateField,
  handleDeleteField,
  saveForm,
  handleReorder,
  handleDragReorder,
  handleAddField,
  activeTheme,
}: FormCanvasTabProps) {
  const t = useTranslations("Builder");
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | undefined>(undefined);
  const [slashQuery, setSlashQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Global '/' listener when not actively typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !slashMenuOpen) {
        const activeEl = document.activeElement;
        const isTyping =
          activeEl instanceof HTMLInputElement ||
          activeEl instanceof HTMLTextAreaElement ||
          activeEl?.getAttribute("contenteditable") === "true";

        if (!isTyping) {
          e.preventDefault();
          setInsertIndex(fields.length);
          setSlashQuery("");
          setSlashMenuOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slashMenuOpen, fields.length]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (handleDragReorder) {
        handleDragReorder(oldIndex, newIndex);
      } else {
        if (oldIndex < newIndex) {
          for (let i = oldIndex; i < newIndex; i++) handleReorder(i, "down");
        } else {
          for (let i = oldIndex; i > newIndex; i--) handleReorder(i, "up");
        }
      }
    }
  }

  const handleInsertField = (type: FieldType) => {
    if (handleAddField) {
      handleAddField(type, insertIndex);
    } else {
      const newField = createDefaultField(type);
      const updated = [...fields];
      if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= fields.length) {
        updated.splice(insertIndex, 0, newField);
      } else {
        updated.push(newField);
      }
      saveForm(updated);
    }
  };

  const handleDuplicateField = (fieldToDuplicate: FormField) => {
    const newField: FormField = {
      ...fieldToDuplicate,
      id: crypto.randomUUID(),
      label: `${fieldToDuplicate.label} (Copy)`,
    };
    const currentIdx = fields.findIndex((f) => f.id === fieldToDuplicate.id);
    const updated = [...fields];
    if (currentIdx !== -1) {
      updated.splice(currentIdx + 1, 0, newField);
    } else {
      updated.push(newField);
    }
    saveForm(updated);
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const effectiveTheme = resolveThemeValues(activeTheme, isDark);

  const primaryColor = effectiveTheme.primaryColor || "var(--primary)";
  const borderRadius = effectiveTheme.borderRadius || "24px";
  const cardColor = effectiveTheme.cardColor || undefined;
  const textColor = effectiveTheme.textColor || undefined;

  const renderInlineInsertionRow = (targetIndex: number) => {
    if (!slashMenuOpen || insertIndex !== targetIndex) return null;

    return (
      <div className="relative py-2 px-3 -mx-3 rounded-2xl bg-muted/30 border border-primary/20 my-2 animate-in fade-in zoom-in-95 duration-150 z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-muted-foreground/60 select-none">
            <GripVertical className="w-3.5 h-3.5" />
            <span className="font-mono text-sm font-bold text-primary">/</span>
          </div>
          <input
            type="text"
            value={slashQuery}
            onChange={(e) => setSlashQuery(e.target.value)}
            placeholder="Type a question type or command..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape" || (e.key === "Backspace" && slashQuery === "")) {
                e.preventDefault();
                setSlashMenuOpen(false);
                setInsertIndex(undefined);
                setSlashQuery("");
              }
            }}
            className="flex-1 text-xs sm:text-sm font-medium bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground/40 leading-snug"
          />
        </div>

        {/* Anchored Floating Popover */}
        <div className="absolute left-6 top-full mt-2 z-50">
          <SlashCommandMenu
            isOpen={slashMenuOpen && insertIndex === targetIndex}
            query={slashQuery}
            onClose={() => {
              setSlashMenuOpen(false);
              setInsertIndex(undefined);
              setSlashQuery("");
            }}
            onSelect={(type) => {
              handleInsertField(type);
              setSlashMenuOpen(false);
              setInsertIndex(undefined);
              setSlashQuery("");
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Live Form Canvas Paper with authentic document feel */}
      <div
        className="rounded-[24px] border border-border/70 shadow-xl p-8 sm:p-12 transition-all duration-200 bg-card/90 backdrop-blur-xl relative"
        style={{
          backgroundColor: cardColor,
          color: textColor,
          borderRadius,
        }}
      >
        {/* Form Header (In-Place Title & Description) */}
        <div className="space-y-2 pb-6 border-b border-border/50">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              saveForm(fields);
            }}
            placeholder={t("canvasTitlePlaceholder") || "Untitled Form"}
            className="w-full text-2xl sm:text-3xl md:text-4xl font-extrabold font-outfit tracking-tight bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/30 pb-1 transition-colors"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              saveForm(fields);
            }}
            placeholder={
              t("canvasDescPlaceholder") ||
              "Write a short description, instructions or greeting..."
            }
            className="w-full text-sm text-muted-foreground bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/40 transition-colors"
          />
        </div>

        {/* Form Fields Canvas */}
        <div className="pt-4 space-y-4">
          {fields.length === 0 ? (
            <div className="py-16 border-2 border-dashed border-border/70 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-4 bg-muted/10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  Your form is empty
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Add questions using the left sidebar, click the button below, or press{" "}
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded">
                    /
                  </kbd>{" "}
                  anywhere.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInsertIndex(0);
                  setSlashQuery("");
                  setSlashMenuOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl shadow-lg hover:opacity-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Question</span>
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    {renderInlineInsertionRow(index)}

                    {/* Subtle Between-field Insert Trigger */}
                    <div className="group/inserter relative h-2 -my-1 flex items-center justify-center z-10">
                      <div className="absolute inset-x-0 h-[1px] bg-primary/30 opacity-0 group-hover/inserter:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => {
                          setInsertIndex(index);
                          setSlashQuery("");
                          setSlashMenuOpen(true);
                        }}
                        className="relative z-10 opacity-0 group-hover/inserter:opacity-100 transition-opacity flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground bg-primary rounded-full shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                        title="Insert question here (or press '/')"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Insert</span>
                      </button>
                    </div>

                    {/* Live In-place WYSIWYG Field */}
                    <WYSIWYGFieldItem
                      field={field}
                      index={index}
                      isSelected={selectedFieldId === field.id}
                      onSelect={() => setSelectedFieldId(field.id)}
                      onUpdate={handleUpdateField}
                      onDelete={handleDeleteField}
                      onDuplicate={handleDuplicateField}
                      onInsertAfter={(type) => {
                        setInsertIndex(index + 1);
                        handleInsertField(type);
                      }}
                      onEnter={() => {
                        setInsertIndex(index + 1);
                        setSlashQuery("");
                        setSlashMenuOpen(true);
                      }}
                      activeTheme={activeTheme}
                    />
                  </React.Fragment>
                ))}
              </SortableContext>
            </DndContext>
          )}

          {renderInlineInsertionRow(fields.length)}

          {/* Bottom Quick-Add & Submit Preview */}
          <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setInsertIndex(fields.length);
                setSlashQuery("");
                setSlashMenuOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/80 border border-border/80 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Question</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded text-muted-foreground">
                /
              </kbd>
            </button>

            {/* Live Submit Button Preview */}
            <div className="w-full sm:w-auto">
              <button
                type="button"
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold shadow-md transition-all opacity-95 cursor-default"
                style={{
                  backgroundColor: effectiveTheme.buttonBgColor,
                  color: effectiveTheme.buttonTextColor,
                  borderRadius,
                }}
              >
                <span>Submit Form</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
