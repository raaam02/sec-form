import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Share2,
  LogIn,
  X,
  Palette,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BuilderHeaderProps {
  title: string;
  description: string | null;
  saveStatus: "saving" | "error" | "saved" | "idle";
  visibility: "draft" | "public" | "unlisted";
  handleUpdateVisibility: (mode: "draft" | "public" | "unlisted") => void;
  setIsShareModalOpen: (open: boolean) => void;
  publicFormUrl: string;
  hasUnpublishedChanges: boolean;
  handlePublish: () => void;
  isPublishing: boolean;
  onExit?: () => void;
  activeSidebar?: "theme" | "settings" | null;
  onToggleSidebar?: (target: "theme" | "settings") => void;
  isPublicBuilder?: boolean;
}

export function BuilderHeader({
  title,
  description,
  saveStatus,
  visibility,
  handleUpdateVisibility,
  setIsShareModalOpen,
  publicFormUrl,
  hasUnpublishedChanges,
  handlePublish,
  isPublishing,
  onExit,
  activeSidebar,
  onToggleSidebar,
  isPublicBuilder,
}: BuilderHeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations("Builder");

  const backHref = session?.user ? "/dashboard" : "/";

  return (
    <header className="h-14 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 sm:px-6 shrink-0 flex items-center justify-between gap-3 transition-colors duration-200">
      {/* Left: Back button + Form title + Save status indicator */}
      <div className="flex items-center gap-2.5 min-w-0">
        {onExit ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="h-8 w-8 rounded-lg text-muted-foreground shrink-0 hover:text-foreground hover:bg-muted/60 cursor-pointer shadow-none"
            title="Exit builder"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        ) : (
          <Link href={backHref}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground shrink-0 hover:text-foreground hover:bg-muted/60 shadow-none cursor-pointer"
              title={session?.user ? t("backToDashboard") : "Back to Home"}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-outfit text-sm sm:text-base font-bold text-foreground truncate max-w-[140px] sm:max-w-xs md:max-w-sm">
            {title || t("canvasTitlePlaceholder")}
          </h1>
          {/* Continuous saving indicator placed directly after form title */}
          <div className="text-xs font-normal select-none shrink-0 flex items-center">
            {saveStatus === "saving" ? (
              <span className="text-muted-foreground flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                <span className="hidden sm:inline">{t("saving")}</span>
              </span>
            ) : saveStatus === "error" ? (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="h-3 w-3" />
                <span className="hidden sm:inline">{t("unsavedChanges")}</span>
              </span>
            ) : (
              <span className="text-muted-foreground/70 flex items-center gap-1 font-medium">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span className="hidden sm:inline">{t("saved")}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls: Theme & Settings togglers + Share + Preview + Publish */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Theme Toggler */}
        {onToggleSidebar && (
          <Button
            variant={activeSidebar === "theme" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onToggleSidebar("theme")}
            className={cn(
              "h-8 px-2.5 rounded-lg gap-1.5 text-xs font-medium transition-all shadow-none",
              activeSidebar === "theme"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
            title="Customize theme & styling"
          >
            <Palette className="h-3.5 w-3.5 text-purple-500" />
            <span className="hidden sm:inline">Theme</span>
          </Button>
        )}

        {/* Settings Toggler */}
        {onToggleSidebar && !isPublicBuilder && (
          <Button
            variant={activeSidebar === "settings" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onToggleSidebar("settings")}
            className={cn(
              "h-8 px-2.5 rounded-lg gap-1.5 text-xs font-medium transition-all shadow-none",
              activeSidebar === "settings"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
            title="Form settings & configuration"
          >
            <Settings className="h-3.5 w-3.5 text-rose-500" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        )}

        {/* Share Button (triggers modal) */}
        {(visibility === "public" || visibility === "unlisted") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareModalOpen(true)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shadow-none"
                title={t("share")}
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share / Embed [Ctrl + E]</TooltipContent>
          </Tooltip>
        )}

        {/* Live Preview Button (without icon, subtle) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 sm:px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shadow-none"
              asChild
            >
              <a href={publicFormUrl} target="_blank" rel="noopener noreferrer">
                <span>{t("preview")}</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview Form [Ctrl + P]</TooltipContent>
        </Tooltip>

        {/* Publish Button (without upload icon, shadow removed, subtle when disabled) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={!hasUnpublishedChanges || isPublishing}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all shadow-none",
                hasUnpublishedChanges
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  : "bg-muted/60 text-muted-foreground/60 cursor-not-allowed"
              )}
            >
              {isPublishing && <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />}
              <span>Publish</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasUnpublishedChanges ? "Publish changes to live form" : "All changes published"}
          </TooltipContent>
        </Tooltip>

        {!session?.user && (
          <Link href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "")}`} passHref>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/60 transition-colors shadow-none"
            >
              <LogIn className="h-3.5 w-3.5 text-primary mr-1.5" />
              <span>Log In</span>
            </Button>
          </Link>
        )}

        {onExit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={onExit}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors ml-0.5 cursor-pointer shadow-none"
                title="Exit Builder"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exit Builder</TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
}
