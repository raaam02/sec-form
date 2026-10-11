"use client";

import React, { useState, useMemo } from "react";
import { FORM_TEMPLATES, FormTemplate } from "@sec-form/shared";
import { Search, X } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

export interface TemplateGalleryProps {
  onUseTemplate: (templateId: string) => void | Promise<void>;
  loadingTemplateId?: string | null;
  headerSlot?: React.ReactNode;
  className?: string;
}

export function TemplateGallery({
  onUseTemplate,
  loadingTemplateId = null,
  headerSlot,
  className = "",
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<FormTemplate | null>(null);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(FORM_TEMPLATES.map((t) => t.category)))];
  }, []);

  const filteredTemplates = useMemo(() => {
    return FORM_TEMPLATES.filter((tpl) => {
      const matchCat = selectedCategory === "All" || tpl.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className={`space-y-8 ${className}`}>
      {headerSlot}

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by keyword, survey type..."
            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid or Empty State */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-muted/20 border border-border/30">
          <p className="text-muted-foreground text-sm">No templates found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-3 text-xs font-semibold text-foreground hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={setPreviewTemplate}
              onUseTemplate={onUseTemplate}
              isLoading={loadingTemplateId === template.id}
            />
          ))}
        </div>
      )}

      {/* Interactive Modal Preview */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={onUseTemplate}
        isLoading={loadingTemplateId === previewTemplate?.id}
      />
    </div>
  );
}
