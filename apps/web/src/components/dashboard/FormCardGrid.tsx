import React from "react";
import Link from "next/link";
import { FileText, Eye, BarChart2, Sparkles, Trash2, ArrowRight, Pencil } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { ConfirmationPopover } from "@/components/ui/confirmation-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween" as const,
      ease: "linear" as const,
      duration: 0.2,
    }
  }
};

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
  isSidebarOpen?: boolean;
}

export function FormCardGrid({
  formsList,
  isFormsLoading,
  setSelectedFormForDrawer,
  handleDeleteForm,
  setIsAIModalOpen,
  isSidebarOpen = false,
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

  const gridColsClass = isSidebarOpen
    ? "grid-cols-1 lg:grid-cols-2"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  if (isFormsLoading) {
    return (
      <div className={`grid gap-6 ${gridColsClass}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-[216px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
              <Skeleton className="h-6 w-3/4 mt-4" />
              <div className="space-y-2 mt-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-12" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </Card>
        ))}
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid gap-6 ${gridColsClass}`}
      >
        {formsList.map((form) => (
          <motion.div
            key={form.id}
            variants={cardVariants}
            whileHover={{
              y: -3,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
              transition: { type: "tween" as const, ease: "linear" as const, duration: 0.15 }
            }}
            whileTap={{ scale: 0.99, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
            onClick={() => setSelectedFormForDrawer(form)}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-border/80 transition-colors flex flex-col justify-between relative group cursor-pointer text-card-foreground"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${getVisibilityClass(form.visibility)}`}>
                  {form.visibility}
                </span>
                
                <ConfirmationPopover
                  title={t("cardConfirmDelete")}
                  description="This will permanently delete the form."
                  confirmText="Delete"
                  onConfirm={() => handleDeleteForm(form.id)}
                >
                  <motion.div
                    whileHover={{ scale: 1.08, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                    whileTap={{ scale: 0.92, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                        e.nativeEvent.stopPropagation();
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                        e.nativeEvent.stopPropagation();
                      }
                    }}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center justify-center"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </ConfirmationPopover>
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
                    <motion.div
                      whileHover={{ scale: 1.08, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                      whileTap={{ scale: 0.92, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                          e.nativeEvent.stopPropagation();
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                          e.nativeEvent.stopPropagation();
                        }
                      }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <Link href={`/dashboard/builder/${form.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>Edit Form</TooltipContent>
                </Tooltip>

                {/* View Public Button with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.08, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                      whileTap={{ scale: 0.92, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                          e.nativeEvent.stopPropagation();
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                          e.nativeEvent.stopPropagation();
                        }
                      }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <Link href={`/f/${form.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>{t("cardPublicLink")}</TooltipContent>
                </Tooltip>

                {/* View Analytics Button with Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.08, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                      whileTap={{ scale: 0.92, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                          e.nativeEvent.stopPropagation();
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopPropagation) {
                          e.nativeEvent.stopPropagation();
                        }
                      }}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <Link href={`/dashboard/builder/${form.id}?tab=analytics`}>
                          <BarChart2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>{t("cardAnalytics")}</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
