import React from "react";
import { motion } from "motion/react";
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
  Phone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { TabBar } from "../TabBar";
import { ThemePresetCard } from "./ThemePresetCard";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";

const CUSTOM_EDITOR_FIELDS: { key: keyof ThemeConfig; label: string; defaultVal: string }[] = [
  { key: "primaryColor", label: "Button & Accent Color", defaultVal: BUILTIN_THEMES[0].primaryColor },
  { key: "backgroundColor", label: "Page Background", defaultVal: BUILTIN_THEMES[0].backgroundColor },
  { key: "textColor", label: "Text Color", defaultVal: BUILTIN_THEMES[0].textColor },
  { key: "cardColor", label: "Card Background", defaultVal: BUILTIN_THEMES[0].cardColor },
  { key: "inputBgColor", label: "Input Background", defaultVal: "#ffffff" },
  { key: "inputBorderColor", label: "Input Border Color", defaultVal: "rgba(128,128,128,0.2)" }
];

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
  isExpanded?: boolean;
  setIsExpanded?: (open: boolean) => void;
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
  isExpanded,
  setIsExpanded,
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

  const [localExpanded, setLocalExpanded] = React.useState(false);
  const activeExpanded = isExpanded !== undefined ? isExpanded : localExpanded;
  const activeSetExpanded = setIsExpanded !== undefined ? setIsExpanded : setLocalExpanded;

  const handleColorChange = (key: keyof ThemeConfig, val: string) => {
    const defaultTheme = BUILTIN_THEMES[0];
    const newTheme = {
      ...(activeTheme || defaultTheme),
      id: "custom",
      name: "Custom",
      [key]: val
    } as ThemeConfig;
    setActiveTheme(newTheme);
  };

  const handleColorComplete = (key: keyof ThemeConfig, val: string) => {
    const defaultTheme = BUILTIN_THEMES[0];
    const newTheme = {
      ...(activeTheme || defaultTheme),
      id: "custom",
      name: "Custom",
      [key]: val
    } as ThemeConfig;
    setActiveTheme(newTheme);
    saveForm(fields, newTheme);
    if (pushToHistory) {
      pushToHistory(fields, newTheme);
    }
  };

  return (
    <aside className={`@container relative w-full h-full border-r border-border bg-sidebar overflow-hidden flex flex-col transition-all duration-300 ${activeExpanded ? "w-40 z-30 absolute inset-y-0 left-0 md:relative md:w-full" : "w-14 md:w-full"}`}>
      {/* Mobile-only Toggle Button */}
      <div className="flex md:hidden p-2 border-b border-border justify-center items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => activeSetExpanded(!activeExpanded)}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
        >
          {activeExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Tabs header */}
      <div className="hidden md:block">
        <TabBar
          items={LEFT_TABS}
          selectedValue={leftTab}
          onChange={setLeftTab}
          fullWidth
        />
      </div>

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 @[150px]:p-5 pt-3 md:pt-16 space-y-6">
        {leftTab === "builder" && (
          <>
            {/* Field adder */}
            <div className="space-y-3">
              {/* <h3 className="font-outfit font-extrabold text-foreground text-sm hidden @[150px]:block">{t("sidebarAddFields")}</h3> */}
              <div className="grid grid-cols-1 @[260px]:grid-cols-2 gap-2 text-[11px] font-bold text-muted-foreground">
                {FIELD_TYPES.map((field) => {
                  const Icon = field.icon;
                  return (
                    <Tooltip key={field.type} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                          whileTap={{ scale: 0.97, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                          onClick={() => handleAddField(field.type)}
                          className={`flex items-center justify-center @[120px]:justify-start gap-2 p-2 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors min-w-0 ${
                            field.colSpan2 ? "col-span-full @[120px]:justify-center" : ""
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${field.iconColor} shrink-0`} />
                          <span className="truncate min-w-0 hidden @[120px]:inline">{field.label}</span>
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
          </>
        )}

        {leftTab === "themes" && (
          <>
            {/* Custom Theme Editor */}
            <div className="space-y-4 pb-6 hidden @[150px]:block">
              <h3 className="font-outfit font-extrabold text-foreground text-sm">Custom Styling</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {CUSTOM_EDITOR_FIELDS.map((field) => (
                    <ColorPicker
                      key={field.key}
                      label={field.label}
                      value={(activeTheme as any)?.[field.key] || field.defaultVal}
                      onChange={(val) => handleColorChange(field.key, val)}
                      onComplete={(val) => handleColorComplete(field.key, val)}
                    />
                  ))}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/50">
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
                      <motion.button
                        key={radius.value}
                        whileHover={{ scale: 1.02, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.1 } }}
                        whileTap={{ scale: 0.98, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                        onClick={() => {
                          const newTheme = { ...(activeTheme || BUILTIN_THEMES[0]), id: "custom", name: "Custom", borderRadius: radius.value } as ThemeConfig;
                          setActiveTheme(newTheme);
                          saveForm(fields, newTheme);
                          if (pushToHistory) pushToHistory(fields, newTheme);
                        }}
                        className={`flex-1 min-w-[60px] py-1.5 text-[10px] font-medium rounded-md border transition-colors ${
                          (activeTheme?.borderRadius || "0.5rem") === radius.value || (radius.value === "8px" && activeTheme?.borderRadius === "0.5rem")
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {radius.label}
                      </motion.button>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Input
                      type="text"
                      placeholder="Custom radius (e.g. 12px or 1rem)"
                      value={activeTheme?.borderRadius || ""}
                      onChange={(e) => {
                        const newTheme = { ...(activeTheme || BUILTIN_THEMES[0]), id: "custom", name: "Custom", borderRadius: e.target.value } as ThemeConfig;
                        setActiveTheme(newTheme);
                      }}
                      onBlur={() => {
                        const newTheme = { ...(activeTheme || BUILTIN_THEMES[0]), id: "custom", name: "Custom", borderRadius: activeTheme?.borderRadius || "0.5rem" } as ThemeConfig;
                        saveForm(fields, newTheme);
                        if (pushToHistory) pushToHistory(fields, newTheme);
                      }}
                      className="h-8 text-xs rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Built-in Preset Themes */}
            <div className="space-y-4">
              <h3 className="font-outfit font-extrabold text-foreground text-sm hidden @[150px]:block">{t("themePresets")}</h3>
              <div className="grid grid-cols-1 @[150px]:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
                {BUILTIN_THEMES.map((theme) => (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.03, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                    whileTap={{ scale: 0.97, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                  >
                    <ThemePresetCard
                      theme={theme}
                      isActive={activeTheme?.id === theme.id}
                      onClick={() => {
                        setActiveTheme(theme);
                        saveForm(fields, theme);
                        if (pushToHistory) pushToHistory(fields, theme);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
