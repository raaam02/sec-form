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
  Calendar 
} from "lucide-react";
import { BUILTIN_THEMES, ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { TabBar } from "../TabBar";
import { ThemePresetCard } from "./ThemePresetCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface BuilderSidebarLeftProps {
  leftTab: "builder" | "themes";
  setLeftTab: (tab: "builder" | "themes") => void;
  focusedField: FormField | null;
  handleUpdateField: (id: string, updates: Partial<FormField>) => void;
  handleAddField: (type: FormField["type"]) => void;
  activeTheme: ThemeConfig | null;
  setActiveTheme: (theme: ThemeConfig) => void;
  saveForm: (fields: FormField[], theme?: ThemeConfig) => void;
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
  fields,
}: BuilderSidebarLeftProps) {
  const t = useTranslations("Builder");

  const LEFT_TABS = [
    { value: "builder", label: t("tabBuild"), icon: Plus, iconColorClass: "text-indigo-500" },
    { value: "themes", label: t("tabTheme"), icon: Palette, iconColorClass: "text-purple-500" }
  ] as const;

  const FIELD_TYPES = [
    { type: "text", label: t("sidebarFieldText"), icon: Type, iconColor: "text-indigo-500", colSpan2: false },
    { type: "textarea", label: t("sidebarFieldTextarea"), icon: AlignLeft, iconColor: "text-blue-500", colSpan2: false },
    { type: "email", label: t("sidebarFieldEmail"), icon: Mail, iconColor: "text-emerald-500", colSpan2: false },
    { type: "number", label: t("sidebarFieldNumber"), icon: Hash, iconColor: "text-amber-500", colSpan2: false },
    { type: "select", label: t("sidebarFieldSelect"), icon: List, iconColor: "text-orange-500", colSpan2: false },
    { type: "multiselect", label: "Multi Select", icon: CheckSquare, iconColor: "text-teal-500", colSpan2: false },
    { type: "checkbox", label: t("sidebarFieldCheckbox"), icon: CheckSquare, iconColor: "text-purple-500", colSpan2: false },
    { type: "rating", label: "Rating", icon: Star, iconColor: "text-yellow-500", colSpan2: false },
    { type: "date", label: "Date", icon: Calendar, iconColor: "text-pink-500", colSpan2: true }
  ] as const;

  return (
    <aside className="w-[340px] lg:w-[380px] border-r border-border bg-card overflow-hidden shrink-0 flex flex-col">
      {/* Tabs header */}
      <TabBar
        items={LEFT_TABS}
        selectedValue={leftTab}
        onChange={setLeftTab}
        fullWidth
      />

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {leftTab === "builder" && (
          <>
            {/* Field adder */}
            <div className="space-y-3">
              <h3 className="font-outfit font-extrabold text-foreground text-sm">{t("sidebarAddFields")}</h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-muted-foreground">
                {FIELD_TYPES.map((field) => {
                  const Icon = field.icon;
                  return (
                    <button
                      key={field.type}
                      type="button"
                      onClick={() => handleAddField(field.type)}
                      className={`flex items-center gap-2 p-2 rounded-xl border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors ${
                        field.colSpan2 ? "col-span-2 justify-center" : ""
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${field.iconColor} shrink-0`} />
                      <span>{field.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Properties editor */}
            <div className="border-t border-border pt-4">
              {focusedField ? (
                <div className="space-y-4">
                  <h3 className="font-outfit font-extrabold text-foreground text-sm">{t("sidebarSettings")}</h3>
                  
                  <div className="space-y-3.5 text-xs font-semibold text-muted-foreground">
                    <div>
                      <label className="uppercase tracking-wider text-[9px] block mb-1 text-muted-foreground">{t("propLabel")}</label>
                      <Input
                        type="text"
                        value={focusedField.label}
                        onChange={(e) => handleUpdateField(focusedField.id, { label: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-border bg-background font-medium text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-wider text-[9px] block mb-1 text-muted-foreground">{t("propHelp")}</label>
                      <Input
                        type="text"
                        value={focusedField.description || ""}
                        onChange={(e) => handleUpdateField(focusedField.id, { description: e.target.value })}
                        className="h-9 w-full px-3 rounded-lg border border-border bg-background font-medium text-foreground focus:outline-none"
                      />
                    </div>

                    {["text", "textarea", "email"].includes(focusedField.type) && (
                      <div>
                        <label className="uppercase tracking-wider text-[9px] block mb-1 text-muted-foreground">{t("propPlaceholder")}</label>
                        <Input
                          type="text"
                          value={focusedField.placeholder || ""}
                          onChange={(e) => handleUpdateField(focusedField.id, { placeholder: e.target.value })}
                          className="h-9 w-full px-3 rounded-lg border border-border bg-background font-medium text-foreground focus:outline-none"
                        />
                      </div>
                    )}

                    {["select", "multiselect"].includes(focusedField.type) && (
                      <div>
                        <label className="uppercase tracking-wider text-[9px] block mb-1 text-muted-foreground">{t("propOptions")}</label>
                        <Input
                          type="text"
                          value={focusedField.options ? focusedField.options.join(", ") : ""}
                          onChange={(e) => {
                            const opts = e.target.value.split(",").map((o) => o.trim()).filter((o) => o.length > 0);
                            handleUpdateField(focusedField.id, { options: opts });
                          }}
                          className="h-9 w-full px-3 rounded-lg border border-border bg-background font-medium text-foreground focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox
                        id="required-toggle"
                        checked={focusedField.required || false}
                        onCheckedChange={(checked) => handleUpdateField(focusedField.id, { required: !!checked })}
                        className="rounded border-border text-indigo-655"
                      />
                      <label htmlFor="required-toggle" className="text-foreground cursor-pointer select-none">{t("propRequired")}</label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-xs py-10">
                  {t("sidebarSettingsDesc")}
                </div>
              )}
            </div>
          </>
        )}

        {leftTab === "themes" && (
          <>
            {/* Built-in Preset Themes */}
            <div className="space-y-4">
              <h3 className="font-outfit font-extrabold text-foreground text-sm">{t("themePresets")}</h3>
              <div className="grid grid-cols-1 gap-3">
                {BUILTIN_THEMES.map((theme) => (
                  <ThemePresetCard
                    key={theme.id}
                    theme={theme}
                    isActive={activeTheme?.id === theme.id}
                    onClick={() => {
                      setActiveTheme(theme);
                      saveForm(fields, theme);
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
