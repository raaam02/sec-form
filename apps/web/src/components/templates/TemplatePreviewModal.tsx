"use client";

import React, { useRef, useMemo } from "react";
import { FormTemplate } from "@sec-form/shared";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useClickOutside } from "@/components/ui/popover-form";
import { useTheme } from "@/components/ThemeProvider";
import { TemplateLiveField } from "./TemplateLiveField";
import { getComputedTemplateTheme } from "./templateConstants";

export interface TemplatePreviewModalProps {
  template: FormTemplate | null;
  onClose: () => void;
  onUseTemplate: (templateId: string) => void;
  isLoading?: boolean;
}

export function TemplatePreviewModal({
  template,
  onClose,
  onUseTemplate,
  isLoading = false,
}: TemplatePreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose);
  const { theme } = useTheme();

  const previewTheme = useMemo(() => {
    return getComputedTemplateTheme(template, theme);
  }, [template, theme]);

  return (
    <AnimatePresence>
      {template && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Dialog with Spring Motion */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              duration: 0.4,
              bounce: 0,
            }}
            className="relative z-10 w-full max-w-2xl rounded-[28px] pb-6 bg-card border border-border/60 shadow-2xl max-h-[90vh] flex flex-col justify-between overflow-hidden outline-none"
          >
            {/* Live Form Canvas Inside Modal */}
            <div
              className="rounded-[28px] p-6 sm:p-8 border border-border/30 shadow-sm space-y-5 transition-all overflow-y-auto flex-1 custom-scrollbar"
              style={{
                backgroundColor: previewTheme.backgroundColor,
                color: previewTheme.textColor,
              }}
            >
              <div
                className="rounded-3xl p-5 sm:p-7 space-y-5 border border-border dark:border-border/40"
                style={{
                  backgroundColor: previewTheme.cardColor,
                  color: previewTheme.textColor,
                }}
              >
                <div className="border-b border-black/10 dark:border-white/10 pb-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg tracking-tight">
                      {template.title}
                    </h3>
                    <p className="text-xs opacity-75 mt-0.5">
                      {template.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Render every field as an actual form input */}
                <div className="space-y-4">
                  {template.fields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      {field.type !== "checkbox" && (
                        <label className="text-xs font-semibold opacity-90 block">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-rose-500">*</span>
                          )}
                        </label>
                      )}
                      {field.description && (
                        <p className="text-[11px] opacity-70">
                          {field.description}
                        </p>
                      )}
                      <TemplateLiveField
                        field={field}
                        primaryColor={previewTheme.primaryColor}
                      />
                    </div>
                  ))}

                  {/* Simulated submit button */}
                  <div
                    className="w-full h-10 rounded-xl text-xs font-semibold text-white flex items-center justify-center shadow-md mt-6 select-none"
                    style={{
                      backgroundColor: previewTheme.primaryColor,
                    }}
                  >
                    Submit
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 flex items-center justify-end gap-3 px-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border/40 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  const id = template.id;
                  onClose();
                  onUseTemplate(id);
                }}
                className="group/btn inline-flex h-9 items-center gap-1.5 px-5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Use Template</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
