import React from "react";
import Link from "next/link";
import { FileText, Eye, BarChart2, Sparkles, Trash2, ArrowRight, Pencil } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface FormCard {
  id: string;
  title: string;
  description?: string | null;
  visibility: string;
  slug: string;
}

interface FormCardGridProps {
  formsList: FormCard[] | undefined;
  isFormsLoading: boolean;
  setSelectedFormForDrawer: (form: FormCard) => void;
  handleDeleteForm: (id: string) => void;
  setIsAIModalOpen: (open: boolean) => void;
}

export function FormCardGrid({
  formsList,
  isFormsLoading,
  setSelectedFormForDrawer,
  handleDeleteForm,
  setIsAIModalOpen,
}: FormCardGridProps) {
  const t = useTranslations("Dashboard");

  const getVisibilityClass = (vis: string) => {
    switch (vis) {
      case "public":
        return "bg-success/10 text-success border-success/20";
      case "unlisted":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isFormsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner className="w-8 h-8" color="text-primary" />
      </div>
    );
  }

  if (!formsList || formsList.length === 0) {
    return (
      <Card className="rounded-2xl border border-dashed border-border bg-card py-16 text-center max-w-xl mx-auto p-6 shadow-sm">
        <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
        <h3 className="mt-4 font-outfit font-bold text-foreground">{t("noFormsTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground px-4">
          {t("noFormsDesc")}
        </p>
        <Button
          onClick={() => setIsAIModalOpen(true)}
          className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary text-primary-foreground shadow-sm"
        >
          <Sparkles className="h-4 w-4" /> {t("generateAi")}
        </Button>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formsList.map((form) => (
          <Card
            key={form.id}
            onClick={() => setSelectedFormForDrawer(form)}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-border/80 transition-all flex flex-col justify-between relative group cursor-pointer text-card-foreground"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${getVisibilityClass(form.visibility)}`}>
                  {form.visibility}
                </span>
                
                {/* Delete Button with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteForm(form.id);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("cardDelete")}</TooltipContent>
                </Tooltip>
              </div>

              <h3 className="mt-4 font-outfit text-lg font-bold text-foreground truncate">{form.title}</h3>
              <p className="mt-1.5 text-muted-foreground text-sm line-clamp-2 min-h-[40px]">{form.description || "No description."}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity">
                {t("cardOpen")} <ArrowRight className="h-3.5 w-3.5" />
              </span>

              <div className="flex gap-2">
                {/* Edit Button with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      asChild
                    >
                      <Link href={`/dashboard/builder/${form.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Form</TooltipContent>
                </Tooltip>

                {/* View Public Button with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      asChild
                    >
                      <Link href={`/f/${form.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("cardPublicLink")}</TooltipContent>
                </Tooltip>

                {/* View Analytics Button with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      asChild
                    >
                      <Link href={`/dashboard/builder/${form.id}?tab=analytics`}>
                        <BarChart2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("cardAnalytics")}</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
