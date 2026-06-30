import React from "react";
import { ThemeConfig } from "@sec-form/shared";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { FormField } from "@sec-form/validators";
import { Button } from "../ui/button";
import { EyeOff } from "lucide-react";

interface BuilderSidebarRightProps {
  title: string;
  description: string | null;
  fields: FormField[];
  activeTheme: ThemeConfig | null;
  publicFormUrl: string;
  id: string;
  hostOrigin: string;
  layoutMode?: "standard" | "single_field" | "custom_steps";
  setLayoutMode?: (mode: "standard" | "single_field" | "custom_steps") => void;
  saveForm?: (fields: FormField[], updatedTheme?: any, updatedLayoutMode?: "standard" | "single_field" | "custom_steps") => void;
}

export function BuilderSidebarRight({
  title,
  description,
  fields,
  activeTheme,
  layoutMode = "standard",
  setLayoutMode,
  saveForm,
}: BuilderSidebarRightProps) {
  const t = useTranslations("Builder");
  const inputBg = activeTheme?.inputBgColor || "transparent";
  const inputBorder = activeTheme?.inputBorderColor || "rgba(128,128,128,0.2)";

  // Pre-process steps
  const pages: FormField[][] = React.useMemo(() => {
    const validFields = fields.filter((f) => f.type !== "step_break");
    if (layoutMode === "single_field") {
      return validFields.length > 0 ? validFields.map(f => [f]) : [[]];
    }
    if (layoutMode === "custom_steps") {
      const result: FormField[][] = [];
      let currentStep: FormField[] = [];
      for (const field of fields) {
        if (field.type === "step_break") {
          if (currentStep.length > 0) result.push(currentStep);
          currentStep = [];
        } else {
          currentStep.push(field);
        }
      }
      if (currentStep.length > 0) result.push(currentStep);
      return result.length > 0 ? result : [[]];
    }
    return [validFields];
  }, [fields, layoutMode]);

  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const currentFields = pages[currentStepIndex] || [];
  const isLastStep = currentStepIndex === pages.length - 1;

  // Reset step if layout mode or fields change significantly
  React.useEffect(() => {
    setCurrentStepIndex(0);
  }, [layoutMode, fields.length]);

  return (
    <aside className="relative rounded-l-lg border-l border-y border-border bg-background/40 backdrop-blur-sm w-full h-full overflow-hidden flex flex-col">
      {/* Header — Layout selector + toggle side by side */}
      <div className="border-b border-border px-3 py-2.5 shrink-0">
        <div className="flex items-center gap-2">
          {/* Layout Mode Selector */}
          {setLayoutMode && (
            <Select value={layoutMode} onValueChange={(val: any) => {
              setLayoutMode(val);
              if (saveForm) saveForm(fields, null, val);
            }}>
              <SelectTrigger className="h-8 text-xs bg-secondary/50 border-0 shadow-sm hover:bg-muted/40 transition-colors focus:ring-1 focus:ring-ring focus:ring-offset-0 backdrop-blur-sm flex-1 min-w-0">
                <SelectValue placeholder="Display Layout">
                  {layoutMode === "standard" && "Standard (All Fields)"}
                  {layoutMode === "single_field" && "One Field per Step"}
                  {layoutMode === "custom_steps" && "Grouped by Steps"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-secondary/50 backdrop-blur-sm">
                <SelectItem value="standard" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">Standard (All Fields)</span>
                    <span className="text-[10px] text-muted-foreground">All fields shown on one page</span>
                  </div>
                </SelectItem>
                <SelectItem value="single_field" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">One Field per Step</span>
                    <span className="text-[10px] text-muted-foreground">Show one question at a time</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom_steps" className="text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">Grouped by Steps</span>
                    <span className="text-[10px] text-muted-foreground">Use page break elements to group</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          <div className="w-8 shrink-0" />
        </div>
      </div>

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-5 space-y-6 bg-muted/10">
        <div className="flex flex-col items-stretch">
          {/* Native preview container (No smartphone frame) */}
          <div
            className="w-full rounded-2xl border border-border shadow-md overflow-hidden flex flex-col transition-all duration-300 bg-background"
            style={{
              backgroundColor: activeTheme?.backgroundColor || "#ffffff",
              color: activeTheme?.textColor || "#0f172a",
            }}
          >
            {/* Live Form Content wrapper */}
            <div className="flex-1 p-5 space-y-6">

              {/* Form Header Card */}
              <div
                className="p-4 border transition-all duration-200"
                style={{
                  backgroundColor: activeTheme?.cardColor || "#ffffff",
                  borderColor: "rgba(128,128,128,0.15)",
                  borderRadius: activeTheme?.borderRadius || "0.5rem"
                }}
              >
                <h2 className="text-sm font-extrabold" style={{ color: activeTheme?.textColor || "#0f172a" }}>
                  {title || t("canvasTitlePlaceholder")}
                </h2>
                <p className="text-[10px] opacity-70 mt-1">
                  {description || t("canvasDescPlaceholder")}
                </p>
              </div>

              {/* Form Fields Card list */}
              <div className="space-y-4">
                {currentFields.length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-muted-foreground italic bg-muted/20 border border-dashed rounded-lg border-border">
                    {t("previewEmptyDesc")}
                  </div>
                ) : (
                  currentFields.map((field) => (
                    <div
                      key={field.id}
                      className="p-4 border transition-all duration-200 space-y-2"
                      style={{
                        backgroundColor: activeTheme?.cardColor || "#ffffff",
                        borderColor: "rgba(128,128,128,0.15)",
                        borderRadius: activeTheme?.borderRadius || "0.5rem"
                      }}
                    >
                      <label className="text-[10px] font-bold block">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                        {field.description && <span className="block text-[9px] opacity-60 font-normal mt-0.5">{field.description}</span>}
                      </label>

                      {/* Interactive fields inside preview */}
                      <div className="mt-1">
                        {["text", "email", "date", "phone"].includes(field.type) && (
                          <Input
                            type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
                            placeholder={field.placeholder || "Your answer..."}
                            className="text-foreground bg-transparent pointer-events-none transition-colors"
                            style={{
                              borderColor: inputBorder,
                              backgroundColor: inputBg,
                              borderRadius: activeTheme?.borderRadius || "0.5rem"
                            }}
                            readOnly
                          />
                        )}
                        {field.type === "number" && (
                          <Input
                            type="number"
                            placeholder="0"
                            className="max-w-[150px] text-foreground bg-transparent pointer-events-none transition-colors"
                            style={{
                              borderColor: inputBorder,
                              backgroundColor: inputBg,
                              borderRadius: activeTheme?.borderRadius || "0.5rem"
                            }}
                            readOnly
                          />
                        )}
                        {field.type === "time" && (
                          <Input
                            type="time"
                            className="max-w-[150px] text-foreground bg-transparent pointer-events-none transition-colors"
                            style={{
                              borderColor: inputBorder,
                              backgroundColor: inputBg,
                              borderRadius: activeTheme?.borderRadius || "0.5rem"
                            }}
                            readOnly
                          />
                        )}
                        {field.type === "textarea" && (
                          <Textarea
                            placeholder={field.placeholder || "Your response..."}
                            className="text-foreground bg-transparent pointer-events-none transition-colors"
                            style={{
                              borderColor: inputBorder,
                              backgroundColor: inputBg,
                              borderRadius: activeTheme?.borderRadius || "0.5rem"
                            }}
                            readOnly
                          />
                        )}
                        {field.type === "select" && field.options && (
                          <div className="pointer-events-none">
                            <Select disabled>
                              <SelectTrigger
                                className="w-full text-foreground bg-transparent transition-colors"
                                style={{
                                  borderRadius: activeTheme?.borderRadius || "0.5rem",
                                  borderColor: inputBorder,
                                  backgroundColor: inputBg
                                }}
                              >
                                <SelectValue placeholder="Choose option..." />
                              </SelectTrigger>
                            </Select>
                          </div>
                        )}
                        {field.type === "multiselect" && field.options && (
                          <div className="space-y-1.5 pl-1 pointer-events-none">
                            {field.options.map((opt) => (
                              <label key={opt} className="flex items-center gap-3 p-2 rounded-lg transition-colors group">
                                <Checkbox
                                  className="border-slate-300"
                                  checked={false}
                                  style={{
                                    borderColor: inputBorder,
                                    backgroundColor: inputBg
                                  }}
                                />
                                <span className="font-medium select-none text-sm text-foreground">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {field.type === "checkbox" && (
                          <label className="flex items-center gap-3 p-2 rounded-lg transition-colors group w-fit pointer-events-none">
                            <Checkbox
                              className="border-slate-300"
                              checked={false}
                              style={{
                                borderColor: inputBorder,
                                backgroundColor: inputBg
                              }}
                            />
                            <span className="font-medium select-none text-sm text-foreground">I confirm this detail</span>
                          </label>
                        )}
                        {field.type === "rating" && (
                          <div className="flex gap-2 pl-1 pointer-events-none">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                className="text-2xl text-slate-300"
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                <div className="pt-2 flex gap-2">
                  {currentStepIndex > 0 && (
                    <Button
                      onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
                      variant="outline"
                      className="flex-1 h-8 text-[10px] uppercase font-bold rounded-xl transition-all shadow-sm"
                      style={{
                        borderRadius: activeTheme?.borderRadius || "0.5rem"
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {isLastStep ? (
                    <Button
                      disabled
                      className="flex-1 h-8 text-white text-[10px] uppercase font-bold rounded-xl transition-all shadow-md opacity-50 cursor-not-allowed"
                      style={{
                        backgroundColor: activeTheme?.primaryColor || "#4f46e5",
                        borderRadius: activeTheme?.borderRadius || "0.5rem"
                      }}
                    >
                      {t("submitBtn")}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentStepIndex(p => p + 1)}
                      className="flex-1 h-8 text-white text-[10px] uppercase font-bold rounded-xl transition-all shadow-md"
                      style={{
                        backgroundColor: activeTheme?.primaryColor || "#4f46e5",
                        borderRadius: activeTheme?.borderRadius || "0.5rem"
                      }}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
