import React from "react";
import Link from "next/link";
import { Sparkles, LayoutDashboard, Compass, LogOut, Code, BarChart3, PlusCircle, Shield, Lock, FileText, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "../ThemeToggle";
import { LocaleSwitcher } from "../LocaleSwitcher";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useGlobalShortcutHelp, useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import { Keyboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

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
  const showShortcutsHelp = useGlobalShortcutHelp();
  const router = useRouter();
  const [isUserPopoverOpen, setIsUserPopoverOpen] = React.useState(false);

  // Navigation Shortcuts
  useGlobalShortcut("nav-dash", "alt+1", "Go to Dashboard", () => router.push("/dashboard"), "Navigation");
  useGlobalShortcut("nav-my-forms", "alt+2", "Go to My Forms", () => router.push("/dashboard/my-forms"), "Navigation");
  useGlobalShortcut("nav-explore", "alt+3", "Go to Explore", () => router.push("/dashboard/explore"), "Navigation");
  useGlobalShortcut("nav-analytics", "alt+4", "Go to Analytics", () => router.push("/dashboard/analytics"), "Navigation");
  useGlobalShortcut("nav-admin", "alt+5", "Go to Admin", () => {
    if (user.role === "admin") {
      router.push("/dashboard/admin");
    }
  }, "Navigation");
  useGlobalShortcut("nav-feedback", "alt+6", "Go to Feedback", () => router.push("/dashboard/feedback"), "Navigation");
  
  useGlobalShortcut("user-settings", "alt+u", "User Settings", () => setIsUserPopoverOpen(prev => !prev), "Settings");

  const navItems = [
    {
      href: "/dashboard",
      label: `${t("navDashboard")} [Alt+1]`,
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/my-forms",
      label: `My Forms [Alt+2]`,
      icon: FileText,
      active: pathname === "/dashboard/my-forms" || pathname.startsWith("/dashboard/my-forms/"),
    },
    {
      href: "/dashboard/explore",
      label: `${t("navExplore")} [Alt+3]`,
      icon: Compass,
      active: pathname === "/dashboard/explore",
    },
    {
      href: "/dashboard/analytics",
      label: `${t("navAnalytics")} [Alt+4]`,
      icon: BarChart3,
      active: pathname === "/dashboard/analytics",
    },
    {
      href: "/dashboard/feedback",
      label: `${t("navFeedback")} [Alt+6]`,
      icon: MessageSquare,
      active: pathname === "/dashboard/feedback",
    },
  ];

  if (user.role === "admin") {
    navItems.push({
      href: "/dashboard/admin",
      label: `${t("navAdmin")} [Alt+5]`,
      icon: Shield,
      active: pathname === "/dashboard/admin",
    });
  }

  return (
    <aside className="hidden md:flex md:w-20 bg-sidebar border-r border-border flex-col justify-between shrink-0 transition-all duration-200">
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* Brand header - same height as fixed headers (h-16) */}
          <div className="h-16 border-b border-border flex items-center justify-center shrink-0 bg-sidebar">
            <Logo showText={false} size="sm" />
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                      whileTap={{ scale: 0.95, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                    >
                      <Link
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
                      </Link>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={14}>{item.label}</TooltipContent>
                </Tooltip>
              );
            })}

            {/* Create Form Button (opens Modal) */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                  whileTap={{ scale: 0.95, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group relative flex items-center justify-center h-10 w-12 mx-auto rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground p-0"
                  >
                    <PlusCircle className="h-[22px] w-[22px] shrink-0 transition-colors duration-200 group-hover:text-primary" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={14}>{t("newForm")} [N]</TooltipContent>
            </Tooltip>
          </nav>
        </div>

        {/* Sticky Bottom Menus */}
        <div className="p-4 border-t border-border space-y-2">
          {/* Keyboard Shortcuts */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                whileTap={{ scale: 0.95, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={showShortcutsHelp}
                  className="group relative flex items-center justify-center h-10 w-12 mx-auto rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground p-0"
                >
                  <Keyboard className="h-5 w-5 shrink-0 transition-colors duration-200 group-hover:text-primary" />
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={14}>Shortcuts [Ctrl + Space]</TooltipContent>
          </Tooltip>

          {/* API Docs */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.12 } }}
                whileTap={{ scale: 0.95, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
              >
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center h-10 w-12 mx-auto rounded-xl text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <Code className="h-5 w-5 shrink-0 transition-colors duration-200 group-hover:text-primary" />
                </a>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={14}>{t("navDocs")}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-border flex flex-col items-center justify-center shrink-0 relative">
        <Popover open={isUserPopoverOpen} onOpenChange={setIsUserPopoverOpen}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="relative">
                <PopoverTrigger asChild>
                  <button
                    className="h-9 w-9 rounded-full bg-muted overflow-hidden shrink-0 ring-1 ring-border hover:ring-primary focus:outline-none transition-all block"
                  >
                    <img
                      src={user.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </button>
                </PopoverTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={14}>User Settings [Alt+U]</TooltipContent>
          </Tooltip>
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
                <span>{t("themeLabel")} [Ctrl + M]</span>
                <ThemeToggle className="h-7 w-7 rounded-lg" />
              </div>
              <div className="flex items-center justify-between px-2 py-1 text-xs text-muted-foreground border-b border-border pb-2">
                <span>Language</span>
                <LocaleSwitcher />
              </div>
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
    </aside>
  );
}
