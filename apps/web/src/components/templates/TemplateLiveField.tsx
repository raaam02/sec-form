import React from "react";
import { FormFieldTemplate } from "@sec-form/shared";
import { Star, ChevronDown, Check } from "lucide-react";

export function TemplateLiveField({
  field,
  primaryColor,
}: {
  field: FormFieldTemplate;
  primaryColor: string;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          rows={3}
          disabled
          placeholder={field.placeholder || "Enter details..."}
          className="w-full p-3 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl outline-none resize-none select-none placeholder:opacity-40"
        />
      );
    case "rating":
      return (
        <div className="flex gap-2 items-center py-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="h-5 w-5"
              style={{
                fill: star <= 4 ? primaryColor : "transparent",
                color: star <= 4 ? primaryColor : "currentColor",
                opacity: star <= 4 ? 1 : 0.25,
              }}
            />
          ))}
          <span className="text-xs opacity-60 ml-2">4 / 5</span>
        </div>
      );
    case "select":
    case "multiselect":
      return (
        <div className="w-full h-10 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-between opacity-80 select-none">
          <span className="truncate">
            {field.options && field.options.length > 0
              ? field.options[0]
              : "Select an option..."}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center gap-2.5 py-1 select-none">
          <div
            className="h-4 w-4 rounded-md border flex items-center justify-center"
            style={{
              backgroundColor: primaryColor,
              borderColor: primaryColor,
            }}
          >
            <Check className="h-3 w-3 text-white stroke-[3]" />
          </div>
          <span className="text-xs font-medium opacity-90">{field.label}</span>
        </div>
      );
    case "date":
      return (
        <input
          type="text"
          disabled
          placeholder="YYYY-MM-DD"
          className="w-full h-10 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl outline-none select-none placeholder:opacity-40"
        />
      );
    default:
      return (
        <input
          type="text"
          disabled
          placeholder={
            field.placeholder || `Enter ${field.label.toLowerCase()}...`
          }
          className="w-full h-10 px-3.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl outline-none select-none placeholder:opacity-40"
        />
      );
  }
}
