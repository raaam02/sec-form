import React from "react";
import Link from "next/link";
import { Sparkles, LayoutDashboard, Compass, LogOut, Code, BarChart3, PlusCircle, Shield, Lock } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { LocaleSwitcher } from "../LocaleSwitcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DashboardSidebarProps {
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

export function DashboardSidebar({
  pathname,
  setIsCreateModalOpen,
  setIsChangePasswordModalOpen,
  user,
  onSignOut,
}: DashboardSidebarProps) {
  const t = useTranslations("Dashboard");

  const navItems = [
    {
      href: "/dashboard",
      label: t("navDashboard"),
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/explore",
      label: t("navExplore"),
      icon: Compass,
      active: pathname === "/dashboard/explore",
    },
    {
      href: "/dashboard/analytics",
      label: t("navAnalytics"),
      icon: BarChart3,
      active: pathname === "/dashboard/analytics",
    },
  ];

  if (user.role === "admin") {
    navItems.push({
      href: "/dashboard/admin",
      label: t("navAdmin"),
      icon: Shield,
      active: pathname === "/dashboard/admin",
    });
  }

  return (
    <aside className="hidden md:flex md:w-20 bg-card border-r border-border flex-col justify-between shrink-0 transition-all duration-200">
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Brand header - same height as fixed headers (h-16) */}
          <div className="h-16 border-b border-border flex items-center justify-center shrink-0 bg-card">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 shrink-0 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center justify-center h-10 w-12 mx-auto rounded-xl text-sm font-semibold transition-all ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                    item.active
                      ? "text-primary"
                      : "group-hover:text-primary"
                  }`} />
                  {/* Tooltip on hover */}
                  <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 font-medium whitespace-nowrap shadow-lg border border-slate-700/50 z-50 pointer-events-none">
                    {item.label}
                  </div>
                </Link>
              );
            })}

            {/* Create Form Button (opens Modal) */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative flex items-center justify-center h-10 w-12 mx-auto rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground p-0"
            >
              <PlusCircle className="h-5 w-5 shrink-0 transition-colors duration-200 group-hover:text-primary" />
              {/* Tooltip on hover */}
              <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 font-medium whitespace-nowrap shadow-lg border border-slate-700/50 z-50 pointer-events-none">
                {t("newForm")}
              </div>
            </Button>
          </nav>
        </div>

        {/* Sticky Bottom Docs Menu */}
        <div className="p-4 border-t border-border">
          <a
            href="http://localhost:4000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center h-10 w-12 mx-auto rounded-xl text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
          >
            <Code className="h-5 w-5 shrink-0 transition-colors duration-200 group-hover:text-primary" />
            {/* Tooltip on hover */}
            <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 font-medium whitespace-nowrap shadow-lg border border-slate-700/50 z-50 pointer-events-none">
              {t("navDocs")}
            </div>
          </a>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-border flex flex-col items-center justify-center shrink-0 relative">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="h-9 w-9 rounded-full bg-muted overflow-hidden shrink-0 ring-1 ring-border hover:ring-primary focus:outline-none transition-all"
              title="User Settings"
            >
              <img
                src={user.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="end" className="w-64 rounded-xl border border-border bg-popover text-popover-foreground p-4 shadow-xl mb-4 ml-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
              <Button
                variant="ghost"
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors text-left justify-start h-auto text-foreground"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Change Password</span>
              </Button>
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
    </aside>
  );
}
