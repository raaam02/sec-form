"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { trpc } from "../../../utils/trpc";
import { saveLocalForm, LocalForm } from "../../../utils/localForms";
import { FORM_TEMPLATES, BUILTIN_THEMES } from "@sec-form/shared";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TemplateGallery } from "@/components/templates";

export default function DashboardExplorePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const isDemo = session?.user?.email === "demo@demo.com";
  const t = useTranslations("Dashboard");

  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const createFormMutation = trpc.forms.create.useMutation();
  const updateFormMutation = trpc.forms.update.useMutation();

  const handleUseTemplate = async (templateId: string) => {
    const template = FORM_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setLoadingTemplateId(templateId);
    setErrorMessage("");

    try {
      const formTheme =
        BUILTIN_THEMES.find((th) => th.id === template.themeId) ||
        BUILTIN_THEMES[0];

      if (isDemo) {
        const id = crypto.randomUUID();
        const localForm: LocalForm = {
          id,
          title: template.title,
          description: template.description,
          slug: `form-${Math.random().toString(36).substring(2, 8)}`,
          visibility: "draft",
          schemaJson: { fields: template.fields as any },
          themeJson: formTheme as any,
          userId: "demo-user-id",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveLocalForm(localForm);
        toast.success("Template created successfully!");
        router.push(`/dashboard/my-forms/${id}/edit`);
        return;
      }

      // 1. Create a blank form
      const newForm = await createFormMutation.mutateAsync({
        title: template.title,
        description: template.description,
      });

      // 2. Update with template fields & theme
      await updateFormMutation.mutateAsync({
        id: newForm.id,
        schemaJson: { fields: template.fields as any },
        themeJson: formTheme as any,
        visibility: "draft",
      });

      toast.success("Template created successfully!");
      router.push(`/dashboard/my-forms/${newForm.id}/edit`);
    } catch (e: any) {
      const msg = e.message || "Failed to create form from template";
      setErrorMessage(msg);
      toast.error(msg);
      setLoadingTemplateId(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-transparent text-foreground">
      <DashboardHeader title={t("navExplore")} />

      {errorMessage && (
        <div className="mx-6 sm:mx-8 mt-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3.5 flex items-center gap-2 shrink-0">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Scrollable Body area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
        <div className="max-w-6xl mx-auto pb-12">
          <TemplateGallery
            onUseTemplate={handleUseTemplate}
            loadingTemplateId={loadingTemplateId}
            headerSlot={
              <div className="text-center max-w-2xl mx-auto space-y-1 mb-8">
                <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Template Gallery
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Choose from professionally designed form templates and customize them to fit your workflow.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
