import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  ChevronDown, 
  Check, 
  Share2, 
  ExternalLink, 
  Globe, 
  EyeOff, 
  Lock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface BuilderHeaderProps {
  title: string;
  description: string | null;
  saveStatus: "saving" | "error" | "saved" | "idle";
  visibility: "draft" | "public" | "unlisted";
  handleUpdateVisibility: (mode: "draft" | "public" | "unlisted") => void;
  setIsShareModalOpen: (open: boolean) => void;
  publicFormUrl: string;
}

export function BuilderHeader({
  title,
  description,
  saveStatus,
  visibility,
  handleUpdateVisibility,
  setIsShareModalOpen,
  publicFormUrl,
}: BuilderHeaderProps) {
  const t = useTranslations("Builder");
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

  const getVisibilityIcon = (vis: string) => {
    switch (vis) {
      case "public": return <Globe className="h-3.5 w-3.5" />;
      case "unlisted": return <EyeOff className="h-3.5 w-3.5" />;
      default: return <Lock className="h-3.5 w-3.5" />;
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 shrink-0 flex items-center justify-between gap-4 transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/dashboard" passHref>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-xl border border-border bg-card text-muted-foreground shrink-0"
            title={t("backToDashboard")}
            asChild
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="font-outfit text-base font-bold text-foreground truncate max-w-[180px] sm:max-w-xs md:max-w-md">{title || t("canvasTitlePlaceholder")}</h1>
          <p className="text-muted-foreground text-[10px] truncate max-w-[180px] sm:max-w-xs md:max-w-md mt-0.5">{description || t("canvasDescPlaceholder")}</p>
        </div>
      </div>

      {/* Share actions & Save indicators */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Continuous saving indicator */}
        <div className="text-xs font-semibold select-none mr-2 hidden sm:block">
          {saveStatus === "saving" ? (
            <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-bold">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> {t("saving")}
            </span>
          ) : saveStatus === "error" ? (
            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-bold">
              <AlertCircle className="h-3.5 w-3.5" /> {t("unsavedChanges")}
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
              <CheckCircle className="h-3.5 w-3.5" /> {t("saved")}
            </span>
          )}
        </div>

        {/* Visibility Dropdown Selector */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
            className="h-9 items-center gap-1.5 rounded-xl border border-border bg-card text-xs font-bold text-muted-foreground transition-colors"
          >
            {getVisibilityIcon(visibility)}
            <span className="capitalize hidden xs:inline">{visibility}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>

          {showVisibilityDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowVisibilityDropdown(false)} />
              <div className="absolute right-0 mt-2 z-50 w-40 rounded-xl border border-border bg-popover text-popover-foreground p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                {(["draft", "public", "unlisted"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setShowVisibilityDropdown(false);
                      handleUpdateVisibility(mode);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                      visibility === mode
                        ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <span className="capitalize">{mode}</span>
                    {visibility === mode && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Share Button (triggers modal) */}
        {(visibility === "public" || visibility === "unlisted") && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsShareModalOpen(true)}
            className="h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors"
            title={t("share")}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
        
        {/* Live Preview Redirection Link */}
        <Button
          size="sm"
          className="h-9 items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-sm transition-colors"
          asChild
        >
          <a href={publicFormUrl} target="_blank" rel="noopener noreferrer">
            <span>{t("preview")}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </header>
  );
}
