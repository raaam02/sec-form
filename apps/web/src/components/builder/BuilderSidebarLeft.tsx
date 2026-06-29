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
  ChevronRight
} from "lucide-react";
import { FormField } from "@sec-form/validators";
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

  const [localExpanded, setLocalExpanded] = React.useState(false);
  const activeExpanded = isExpanded !== undefined ? isExpanded : localExpanded;
  const activeSetExpanded = setIsExpanded !== undefined ? setIsExpanded : setLocalExpanded;

  const FIELD_TYPES = [
    { type: "text", label: t("sidebarFieldText"), icon: Type, iconColor: "text-indigo-500", colSpan2: false, shortcut: "t" },
    { type: "textarea", label: t("sidebarFieldTextarea"), icon: AlignLeft, iconColor: "text-blue-500", colSpan2: false, shortcut: "a" },
    { type: "email", label: t("sidebarFieldEmail"), icon: Mail, iconColor: "text-emerald-500", colSpan2: false, shortcut: "e" },
    { type: "phone", label: "Phone Number", icon: Phone, iconColor: "text-rose-500", colSpan2: false, shortcut: "p" },
    { type: "number", label: t("sidebarFieldNumber"), icon: Hash, iconColor: "text-amber-500", colSpan2: false, shortcut: "n" },
    { type: "select", label: t("sidebarFieldSelect"), icon: List, iconColor: "text-orange-500", colSpan2: false, shortcut: "s" },
    { type: "multiselect", label: "Multi Select", icon: CheckSquare, iconColor: "text-teal-500", colSpan2: false, shortcut: "m" },
    { type: "checkbox", label: t("sidebarFieldCheckbox"), icon: CheckSquare, iconColor: "text-purple-500", colSpan2: false, shortcut: "c" },
    { type: "rating", label: "Rating", icon: Star, iconColor: "text-yellow-500", colSpan2: false, shortcut: "r" },
    { type: "date", label: "Date", icon: Calendar, iconColor: "text-pink-500", colSpan2: false, shortcut: "d" },
    { type: "time", label: "Time", icon: Clock, iconColor: "text-rose-500", colSpan2: false, shortcut: "i" },
    { type: "step_break", label: "Page Break", icon: AlignLeft, iconColor: "text-slate-500", colSpan2: true, shortcut: "b" }
  ] as const;

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
    <aside className={`@container relative w-full h-full bg-transparent overflow-hidden flex flex-col transition-all duration-300 ${activeExpanded ? "w-64 z-30 absolute inset-y-0 left-0 md:relative md:w-full" : "w-14 md:w-full"}`}>
      {/* Collapse Toggle Button (both Desktop and Mobile) */}
      <div className={`flex p-3 border-b border-border items-center shrink-0 h-[52px] ${activeExpanded ? "justify-between px-4" : "justify-center px-2"}`}>
        <h3 className={`font-outfit font-extrabold text-foreground text-sm transition-opacity duration-200 truncate ${activeExpanded ? "opacity-100 block" : "opacity-0 hidden"}`}>{t("sidebarAddFields")}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => activeSetExpanded(!activeExpanded)}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
        >
          {activeExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pt-3 md:pt-4 space-y-6">
        {/* Field adder */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 @[260px]:grid-cols-2 gap-2 text-[11px] font-bold text-muted-foreground">
            {FIELD_TYPES.map((field) => {
              const Icon = field.icon;
              return (
                <Tooltip key={field.type} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <motion.button
                      type="button"
                      // whileHover={{ scale: 1.03, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                      whileTap={{ scale: 0.97, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                      onClick={() => handleAddField(field.type)}
                      className={`flex items-center justify-start gap-2 p-2.5 rounded-xl border border-border bg-card/50 hover:bg-accent/70 hover:text-accent-foreground transition-colors min-w-0 w-full ${
                        field.colSpan2 ? "col-span-full" : ""
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${field.iconColor} shrink-0`} />
                      <span className="flex-1 justify-between items-center min-w-0 hidden @[120px]:flex text-left">
                        <span className="truncate mr-2">{field.label}</span>
                        <kbd className="pointer-events-none select-none rounded border px-1.5 font-mono text-[11px] font-medium text-muted-foreground uppercase shrink-0">
                          {field.shortcut}
                        </kbd>
                      </span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={14}>
                    Add {field.label} [{field.shortcut.toUpperCase()}]
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
