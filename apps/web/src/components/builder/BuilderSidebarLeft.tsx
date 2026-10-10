"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  List,
  CheckSquare,
  Star,
  Calendar,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  SplitSquareVertical,
} from "lucide-react";
import { FormField, FieldType } from "@sec-form/validators";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface BuilderSidebarLeftProps {
  focusedField: FormField | null;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleAddField: (type: FormField["type"]) => void;
  isExpanded?: boolean;
  setIsExpanded?: (open: boolean) => void;
}

export function BuilderSidebarLeft({
  focusedField,
  handleUpdateField,
  handleAddField,
  isExpanded,
  setIsExpanded,
}: BuilderSidebarLeftProps) {
  const t = useTranslations("Builder");

  // Open / expanded by default
  const [localExpanded, setLocalExpanded] = React.useState(true);
  const activeExpanded = isExpanded !== undefined ? isExpanded : localExpanded;
  const activeSetExpanded = setIsExpanded !== undefined ? setIsExpanded : setLocalExpanded;

  const FIELD_SECTIONS = [
    {
      title: "Inputs",
      fields: [
        { type: "text" as FieldType, label: t("sidebarFieldText") || "Short Text", icon: Type, iconColor: "text-indigo-500", shortcut: "t" },
        { type: "textarea" as FieldType, label: t("sidebarFieldTextarea") || "Long Text", icon: AlignLeft, iconColor: "text-blue-500", shortcut: "a" },
        { type: "email" as FieldType, label: t("sidebarFieldEmail") || "Email", icon: Mail, iconColor: "text-emerald-500", shortcut: "e" },
        { type: "phone" as FieldType, label: "Phone", icon: Phone, iconColor: "text-rose-500", shortcut: "p" },
        { type: "number" as FieldType, label: t("sidebarFieldNumber") || "Number", icon: Hash, iconColor: "text-amber-500", shortcut: "n" },
      ],
    },
    {
      title: "Choices",
      fields: [
        { type: "select" as FieldType, label: t("sidebarFieldSelect") || "Dropdown", icon: List, iconColor: "text-orange-500", shortcut: "s" },
        { type: "multiselect" as FieldType, label: "Multi Select", icon: CheckSquare, iconColor: "text-teal-500", shortcut: "m" },
        { type: "checkbox" as FieldType, label: t("sidebarFieldCheckbox") || "Checkbox", icon: CheckSquare, iconColor: "text-purple-500", shortcut: "c" },
      ],
    },
    {
      title: "Advanced",
      fields: [
        { type: "rating" as FieldType, label: "Rating", icon: Star, iconColor: "text-yellow-500", shortcut: "r" },
        { type: "date" as FieldType, label: "Date", icon: Calendar, iconColor: "text-pink-500", shortcut: "d" },
        { type: "time" as FieldType, label: "Time", icon: Clock, iconColor: "text-rose-500", shortcut: "i" },
        { type: "step_break" as FieldType, label: "Page Break", icon: SplitSquareVertical, iconColor: "text-slate-500", shortcut: "b" },
      ],
    },
  ];

  // Register shortcuts
  useGlobalShortcut("add-field-text", "t", "Add Text Field", () => handleAddField("text"), "Builder Fields");
  useGlobalShortcut("add-field-textarea", "a", "Add Textarea Field", () => handleAddField("textarea"), "Builder Fields");
  useGlobalShortcut("add-field-email", "e", "Add Email Field", () => handleAddField("email"), "Builder Fields");
  useGlobalShortcut("add-field-phone", "p", "Add Phone Field", () => handleAddField("phone"), "Builder Fields");
  useGlobalShortcut("add-field-number", "n", "Add Number Field", () => handleAddField("number"), "Builder Fields");
  useGlobalShortcut("add-field-select", "s", "Add Select Field", () => handleAddField("select"), "Builder Fields");
  useGlobalShortcut("add-field-multiselect", "m", "Add Multi Select Field", () => handleAddField("multiselect"), "Builder Fields");
  useGlobalShortcut("add-field-checkbox", "c", "Add Checkbox Field", () => handleAddField("checkbox"), "Builder Fields");
  useGlobalShortcut("add-field-rating", "r", "Add Rating Field", () => handleAddField("rating"), "Builder Fields");
  useGlobalShortcut("add-field-date", "d", "Add Date Field", () => handleAddField("date"), "Builder Fields");
  useGlobalShortcut("add-field-time", "i", "Add Time Field", () => handleAddField("time"), "Builder Fields");
  useGlobalShortcut("add-field-stepbreak", "b", "Add Step Break", () => handleAddField("step_break"), "Builder Fields");

  return (
    <aside
      className={`@container relative h-full bg-sidebar/50 backdrop-blur-sm border-r border-border overflow-hidden flex flex-col transition-all duration-300 ${
        activeExpanded
          ? "w-64 z-30 shrink-0"
          : "w-14 z-30 shrink-0"
      }`}
    >
      {/* Header with Collapse / Expand Toggle */}
      <div
        className={`flex p-3 border-b border-border items-center shrink-0 h-[52px] ${
          activeExpanded ? "justify-between px-4" : "justify-center px-2"
        }`}
      >
        {activeExpanded && (
          <div className="flex items-center gap-2">
            <h3 className="font-outfit font-bold text-foreground text-sm truncate">
              {t("sidebarAddFields") || "Add Fields"}
            </h3>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => activeSetExpanded(!activeExpanded)}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
          title={activeExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {activeExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-5">
        {FIELD_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {activeExpanded && (
              <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider px-1">
                {section.title}
              </span>
            )}
            <div
              className={
                activeExpanded
                  ? "flex flex-col gap-1.5"
                  : "flex flex-col items-center gap-2"
              }
            >
              {section.fields.map((field) => {
                const Icon = field.icon;
                return (
                  <Tooltip key={field.type} delayDuration={150}>
                    <TooltipTrigger asChild>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAddField(field.type)}
                        className={
                          activeExpanded
                            ? "flex items-center justify-between px-3 py-2 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 hover:shadow-sm text-foreground transition-all w-full text-left cursor-pointer group"
                            : "flex items-center justify-center h-9 w-9 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/40 text-foreground transition-all shrink-0 cursor-pointer"
                        }
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`h-4 w-4 ${field.iconColor} shrink-0`} />
                          {activeExpanded && (
                            <span className="text-xs font-medium truncate text-foreground/90 group-hover:text-foreground">
                              {field.label}
                            </span>
                          )}
                        </div>
                        {activeExpanded && (
                          <kbd className="pointer-events-none select-none rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground uppercase shrink-0">
                            {field.shortcut}
                          </kbd>
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12}>
                      Add {field.label} [{field.shortcut.toUpperCase()}]
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
