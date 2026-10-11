import React from "react";
import { FormTemplate } from "@sec-form/shared";
import { Eye, ArrowRight, Loader2 } from "lucide-react";
import { getTemplateIcon, getTemplateColorScheme } from "./templateConstants";

export interface TemplateCardProps {
  template: FormTemplate;
  onPreview: (template: FormTemplate) => void;
  onUseTemplate: (templateId: string) => void;
  isLoading?: boolean;
}

export function TemplateCard({
  template,
  onPreview,
  onUseTemplate,
  isLoading = false,
}: TemplateCardProps) {
  const IconComponent = getTemplateIcon(template.id);
  const styling = getTemplateColorScheme(template.id);

  return (
    <div className="group rounded-3xl border border-border/40 bg-card/60 p-6 flex flex-col justify-between transition-all duration-300 hover:border-border hover:bg-card/90 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
      <div>
        <div className="flex items-center justify-between">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styling.iconBg} ${styling.textColor} transition-transform group-hover:scale-105 duration-200`}
          >
            <IconComponent className="h-5 w-5" />
          </span>
          <span className="text-[11px] font-medium text-muted-foreground/80">
            {template.fields.length} questions
          </span>
        </div>

        <h3 className="mt-4 font-outfit text-lg font-bold text-foreground">
          {template.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {template.description}
        </p>

        {/* Clean Visual Preview */}
        <div className="mt-4 rounded-2xl bg-muted/40 p-3.5 space-y-2">
          {template.fields.slice(0, 2).map((f) => (
            <div key={f.id} className="space-y-1">
              <span className="text-[10px] font-medium text-muted-foreground truncate block">
                {f.label} {f.required && <span className="text-rose-500">*</span>}
              </span>
              <div className="h-7 w-full rounded-xl bg-background/60 px-2.5 text-[10px] text-muted-foreground flex items-center select-none pointer-events-none truncate">
                {f.placeholder || `Enter ${f.label.toLowerCase()}...`}
              </div>
            </div>
          ))}
          <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground/70">
            <span>+{template.fields.length - 2} more fields</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Preview & Use Template */}
      <div className="mt-5 pt-3.5 border-t border-border/30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted text-foreground py-2.5 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => onUseTemplate(template.id)}
          className="flex-1 group/btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-foreground text-background hover:opacity-90 disabled:opacity-50 py-2.5 px-3 text-xs font-semibold transition-opacity shadow-xs cursor-pointer disabled:cursor-not-allowed"
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
    </div>
  );
}
