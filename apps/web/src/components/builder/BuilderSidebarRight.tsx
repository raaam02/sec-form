import React from "react";
import { Copy, QrCode, Smartphone, Code } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ThemeConfig } from "@sec-form/shared";
import { FormField } from "@sec-form/validators";
import { TabBar } from "../TabBar";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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
}: BuilderSidebarRightProps) {
  const t = useTranslations("Builder");
  const tCommon = useTranslations("Common");

  const RIGHT_TABS = [
    { value: "preview", label: t("preview"), icon: Smartphone, iconColorClass: "text-indigo-500" },
    { value: "embed", label: t("shareEmbed"), icon: Code, iconColorClass: "text-teal-500" }
  ] as const;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t("shareCopied"));
  };

  return (
    <aside className="w-[340px] lg:w-[380px] border-l border-border bg-card overflow-hidden shrink-0 flex flex-col">
      {/* Tabs header */}
      <TabBar
        items={RIGHT_TABS}
        selectedValue={rightTab}
        onChange={setRightTab}
        fullWidth
      />

      {/* Scrollable Container Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 bg-muted/10">
        {rightTab === "preview" && (
          <div className="flex flex-col items-stretch">
            {/* Native preview container (No smartphone frame) */}
            <div 
              className="w-full rounded-2xl border border-border shadow-md overflow-hidden flex flex-col transition-all duration-300 bg-background"
              style={{
                fontFamily: activeTheme?.fontFamily || "inherit",
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
                  {fields.length === 0 ? (
                    <div className="text-center py-10 text-[10px] opacity-50">
                      {t("canvasEmptyTitle")}
                    </div>
                  ) : (
                    fields.map((field) => (
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
                        <div className="text-xs">
                          {["text", "email", "date"].includes(field.type) && (
                            <input 
                              type="text" 
                              placeholder={field.placeholder || "Enter answer..."}
                              className="h-8 w-full px-2.5 rounded border text-[10px] focus:outline-none" 
                              style={{ 
                                borderColor: "rgba(128,128,128,0.25)",
                                backgroundColor: activeTheme?.backgroundColor || "#ffffff",
                                color: activeTheme?.textColor || "#0f172a",
                                borderRadius: activeTheme?.borderRadius || "0.25rem"
                              }}
                              disabled
                            />
                          )}
                          {field.type === "textarea" && (
                            <textarea 
                              placeholder={field.placeholder || "Enter answer..."}
                              className="w-full h-12 p-2 rounded border text-[10px] focus:outline-none" 
                              style={{ 
                                borderColor: "rgba(128,128,128,0.25)",
                                backgroundColor: activeTheme?.backgroundColor || "#ffffff",
                                color: activeTheme?.textColor || "#0f172a",
                                borderRadius: activeTheme?.borderRadius || "0.25rem"
                              }}
                              disabled
                            />
                          )}
                          {field.type === "number" && (
                            <input 
                              type="number" 
                              placeholder="0"
                              className="h-8 w-24 px-2.5 rounded border text-[10px] focus:outline-none" 
                              style={{ 
                                borderColor: "rgba(128,128,128,0.25)",
                                backgroundColor: activeTheme?.backgroundColor || "#ffffff",
                                color: activeTheme?.textColor || "#0f172a",
                                borderRadius: activeTheme?.borderRadius || "0.25rem"
                              }}
                              disabled
                            />
                          )}
                          {field.type === "checkbox" && (
                            <div className="flex items-center gap-1.5">
                              <input type="checkbox" className="rounded" style={{ accentColor: activeTheme?.primaryColor || "#6366f1" }} disabled />
                              <span className="text-[10px] opacity-80">Agree</span>
                            </div>
                          )}
                          {field.type === "rating" && (
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button 
                                  key={i} 
                                  className="text-base transition-transform hover:scale-110 active:scale-95 text-slate-300" 
                                  style={{ color: activeTheme?.primaryColor || "#e2e8f0" }}
                                  disabled
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          )}
                          {field.type === "select" && field.options && (
                            <select 
                              className="h-8 w-full px-2 rounded border text-[10px] focus:outline-none bg-transparent"
                              style={{ 
                                borderColor: "rgba(128,128,128,0.25)",
                                borderRadius: activeTheme?.borderRadius || "0.25rem"
                              }}
                              disabled
                            >
                              <option value="">Select option...</option>
                              {field.options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          )}
                          {field.type === "multiselect" && field.options && (
                            <div className="flex flex-col gap-1">
                              {field.options.map((opt) => (
                                <div key={opt} className="flex items-center gap-1.5">
                                  <input type="checkbox" className="rounded" style={{ accentColor: activeTheme?.primaryColor || "#6366f1" }} disabled />
                                  <span className="text-[9px] opacity-85">{opt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit button inside preview */}
                <button
                  className="w-full py-2.5 text-xs font-bold text-white shadow-sm flex items-center justify-center transition-opacity"
                  style={{
                    backgroundColor: activeTheme?.primaryColor || "#6366f1",
                    borderRadius: activeTheme?.borderRadius || "0.5rem"
                  }}
                  disabled
                >
                  {tCommon("submit")}
                </button>
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
