import React from "react";
import Link from "next/link";
import { LayoutDashboard, Compass, BarChart3, PlusCircle, Code, LogOut, Shield, Lock, MessageSquare } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { LocaleSwitcher } from "../LocaleSwitcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";

interface DashboardMobileHeaderProps {
  pathname: string;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsChangePasswordModalOpen: (open: boolean) => void;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
  onSignOut: () => void;
}

export function DashboardMobileHeader({
  pathname,
  setIsCreateModalOpen,
  setIsChangePasswordModalOpen,
  user,
  onSignOut,
}: DashboardMobileHeaderProps) {
  const t = useTranslations("Dashboard");

  return (
    <header className="h-16 border-b border-border bg-card md:hidden flex items-center justify-between px-6 shrink-0 transition-colors duration-200 relative">
      <Logo size="sm" />
      
      <div className="flex items-center gap-4">
        {/* Quick Navigation Icons on Mobile */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            title={t("navDashboard")}
            className={`p-2 rounded-lg transition-all ${
              pathname === "/dashboard"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/dashboard/explore"
            title={t("navExplore")}
            className={`p-2 rounded-lg transition-all ${
              pathname === "/dashboard/explore"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Compass className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/dashboard/analytics"
            title={t("navAnalytics")}
            className={`p-2 rounded-lg transition-all ${
              pathname === "/dashboard/analytics"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <BarChart3 className="h-4.5 w-4.5" />
          </Link>
          {user.role === "admin" && (
            <Link
              href="/dashboard/admin"
              title={t("navAdmin")}
              className={`p-2 rounded-lg transition-all ${
                pathname === "/dashboard/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Shield className="h-4.5 w-4.5" />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-8.5 w-8.5 p-0 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={t("newForm")}
          >
            <PlusCircle className="h-[20px] w-[20px]" />
          </Button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className="h-8 w-8 rounded-full bg-muted overflow-hidden shrink-0 ring-1 ring-border focus:outline-none"
            >
              <img
                src={user.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-64 rounded-xl border border-border bg-popover text-popover-foreground p-4 shadow-xl mt-2 mr-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 border-b border-border pb-3 mb-3">
              <img
                src={user.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
                alt="Avatar"
                className="h-9 w-9 rounded-full bg-muted object-cover ring-1 ring-border"
              />
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-bold text-foreground truncate">{user.name || "User"}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email || ""}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground">
                <span>{t("themeLabel")}</span>
                <ThemeToggle className="h-7 w-7 rounded-lg" />
              </div>
              <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground border-b border-border pb-2">
                <span>Language</span>
                <LocaleSwitcher />
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Code className="h-4 w-4 text-muted-foreground" />
                <span>{t("navDocs")}</span>
              </a>
              <Link
                href="/dashboard/feedback"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{t("navFeedback")}</span>
              </Link>
              {user.email !== "demo@demo.com" && (
                <Button
                  variant="ghost"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors text-left justify-start h-auto text-foreground"
                >
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span>Change Password</span>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={onSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors text-left justify-start h-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("signOut")}</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
