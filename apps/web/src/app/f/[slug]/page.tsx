"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { FormField, buildSubmissionValidator } from "@sec-form/validators";
import { LoadingSpinner } from "@sec-form/ui";
import { CheckCircle2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations("PublicForm");

  // Query form metadata
  const { data: form, isLoading, error } = trpc.forms.getBySlug.useQuery({ slug });

  // Mutation
  const submitMutation = trpc.submissions.submit.useMutation();

  // Local state for answers
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle input updates
  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear validation error when field is updated
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleCheckboxChange = (fieldId: string, checked: boolean) => {
    handleInputChange(fieldId, checked);
  };

  const handleMultiSelectChange = (fieldId: string, option: string, isChecked: boolean) => {
    const current = (answers[fieldId] as string[]) || [];
    let updated;
    if (isChecked) {
      updated = [...current, option];
    } else {
      updated = current.filter((o) => o !== option);
    }
    handleInputChange(fieldId, updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setValidationErrors({});

    if (!form) return;

    const fields = (form.schemaJson as any).fields || [];
    
    // Validate client-side first
    try {
      const validator = buildSubmissionValidator(fields);
      validator.parse(answers);
    } catch (err: any) {
      if (err.name === "ZodError") {
        const errors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          if (e.path && e.path[0]) {
            errors[e.path[0]] = e.message;
          }
        });
        setValidationErrors(errors);
        return;
      }
    }

    // Submit payload
    try {
      await submitMutation.mutateAsync({
        formId: form.id,
        answersJson: answers,
      });
      setIsSubmitted(true);
      
      // Trigger confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit form responses. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner className="w-10 h-10" color="text-primary" />
      </div>
    );
  }

  // Handle visibility error blocks
  if (error || !form) {
    const isDraftError = error?.message?.includes("draft");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="font-outfit text-2xl font-bold text-foreground">
          {isDraftError ? "Form is a Draft" : "Form Not Available"}
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          {isDraftError
            ? "This questionnaire is in draft mode and is not currently accepting submissions."
            : "The form you are trying to reach does not exist or has been deleted by the owner."}
        </p>
      </div>
    );
  }

  const fields: FormField[] = (form.schemaJson as any).fields || [];
  const theme = form.themeJson as any;

  // Custom theme variables mapped from database theme settings
  const customStyles = {
    "--primary": theme.primaryColor || "#4f46e5",
    "--background-color": theme.backgroundColor || "#f3f4f6",
    "--text-color": theme.textColor || "#1f2937",
    "--card-color": theme.cardColor || "#ffffff",
    "--border-radius": theme.borderRadius || "0.5rem",
    "--font-family": theme.fontFamily || "Inter, sans-serif"
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-4 md:p-10 font-[family-name:var(--font-family)] transition-colors"
      style={{
        ...customStyles,
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)"
      }}
    >
      <div className="w-full flex-1 flex items-center justify-center py-6">
        <div
          className="max-w-xl w-full border border-slate-200/50 p-6 md:p-8 shadow-lg transition-all"
          style={{
            backgroundColor: "var(--card-color)",
            borderRadius: "var(--border-radius)"
          }}
        >
          {isSubmitted ? (
            /* Submission success container */
            <div className="text-center py-10 flex flex-col items-center justify-center gap-4">
              <CheckCircle2 className="h-16 w-16 text-[color:var(--primary)]" />
              <h1 className="font-outfit text-3xl font-extrabold leading-none">{t("submitSuccess")}</h1>
              <p className="text-slate-500 text-sm max-w-xs mt-1">{t("submitSuccessDesc")}</p>
              <button
                onClick={() => {
                  setAnswers({});
                  setIsSubmitted(false);
                }}
                className="mt-6 text-xs font-bold text-[color:var(--primary)] hover:underline"
              >
                {t("submitAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Header info */}
              <div>
                <h1 className="font-outfit text-2xl font-bold leading-tight">{form.title}</h1>
                {form.description && <p className="text-sm mt-2 opacity-80 leading-relaxed">{form.description}</p>}
              </div>

              {submitError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Fields rendering list */}
              <div className="space-y-6">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2 text-left">
                    <label className="text-sm font-semibold block">
                      {field.label} {field.required && <span className="text-destructive">*</span>}
                    </label>
                    {field.description && <span className="text-xs opacity-60 block leading-tight">{field.description}</span>}

                    <div className="mt-1">
                      {/* SHORT TEXT */}
                      {field.type === "text" && (
                        <Input
                          type="text"
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || "Your answer..."}
                          className="text-slate-900 bg-white"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "rgba(128,128,128,0.2)"
                          }}
                        />
                      )}

                      {/* LONG TEXT */}
                      {field.type === "textarea" && (
                        <Textarea
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || "Your response..."}
                          className="text-slate-900 bg-white"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "rgba(128,128,128,0.2)"
                          }}
                        />
                      )}

                      {/* EMAIL */}
                      {field.type === "email" && (
                        <Input
                          type="email"
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || "you@example.com"}
                          className="text-slate-900 bg-white"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "rgba(128,128,128,0.2)"
                          }}
                        />
                      )}

                      {/* NUMBER */}
                      {field.type === "number" && (
                        <Input
                          type="number"
                          value={answers[field.id] === undefined ? "" : answers[field.id]}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder="0"
                          className="max-w-[150px] text-slate-900 bg-white"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "rgba(128,128,128,0.2)"
                          }}
                        />
                      )}

                      {/* SINGLE SELECT */}
                      {field.type === "select" && (
                        <select
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "rgba(128,128,128,0.2)"
                          }}
                        >
                          <option value="">Choose option...</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {/* MULTI SELECT */}
                      {field.type === "multiselect" && (
                        <div className="space-y-2 pl-1">
                          {field.options?.map((opt) => {
                            const currentAnswers = (answers[field.id] as string[]) || [];
                            const isChecked = currentAnswers.includes(opt);
                            return (
                              <div key={opt} className="flex items-center gap-2 text-sm text-slate-700">
                                <Checkbox
                                  id={`${field.id}-${opt}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => handleMultiSelectChange(field.id, opt, !!checked)}
                                  className="border-slate-300"
                                />
                                <label htmlFor={`${field.id}-${opt}`} className="cursor-pointer font-medium select-none">{opt}</label>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* CHECKBOX */}
                      {field.type === "checkbox" && (
                        <div className="flex items-center gap-2 text-sm text-slate-700 pl-1">
                          <Checkbox
                            id={field.id}
                            checked={answers[field.id] || false}
                            onCheckedChange={(checked) => handleCheckboxChange(field.id, !!checked)}
                            className="border-slate-300"
                          />
                          <label htmlFor={field.id} className="cursor-pointer font-medium select-none">I confirm this detail</label>
                        </div>
                      )}

                      {/* RATING */}
                      {field.type === "rating" && (
                        <div className="flex gap-2 pl-1">
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const starVal = idx + 1;
                            const currentVal = answers[field.id] || 0;
                            return (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => handleInputChange(field.id, starVal)}
                                className={`text-3xl transition-colors ${
                                  starVal <= currentVal ? "text-amber-400" : "text-slate-300"
                                }`}
                              >
                                ★
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* DATE */}
                      {field.type === "date" && (
                        <div className="relative max-w-[200px]">
                          <Input
                            type="date"
                            value={answers[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="text-slate-900 bg-white"
                            style={{
                              borderRadius: "var(--border-radius)",
                              borderColor: "rgba(128,128,128,0.2)"
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Inline Zod alert */}
                    {validationErrors[field.id] && (
                      <span className="text-xs text-destructive font-semibold block">{validationErrors[field.id]}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Submission triggers */}
              <div className="pt-6 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={submitMutation.isLoading}
                  className="w-full h-11 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--primary)",
                    borderRadius: "var(--border-radius)",
                    boxShadow: "0 10px 15px -3px rgba(var(--primary), 0.15)"
                  }}
                >
                  {submitMutation.isLoading ? <LoadingSpinner className="w-5 h-5" color="text-white" /> : t("submitBtn")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs opacity-60 flex flex-col items-center gap-2 mt-6 pb-6">
        <span>{t("poweredBy")} Formu.AI</span>
        <LocaleSwitcher />
      </footer>
    </div>
  );
}
