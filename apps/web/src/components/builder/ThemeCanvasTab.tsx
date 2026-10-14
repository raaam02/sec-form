import React from "react";
import { motion } from "motion/react";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { ThemePresetCard } from "./ThemePresetCard";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "./ColorPicker";
import { useTranslations } from "next-intl";

const CUSTOM_EDITOR_FIELDS: { key: keyof ThemeConfig; label: string; defaultVal: string }[] = [
  { key: "primaryColor", label: "Button & Accent Color", defaultVal: BUILTIN_THEMES[0].primaryColor },
  { key: "backgroundColor", label: "Page Background", defaultVal: BUILTIN_THEMES[0].backgroundColor },
  { key: "textColor", label: "Text Color", defaultVal: BUILTIN_THEMES[0].textColor },
  { key: "cardColor", label: "Card Background", defaultVal: BUILTIN_THEMES[0].cardColor },
  { key: "inputBgColor", label: "Input Background", defaultVal: "#ffffff" },
  { key: "inputBorderColor", label: "Input Border Color", defaultVal: "rgba(128,128,128,0.2)" }
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
    <div className="space-y-6">
      {/* Built-in Preset Themes */}
      <div className="backdrop-blur-sm p-4 rounded-2xl border border-border/70 bg-card/40 space-y-3">
        <h3 className="font-outfit font-bold text-foreground text-sm">{t("themePresets")}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {BUILTIN_THEMES.map((theme) => (
            <motion.div
              key={theme.id}
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

      {/* Custom Theme Editor */}
      <div className="backdrop-blur-sm p-4 rounded-2xl border border-border/70 bg-card/40 space-y-5">
        <h3 className="font-outfit font-bold text-foreground text-sm">Custom Styling</h3>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-3.5">
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

          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Border Radius</label>
              <div className="grid grid-cols-3 gap-1.5">
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
                    whileTap={{ scale: 0.98, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                    onClick={() => {
                      const newTheme = { ...(activeTheme || BUILTIN_THEMES[0]), id: "custom", name: "Custom", borderRadius: radius.value } as ThemeConfig;
                      setActiveTheme(newTheme);
                      saveForm(fields, newTheme);
                      if (pushToHistory) pushToHistory(fields, newTheme);
                    }}
                    className={`py-1.5 text-[10px] font-medium rounded-lg border transition-colors ${
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
      </div>
    </div>
  );
}
