import React from "react";
import { 
  Plus, 
  Palette, 
  Type, 
  AlignLeft, 
  Mail, 
  Hash, 
  List, 
  CheckSquare, 
  Star, 
  Calendar,
  Clock,
  Phone
} from "lucide-react";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { TabBar } from "../TabBar";
import { ThemePresetCard } from "./ThemePresetCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import { useTranslations } from "next-intl";

interface BuilderSidebarLeftProps {
  leftTab: "builder" | "themes";
  setLeftTab: (tab: "builder" | "themes") => void;
  focusedField: FormField | null;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleAddField: (type: FormField["type"]) => void;
  activeTheme: ThemeConfig | null;
  setActiveTheme: (theme: ThemeConfig) => void;
  saveForm: (fields: FormField[], theme?: ThemeConfig | null) => void;
  pushToHistory?: (fields: FormField[], theme: ThemeConfig | null) => void;
  fields: FormField[];
}

export function BuilderSidebarLeft({
  leftTab,
  setLeftTab,
  focusedField,
  handleUpdateField,
  handleAddField,
  activeTheme,
  setActiveTheme,
  saveForm,
  pushToHistory,
  fields,
}: BuilderSidebarLeftProps) {
  const t = useTranslations("Builder");

  const LEFT_TABS = [
    { value: "builder", label: t("tabBuild"), icon: Plus, iconColorClass: "text-indigo-500", shortcut: "ctrl+1" },
    { value: "themes", label: t("tabTheme"), icon: Palette, iconColorClass: "text-purple-500", shortcut: "ctrl+2" }
  ] as const;

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
    { type: "step_break", label: "Step Break", icon: AlignLeft, iconColor: "text-slate-500", colSpan2: true, shortcut: "b" }
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
    <aside className="w-full h-full border-r border-border bg-card overflow-hidden flex flex-col">
      {/* Tabs header */}
      <TabBar
        items={LEFT_TABS}
        selectedValue={leftTab}
        onChange={setLeftTab}
        fullWidth
      />

      {/* Scrollable Container Content */}
      <div className="@container flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {leftTab === "builder" && (
          <>
            {/* Field adder */}
            <div className="space-y-3">
              <h3 className="font-outfit font-extrabold text-foreground text-sm">{t("sidebarAddFields")}</h3>
              <div className="grid grid-cols-1 @[180px]:grid-cols-2 gap-2 text-[11px] font-bold text-muted-foreground">
                {FIELD_TYPES.map((field) => {
                  const Icon = field.icon;
                  return (
                    <Tooltip key={field.type} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleAddField(field.type)}
                          className={`flex items-center gap-2 p-2 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors ${
                            field.colSpan2 ? "col-span-2 justify-center" : ""
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${field.iconColor} shrink-0`} />
                          <span>{field.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={14}>
                        Add {field.label} [{field.shortcut.toUpperCase()}]
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Properties editor removed, moved to canvas */}
          </>
        )}

        {leftTab === "themes" && (
          <>
            {/* Built-in Preset Themes */}
            <div className="space-y-4">
              <h3 className="font-outfit font-extrabold text-foreground text-sm">{t("themePresets")}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
                {BUILTIN_THEMES.map((theme) => (
                  <ThemePresetCard
                    key={theme.id}
                    theme={theme}
                    isActive={activeTheme?.id === theme.id}
                    onClick={() => {
                      setActiveTheme(theme);
                      saveForm(fields, theme);
                      if (pushToHistory) pushToHistory(fields, theme);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Custom Theme Editor */}
            <div className="space-y-4 pt-6 border-t border-border mt-6 pb-6">
              <h3 className="font-outfit font-extrabold text-foreground text-sm">Custom Styling</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Background Color</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "#ffffff", "#f8fafc", "#f1f5f9", "#fdf4ff", "#eff6ff", "#f0fdf4", // Light
                      "#020617", "#0f172a", "#1e1e24", "#18181b", "#171717", "#09090b"  // Dark
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          const newTheme = { ...(activeTheme || BUILTIN_THEMES[0]), id: "custom", name: "Custom", backgroundColor: color } as ThemeConfig;
                          setActiveTheme(newTheme);
                          saveForm(fields, newTheme);
                        }}
                        className={`h-8 w-8 shrink-0 rounded-md border-2 transition-all ${activeTheme?.backgroundColor === color ? "border-primary scale-105" : "border-border hover:scale-105"}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Border Radius</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "none", value: "0px" },
                      { label: "xs", value: "2px" },
                      { label: "sm", value: "4px" },
                      { label: "md", value: "8px" },
                      { label: "lg", value: "16px" },
                      { label: "full", value: "9999px" },
                    ].map((radius) => (
                      <button
                        key={radius.value}
                        onClick={() => {
                          const newTheme = { ...(activeTheme || BUILTIN_THEMES[0]), id: "custom", name: "Custom", borderRadius: radius.value } as ThemeConfig;
                          setActiveTheme(newTheme);
                          saveForm(fields, newTheme);
                        }}
                        className={`flex-1 min-w-[60px] py-1.5 text-[10px] font-medium rounded-md border transition-colors ${
                          (activeTheme?.borderRadius || "0.5rem") === radius.value || (radius.value === "8px" && activeTheme?.borderRadius === "0.5rem")
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {radius.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
