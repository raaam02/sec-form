"use client";

import React, { useState, useEffect } from "react";
import {
  ExpandableScreen,
  ExpandableScreenTrigger,
  ExpandableScreenContent,
} from "@/components/ui/expandable-screen";
import { UnifiedFormBuilder } from "./UnifiedFormBuilder";
import { saveLocalForm, getLocalForm } from "@/utils/localForms";
import { Sparkles, ArrowRight } from "lucide-react";

interface ImmersiveGuestBuilderProps {
  children?: React.ReactNode;
  triggerClassName?: string;
  defaultPrompt?: string;
  layoutId?: string;
}

export function ImmersiveGuestBuilder({
  children,
  triggerClassName,
  defaultPrompt,
  layoutId = "guest-builder-screen",
}: ImmersiveGuestBuilderProps) {
  const [formId, setFormId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Initialize or retrieve guest form on open
  useEffect(() => {
    if (isExpanded && !formId) {
      const newId = crypto.randomUUID();
      const now = new Date().toISOString();
      const initialForm = {
        id: newId,
        title: defaultPrompt ? defaultPrompt.slice(0, 40) : "Untitled Form",
        description: defaultPrompt || "",
        slug: `form-${Math.random().toString(36).substring(2, 8)}`,
        visibility: "draft" as const,
        schemaJson: {
          fields: [
            {
              id: crypto.randomUUID(),
              type: "text" as const,
              label: defaultPrompt ? "Please provide your details" : "What is your name?",
              required: true,
              placeholder: "Type your answer here...",
            },
            {
              id: crypto.randomUUID(),
              type: "email" as const,
              label: "What is your email address?",
              required: true,
              placeholder: "name@example.com",
            },
          ],
          layout: { mode: "standard" as const },
        },
        userId: "local-user",
        createdAt: now,
        updatedAt: now,
        totalViews: 0,
        totalResponses: 0,
      };
      saveLocalForm(initialForm);
      setFormId(newId);
    }
  }, [isExpanded, formId, defaultPrompt]);

  return (
    <ExpandableScreen
      layoutId={layoutId}
      expanded={isExpanded}
      onExpandChange={setIsExpanded}
      triggerRadius="14px"
      contentRadius="28px"
      animationDuration={0.35}
    >
      <ExpandableScreenTrigger className={triggerClassName}>
        {children || (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Building Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </ExpandableScreenTrigger>

      <ExpandableScreenContent
        className="w-full max-w-7xl h-[92vh] max-h-[960px] my-auto mx-auto rounded-[28px] border border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/[0.08]"
        showCloseButton={false}
      >
        {formId ? (
          <UnifiedFormBuilder
            id={formId}
            isExpandable={true}
            onExit={() => setIsExpanded(false)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-background">
            <span className="text-sm text-muted-foreground animate-pulse">
              Preparing canvas...
            </span>
          </div>
        )}
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}
