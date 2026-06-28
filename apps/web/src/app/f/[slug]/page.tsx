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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { getLocalForms, saveLocalForm, saveLocalSubmission } from "../../../utils/localForms";

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations("PublicForm");

  const localFormFound = typeof window !== "undefined"
    ? getLocalForms().find((f) => f.slug === slug)
    : null;

  React.useEffect(() => {
    if (typeof window !== "undefined" && localFormFound) {
      const updated = {
        ...localFormFound,
        totalViews: (localFormFound.totalViews || 0) + 1,
      };
      saveLocalForm(updated);
    }
  }, [slug]);

  // Query form metadata
  const { data: formFromQuery, isLoading: isQueryLoading, error: queryError } = trpc.forms.getBySlug.useQuery(
    { slug },
    { enabled: !localFormFound }
  );

  const form = localFormFound || formFromQuery;
  const isLoading = localFormFound ? false : isQueryLoading;
  const error = localFormFound ? null : queryError;

  // Mutation
  const submitMutation = trpc.submissions.submit.useMutation();
  const sendTelegramMutation = trpc.submissions.sendTelegramNotification.useMutation();

  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Local state for answers
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  const fields: FormField[] = form?.schemaJson ? (form.schemaJson as any).fields || [] : [];
  const layoutMode = form?.schemaJson ? (form.schemaJson as any).layout?.mode || "standard" : "standard";

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

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentFields = pages[currentStepIndex] || [];
  const isLastStep = currentStepIndex === pages.length - 1;

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
      updated = current.filter((v) => v !== option);
    }
    handleInputChange(fieldId, updated);
  };

  const validateCurrentStep = () => {
    const stepValidator = buildSubmissionValidator(currentFields);
    const result = stepValidator.safeParse(answers);
    if (!result.success) {
      const formatted = result.error.format();
      const errorsMap: Record<string, string> = {};
      Object.keys(formatted).forEach((key) => {
        if (key !== "_errors" && (formatted as any)[key]?._errors?.length) {
          errorsMap[key] = (formatted as any)[key]._errors[0];
        }
      });
      setValidationErrors(errorsMap);

      toast.error(t("errorValidation"));
      setTimeout(() => {
        const firstErrorEl = document.querySelector(".text-destructive");
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);

      return false;
    }
    setValidationErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setValidationErrors({});

    if (!form || !form.schemaJson) return;

    if (!validateCurrentStep()) return; // Final step validation

    // Validate overall using the shared validator logic
    const validator = buildSubmissionValidator(fields);
    const result = validator.safeParse(answers);

    if (!result.success) {
      const formatted = result.error.format();
      const errorsMap: Record<string, string> = {};
      Object.keys(formatted).forEach((key) => {
        if (key !== "_errors" && (formatted as any)[key]?._errors?.length) {
          errorsMap[key] = (formatted as any)[key]._errors[0];
        }
      });
      setValidationErrors(errorsMap);

      toast.error(t("errorValidation"));
      setTimeout(() => {
        const firstErrorEl = document.querySelector(".text-destructive");
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);

      return;
    }

    // Process submission...
    if (localFormFound) {
      try {
        const mockSubmission = {
          id: `sub-${Math.random().toString(36).substring(2, 10)}`,
          formId: localFormFound.id,
          answersJson: result.data,
          createdAt: new Date().toISOString(),
        };
        saveLocalSubmission(mockSubmission);

        // Send Telegram Notification if enabled
        const telegram = (localFormFound.schemaJson as any)?.telegram;
        if (telegram && telegram.enabled && telegram.chatId) {
          sendTelegramMutation.mutate({
            chatId: telegram.chatId,
            formTitle: localFormFound.title,
            fields: (localFormFound.schemaJson as any).fields || [],
            answers: result.data,
          });
        }

        setIsSubmitted(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err: any) {
        setSubmitError(err.message || "Failed to submit form");
      }
      return;
    }

    try {
      await submitMutation.mutateAsync({
        formId: form.id,
        answersJson: result.data,
      });

      setIsSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit form");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-10 bg-background">
        <div className="w-full flex-1 flex items-center justify-center py-6">
          <div className="max-w-xl w-full border border-slate-200/50 p-6 md:p-8 shadow-lg bg-card rounded-xl">
            {/* Header */}
            <div className="space-y-3 mb-8">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            {/* Fields */}
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="space-y-2.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
            {/* Submit Trigger */}
            <div className="pt-6 border-t border-border mt-6">
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle visibility error blocks
  if (error || !form) {
    const isNotPublicError = error?.message?.includes("not public") || error?.message?.includes("draft") || (form && form.visibility !== "public");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="font-outfit text-2xl font-bold text-foreground">
          {isNotPublicError ? "This form is not public" : "Form Not Available"}
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          {isNotPublicError
            ? "This form is not public. Create your own form."
            : "The form you are trying to reach does not exist or has been deleted by the owner."}
        </p>
      </div>
    );
  }

  // Check embed restrictions
  const allowedDomains: string[] = form.schemaJson ? (form.schemaJson as any).allowedDomains || [] : [];
  const isEmbedded = isMounted && typeof window !== "undefined" && window.self !== window.top;
  
  let isEmbedRestricted = false;
  if (isEmbedded && allowedDomains.length > 0) {
    try {
      const referrer = document.referrer;
      if (!referrer) {
        isEmbedRestricted = true;
      } else {
        const referrerUrl = new URL(referrer);
        const referrerHost = referrerUrl.hostname.toLowerCase();
        
        const isAllowed = allowedDomains.some((domain) => {
          const cleanDomain = domain.trim().toLowerCase();
          return referrerHost === cleanDomain || referrerHost.endsWith("." + cleanDomain);
        });
        
        if (!isAllowed) {
          isEmbedRestricted = true;
        }
      }
    } catch (e) {
      isEmbedRestricted = true;
    }
  }

  if (isEmbedRestricted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="font-outfit text-2xl font-bold text-foreground">
          Embed Restricted
        </h1>
        <p className="text-muted-foreground max-w-sm text-sm">
          This form cannot be embedded on this website. Please contact the form owner or view the form directly.
        </p>
      </div>
    );
  }

  const theme = form.themeJson as any;

  // Custom theme variables mapped from database theme settings
  const customStyles = {
    "--primary": theme.primaryColor || "#4f46e5",
    "--background-color": theme.backgroundColor || "#f3f4f6",
    "--text-color": theme.textColor || "#1f2937",
    "--card-color": theme.cardColor || "#ffffff",
    "--border-radius": theme.borderRadius || "0.5rem",
    "--input-bg": theme.inputBgColor || "transparent",
    "--input-border": theme.inputBorderColor || "rgba(128,128,128,0.2)"
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-4 md:p-10 font-sans transition-colors"
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
                {currentFields.map((field) => (
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
                          className="text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "var(--input-border)",
                            backgroundColor: "var(--input-bg)"
                          }}
                        />
                      )}

                      {/* LONG TEXT */}
                      {field.type === "textarea" && (
                        <Textarea
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || "Your response..."}
                          className="text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "var(--input-border)",
                            backgroundColor: "var(--input-bg)"
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
                          className="text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "var(--input-border)",
                            backgroundColor: "var(--input-bg)"
                          }}
                        />
                      )}

                      {/* PHONE */}
                      {field.type === "phone" && (
                        <Input
                          type="tel"
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder || "+1 (555) 000-0000"}
                          className="text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "var(--input-border)",
                            backgroundColor: "var(--input-bg)"
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
                          className="max-w-[150px] text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                          style={{
                            borderRadius: "var(--border-radius)",
                            borderColor: "var(--input-border)",
                            backgroundColor: "var(--input-bg)"
                          }}
                        />
                      )}

                      {/* SINGLE SELECT */}
                      {field.type === "select" && (
                        <Select
                          value={answers[field.id] || ""}
                          onValueChange={(value) => handleInputChange(field.id, value)}
                        >
                          <SelectTrigger
                            className="w-full text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                            style={{
                              borderRadius: "var(--border-radius)",
                              borderColor: "var(--input-border)",
                              backgroundColor: "var(--input-bg)"
                            }}
                          >
                            <SelectValue placeholder="Choose option..." />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {/* MULTI SELECT */}
                      {field.type === "multiselect" && (
                        <div className="space-y-1.5 pl-1">
                          {field.options?.map((opt) => {
                            const currentAnswers = (answers[field.id] as string[]) || [];
                            const isChecked = currentAnswers.includes(opt);
                            return (
                              <label key={opt} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group">
                                <Checkbox
                                  id={`${field.id}-${opt}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => handleMultiSelectChange(field.id, opt, !!checked)}
                                  className="border-slate-300 data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)] data-[state=checked]:text-white transition-all group-hover:border-[var(--primary)]/50 focus-visible:ring-[var(--primary)]"
                                  style={{
                                    borderColor: "var(--input-border)",
                                    backgroundColor: isChecked ? "var(--primary)" : "var(--input-bg)"
                                  }}
                                />
                                <span className="font-medium select-none text-sm text-foreground">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* CHECKBOX */}
                      {field.type === "checkbox" && (
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group w-fit">
                          <Checkbox
                            id={field.id}
                            checked={answers[field.id] || false}
                            onCheckedChange={(checked) => handleCheckboxChange(field.id, !!checked)}
                            className="border-slate-300 data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)] data-[state=checked]:text-white transition-all group-hover:border-[var(--primary)]/50 focus-visible:ring-[var(--primary)]"
                            style={{
                              borderColor: "var(--input-border)",
                              backgroundColor: answers[field.id] ? "var(--primary)" : "var(--input-bg)"
                            }}
                          />
                          <span className="font-medium select-none text-sm text-foreground">I confirm this detail</span>
                        </label>
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
                            className="text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                            style={{
                              borderRadius: "var(--border-radius)",
                              borderColor: "var(--input-border)",
                              backgroundColor: "var(--input-bg)"
                            }}
                          />
                        </div>
                      )}

                      {/* TIME */}
                      {field.type === "time" && (
                        <div className="relative max-w-[150px]">
                          <Input
                            type="time"
                            value={answers[field.id] || ""}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="text-foreground bg-transparent transition-colors hover:bg-muted/10 focus:bg-transparent"
                            style={{
                              borderRadius: "var(--border-radius)",
                              borderColor: "var(--input-border)",
                              backgroundColor: "var(--input-bg)"
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
              <div className="pt-6 border-t border-slate-100 flex gap-4">
                {currentStepIndex > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={submitMutation.isLoading}
                    className="flex-1 h-11 font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center focus-visible:ring-[var(--primary)]"
                    style={{
                      borderRadius: "var(--border-radius)",
                    }}
                  >
                    Previous
                  </Button>
                )}
                
                {isLastStep ? (
                  <Button
                    type="submit"
                    disabled={submitMutation.isLoading}
                    className="flex-1 h-11 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50 focus-visible:ring-[var(--primary)]"
                    style={{
                      backgroundColor: "var(--primary)",
                      borderRadius: "var(--border-radius)",
                    }}
                  >
                    {submitMutation.isLoading ? <LoadingSpinner className="w-5 h-5" color="text-white" /> : t("submitBtn")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 h-11 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center focus-visible:ring-[var(--primary)]"
                    style={{
                      backgroundColor: "var(--primary)",
                      borderRadius: "var(--border-radius)",
                    }}
                  >
                    Next
                  </Button>
                )}
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
