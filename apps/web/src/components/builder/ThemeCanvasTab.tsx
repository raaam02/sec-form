import React from "react";
import { motion } from "motion/react";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { ThemePresetCard } from "./ThemePresetCard";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "./ColorPicker";
import { useTranslations } from "next-intl";

const CUSTOM_COLOR_GRID: { key: keyof ThemeConfig; label: string; defaultVal: string }[] = [
  { key: "backgroundColor", label: "Page background", defaultVal: BUILTIN_THEMES[0].backgroundColor },
  { key: "textColor", label: "Page text", defaultVal: BUILTIN_THEMES[0].textColor },
  { key: "cardColor", label: "Card background", defaultVal: BUILTIN_THEMES[0].cardColor },
  { key: "primaryColor", label: "Accent", defaultVal: BUILTIN_THEMES[0].primaryColor },
  { key: "buttonBgColor", label: "Button background", defaultVal: BUILTIN_THEMES[0].primaryColor },
  { key: "buttonTextColor", label: "Button text", defaultVal: "#FFFFFF" },
  { key: "inputBgColor", label: "Input background", defaultVal: "#ffffff" },
  { key: "inputTextColor", label: "Input text", defaultVal: BUILTIN_THEMES[0].textColor },
  { key: "inputBorderColor", label: "Input border", defaultVal: "rgba(128,128,128,0.2)" },
];

interface ThemeCanvasTabProps {
  activeTheme: ThemeConfig | null;
  setActiveTheme: (theme: ThemeConfig) => void;
  saveForm: (fields: FormField[], theme?: ThemeConfig | null) => void;
  pushToHistory?: (fields: FormField[], theme: ThemeConfig | null) => void;
  fields: FormField[];
}

export function ThemeCanvasTab({
  activeTheme,
  setActiveTheme,
  saveForm,
  pushToHistory,
  fields,
}: ThemeCanvasTabProps) {
  const t = useTranslations("Builder");

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
    <div className="space-y-6 text-xs">
      {/* 1. Custom Styling Options on TOP (Tally-Style) */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-muted-foreground">
          Custom colors
        </h4>

        {/* 2-Column Grid for All Customizing Fields */}
        <div className="grid grid-cols-2 gap-3">
          {CUSTOM_COLOR_GRID.map((field) => (
            <div key={field.key} className={field.key === "inputBorderColor" ? "col-span-2" : ""}>
              <ColorPicker
                label={field.label}
                value={
                  field.key === "buttonBgColor"
                    ? (activeTheme?.buttonBgColor || activeTheme?.primaryColor || field.defaultVal)
                    : field.key === "buttonTextColor"
                    ? (activeTheme?.buttonTextColor || field.defaultVal)
                    : field.key === "inputTextColor"
                    ? (activeTheme?.inputTextColor || activeTheme?.textColor || field.defaultVal)
                    : ((activeTheme as any)?.[field.key] || field.defaultVal)
                }
                onChange={(val) => handleColorChange(field.key, val)}
                onComplete={(val) => handleColorComplete(field.key, val)}
              />
            </div>
          ))}
        </div>

        {/* Border Radius */}
        <div className="pt-3 border-t border-border/40 space-y-2">
          <label className="text-xs font-medium text-muted-foreground block">
            Corner radius
          </label>
          <div className="grid grid-cols-6 gap-1">
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
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  const newTheme = { ...(activeTheme || BUILTIN_THEMES[0]), id: "custom", name: "Custom", borderRadius: radius.value } as ThemeConfig;
                  setActiveTheme(newTheme);
                  saveForm(fields, newTheme);
                  if (pushToHistory) pushToHistory(fields, newTheme);
                }}
                className={`py-1.5 text-[10px] font-medium rounded-lg border transition-all ${
                  (activeTheme?.borderRadius || "0.5rem") === radius.value || (radius.value === "8px" && activeTheme?.borderRadius === "0.5rem")
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border/70 bg-background/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {radius.label}
              </motion.button>
            ))}
          </div>
          <div className="pt-1">
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
              className="h-8 text-xs rounded-xl border-border/70 bg-background/50"
            />
          </div>
        </div>
      </div>

      {/* 2. Theme Presets on BOTTOM */}
      <div className="pt-5 border-t border-border/40 space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground">
          {t("themePresets")}
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          {BUILTIN_THEMES.map((theme) => (
            <motion.div
              key={theme.id}
              whileTap={{ scale: 0.97 }}
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
    </div>
  );
}
