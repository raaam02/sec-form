"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { FormField, buildSubmissionValidator } from "@sec-form/validators";
import { LoadingSpinner } from "@sec-form/ui";
import { CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import confetti from "canvas-confetti";

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <LoadingSpinner className="w-10 h-10" color="text-indigo-600" />
      </div>
    );
  }

  // Handle visibility error blocks
  if (error || !form) {
    const isDraftError = error?.message?.includes("draft");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6 gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h1 className="font-outfit text-2xl font-bold text-slate-800">
          {isDraftError ? "Form is a Draft" : "Form Not Available"}
        </h1>
        <p className="text-slate-500 max-w-sm text-sm">
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
      className="min-h-screen flex items-center justify-center p-4 md:p-10 font-[family-name:var(--font-family)] transition-colors"
      style-target="background"
      style={{
        ...customStyles,
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)"
      }}
    >
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
            <h1 className="font-outfit text-3xl font-extrabold text-slate-900 leading-none">Responses Submitted</h1>
            <p className="text-slate-500 text-sm max-w-xs mt-1">Thank you for taking the time to complete this questionnaire. Your responses were saved.</p>
            <button
              onClick={() => {
                setAnswers({});
                setIsSubmitted(false);
              }}
              className="mt-6 text-xs font-bold text-[color:var(--primary)] hover:underline"
            >
              Submit another response
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
              <div className="rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-sm p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Fields rendering list */}
            <div className="space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2 text-left">
                  <label className="text-sm font-semibold block">
                    {field.label} {field.required && <span className="text-rose-500">*</span>}
                  </label>
                  {field.description && <span className="text-xs opacity-60 block leading-tight">{field.description}</span>}

                  <div className="mt-1">
                    {/* SHORT TEXT */}
                    {field.type === "text" && (
                      <input
                        type="text"
                        value={answers[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || "Your answer..."}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 text-slate-900 bg-white"
                      />
                    )}

                    {/* LONG TEXT */}
                    {field.type === "textarea" && (
                      <textarea
                        value={answers[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || "Your response..."}
                        className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 text-slate-900 bg-white"
                      />
                    )}

                    {/* EMAIL */}
                    {field.type === "email" && (
                      <input
                        type="email"
                        value={answers[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder || "you@example.com"}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 text-slate-900 bg-white"
                      />
                    )}

                    {/* NUMBER */}
                    {field.type === "number" && (
                      <input
                        type="number"
                        value={answers[field.id] === undefined ? "" : answers[field.id]}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder="0"
                        className="w-full h-10 px-3 max-w-[150px] rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 text-slate-900 bg-white"
                      />
                    )}

                    {/* SINGLE SELECT */}
                    {field.type === "select" && (
                      <select
                        value={answers[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 text-slate-900 bg-white"
                      >
                        <option value="">Choose option...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {/* MULTI SELECT */}
                    {field.type === "multiselect" && (
                      <div className="space-y-1.5 pl-1">
                        {field.options?.map((opt) => {
                          const currentAnswers = (answers[field.id] as string[]) || [];
                          const isChecked = currentAnswers.includes(opt);
                          return (
                            <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleMultiSelectChange(field.id, opt, e.target.checked)}
                                className="rounded border-slate-200"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* CHECKBOX */}
                    {field.type === "checkbox" && (
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer pl-1">
                        <input
                          type="checkbox"
                          checked={answers[field.id] || false}
                          onChange={(e) => handleCheckboxChange(field.id, e.target.checked)}
                          className="rounded border-slate-200"
                        />
                        <span>I confirm this detail</span>
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
                        <input
                          type="date"
                          value={answers[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 text-slate-900 bg-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Inline Zod alert */}
                  {validationErrors[field.id] && (
                    <span className="text-xs text-rose-600 font-semibold block">{validationErrors[field.id]}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Submission triggers */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={submitMutation.isLoading}
                className="w-full h-11 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
                style={{
                  backgroundColor: "var(--primary)",
                  boxShadow: "0 10px 15px -3px rgba(var(--primary), 0.15)"
                }}
              >
                {submitMutation.isLoading ? <LoadingSpinner className="w-5 h-5" color="text-white" /> : "Submit Responses"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
