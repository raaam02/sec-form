"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { trpc } from "../../../utils/trpc";
import { FORM_TEMPLATES, BUILTIN_THEMES } from "@sec-form/shared";
import { Copy, Compass, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardExplorePage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionTemplateId, setActionTemplateId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = ["All", ...Array.from(new Set(FORM_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates = selectedCategory === "All"
    ? FORM_TEMPLATES
    : FORM_TEMPLATES.filter((t) => t.category === selectedCategory);

  // Mutations
  const createFormMutation = trpc.forms.create.useMutation();
  const updateFormMutation = trpc.forms.update.useMutation();

  const handleUseTemplate = async (templateId: string) => {
    const template = FORM_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setIsActionLoading(true);
    setActionTemplateId(templateId);
    setErrorMessage("");

    try {
      // 1. Create a blank form
      const newForm = await createFormMutation.mutateAsync({
        title: template.title,
        description: template.description,
      });

      // 2. Load matched theme or Minimal
      const theme = BUILTIN_THEMES.find((theme) => theme.id === template.themeId) || BUILTIN_THEMES[0];

      // 3. Update the form with the template schema and theme
      await updateFormMutation.mutateAsync({
        id: newForm.id,
        schemaJson: { fields: template.fields as any },
        themeJson: theme as any,
        visibility: "public",
      });

      // Redirect to builder
      router.push(`/dashboard/builder/${newForm.id}`);
    } catch (e: any) {
      setErrorMessage(e.message || "Failed to import template");
      setIsActionLoading(false);
      setActionTemplateId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-transparent text-foreground">
      <DashboardHeader title={t("navExplore")} />

      {errorMessage && (
        <div className="mx-6 sm:mx-8 mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs p-3.5 flex items-center gap-2 shrink-0">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Scrollable Body area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none"
                    : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
            {filteredTemplates.map((template) => {
              const isCurrentLoading = isActionLoading && actionTemplateId === template.id;
              return (
                <div
                  key={template.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-card-foreground"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {template.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {template.fields.length} questions
                      </span>
                    </div>
                    
                    <h3 className="mt-4 font-outfit text-xl font-bold text-foreground">
                      {template.title}
                    </h3>
                    
                    <p className="mt-2 text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
                      {template.description}
                    </p>

                    <div className="mt-5 border-t border-border pt-4">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                        Form Layout Preview
                      </span>
                      <div className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-3">
                        {template.fields.slice(0, 3).map((f) => (
                          <div key={f.id} className="space-y-1">
                            {f.type !== "checkbox" && (
                              <label className="text-[9px] font-bold text-muted-foreground block truncate">
                                {f.label} {f.required && <span className="text-rose-500">*</span>}
                              </label>
                            )}
                            {f.type === "textarea" ? (
                              <div className="h-10 w-full rounded border border-border bg-background px-2 py-1 text-[9px] text-muted-foreground flex items-start truncate select-none pointer-events-none">
                                {f.placeholder || "Enter details..."}
                              </div>
                            ) : f.type === "select" || f.type === "multiselect" ? (
                              <div className="h-7 w-full rounded border border-border bg-background px-2 text-[9px] text-muted-foreground flex items-center justify-between select-none pointer-events-none">
                                <span className="truncate">Select option...</span>
                                <span className="text-[8px] text-muted-foreground shrink-0">▼</span>
                              </div>
                            ) : f.type === "checkbox" ? (
                              <div className="flex items-center gap-2 py-0.5 select-none pointer-events-none">
                                <div className="h-3 w-3 rounded border border-border bg-background shrink-0" />
                                <span className="text-[9px] font-bold text-muted-foreground truncate">{f.label}</span>
                              </div>
                            ) : f.type === "rating" ? (
                              <div className="flex gap-0.5 items-center select-none pointer-events-none">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <span key={i} className="text-amber-500 text-xs">★</span>
                                ))}
                              </div>
                            ) : (
                              <div className="h-7 w-full rounded border border-border bg-background px-2 text-[9px] text-muted-foreground flex items-center truncate select-none pointer-events-none">
                                {f.placeholder || `Enter ${f.label.toLowerCase()}...`}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="h-7 w-full rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold mt-1.5 select-none pointer-events-none">
                          Submit
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      disabled={isActionLoading}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-muted text-white disabled:text-muted-foreground font-semibold py-2.5 text-sm shadow-sm transition-colors"
                    >
                      {isCurrentLoading ? (
                        <>
                          <LoadingSpinner className="w-4 h-4" color="text-muted-foreground" />
                          <span>Creating Form...</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Use Template</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
