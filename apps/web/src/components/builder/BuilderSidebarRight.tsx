import React from "react";
import { Copy, QrCode, Smartphone, Code } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ThemeConfig } from "@sec-form/shared";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { TabBar } from "../TabBar";
import { FormField } from "@sec-form/validators";
import { Button } from "../ui/button";

interface BuilderSidebarRightProps {
  rightTab: "preview" | "embed";
  setRightTab: (tab: "preview" | "embed") => void;
  title: string;
  description: string | null;
  fields: FormField[];
  activeTheme: ThemeConfig | null;
  publicFormUrl: string;
  id: string;
  hostOrigin: string;
  layoutMode?: "standard" | "single_field" | "custom_steps";
}

export function BuilderSidebarRight({
  rightTab,
  setRightTab,
  title,
  description,
  fields,
  activeTheme,
  publicFormUrl,
  id,
  hostOrigin,
  layoutMode = "standard",
}: BuilderSidebarRightProps) {
  const t = useTranslations("Builder");
  const tCommon = useTranslations("Common");

  const RIGHT_TABS = [
    { value: "preview", label: t("preview"), icon: Smartphone, iconColorClass: "text-indigo-500", shortcut: "ctrl+7" },
    { value: "embed", label: t("shareEmbed"), icon: Code, iconColorClass: "text-teal-500", shortcut: "ctrl+8" }
  ] as const;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("shareCopied"));
  };

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
    <aside className="relative w-full h-full border-l border-border bg-sidebar overflow-hidden flex flex-col">
      {/* Tabs header */}
      <TabBar
        items={RIGHT_TABS}
        selectedValue={rightTab}
        onChange={setRightTab}
        fullWidth
      />

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-16 space-y-6 bg-muted/10">
        {rightTab === "preview" && (
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
                                borderColor: "rgba(128,128,128,0.2)",
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
                                borderColor: "rgba(128,128,128,0.2)",
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
                                borderColor: "rgba(128,128,128,0.2)",
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
                                borderColor: "rgba(128,128,128,0.2)",
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
                                    borderColor: "rgba(128,128,128,0.2)"
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
                                  <Checkbox className="border-slate-300" checked={false} />
                                  <span className="font-medium select-none text-sm text-foreground">{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}
                          {field.type === "checkbox" && (
                            <label className="flex items-center gap-3 p-2 rounded-lg transition-colors group w-fit pointer-events-none">
                              <Checkbox className="border-slate-300" checked={false} />
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
        )}

        {rightTab === "embed" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-outfit font-bold text-foreground text-sm">{t("shareEmbed")} Code</h3>
              <p className="text-muted-foreground text-[10px] mt-0.5">Embed the form on any webpage.</p>
              
              <div className="mt-3 relative">
                <pre className="bg-muted p-2.5 rounded-lg text-[10px] text-foreground overflow-x-auto whitespace-pre-wrap font-mono select-all pr-10 border border-border">
                  {`<iframe src="${publicFormUrl}" width="100%" height="600px" frameborder="0"></iframe>`}
                </pre>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyCode(`<iframe src="${publicFormUrl}" width="100%" height="600px" frameborder="0"></iframe>`)}
                  className="absolute right-2 top-2 h-7 w-7 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-outfit font-bold text-foreground text-sm">JavaScript Script Tag</h3>
              <p className="text-muted-foreground text-[10px] mt-0.5">Embed using a clean SDK script tag.</p>
              
              <div className="mt-3 relative">
                <pre className="bg-muted p-2.5 rounded-lg text-[10px] text-foreground overflow-x-auto whitespace-pre-wrap font-mono select-all pr-10 border border-border">
                  {`<div id="formu-embed-${id}"></div>\n<script src="${hostOrigin}/embed.js" data-form="${id}" data-target="formu-embed-${id}"></script>`}
                </pre>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyCode(`<div id="formu-embed-${id}"></div>\n<script src="${hostOrigin}/embed.js" data-form="${id}" data-target="formu-embed-${id}"></script>`)}
                  className="absolute right-2 top-2 h-7 w-7 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex flex-col items-center text-center">
              <QrCode className="h-6 w-6 text-indigo-600 mb-1" />
              <h3 className="font-outfit font-bold text-foreground text-sm">QR Code Sharing</h3>
              <p className="text-muted-foreground text-[10px] mt-0.5 mb-4">Scan to open the public form instantly.</p>
              
              <div className="p-3 bg-white border border-border rounded-2xl shadow-sm">
                <QRCodeSVG value={publicFormUrl} size={130} />
              </div>
              
              <span className="font-mono text-[10px] text-indigo-600 mt-3 select-all truncate max-w-full">{publicFormUrl}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
