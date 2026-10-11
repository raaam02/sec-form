import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Compass,
  BarChart3,
  Plus,
  Menu,
  Code,
  LogOut,
  Shield,
  Lock,
  MessageSquare,
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { LocaleSwitcher } from "../LocaleSwitcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    {
      href: "/dashboard",
      label: t("navDashboard") || "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/my-forms",
      label: "My Forms",
      icon: FileText,
      active: pathname === "/dashboard/my-forms" || pathname.startsWith("/dashboard/my-forms/"),
    },
    {
      href: "/dashboard/explore",
      label: t("navExplore") || "Explore",
      icon: Compass,
      active: pathname === "/dashboard/explore",
    },
    {
      href: "/dashboard/analytics",
      label: t("navAnalytics") || "Analytics",
      icon: BarChart3,
      active: pathname === "/dashboard/analytics",
    },
    {
      href: "/dashboard/feedback",
      label: t("navFeedback") || "Feedback",
      icon: MessageSquare,
      active: pathname === "/dashboard/feedback",
    },
  ];

  if (user.role === "admin") {
    navLinks.push({
      href: "/dashboard/admin",
      label: t("navAdmin") || "Admin",
      icon: Shield,
      active: pathname === "/dashboard/admin",
    });
  }

  return (
    <header className="h-16 border-b border-border bg-card md:hidden flex items-center justify-between px-4 sm:px-6 shrink-0 transition-colors duration-200 relative z-30">
      {/* Brand: Logo */}
      <Link href="/dashboard" className="flex items-center shrink-0">
        <Logo showText={false} size="sm" />
      </Link>

      {/* Header Actions: Primary + New Form button FIRST, Hamburger Menu LAST */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="h-9 items-center gap-1.5 rounded-xl bg-foreground px-3 text-xs font-semibold text-background shadow-sm hover:opacity-90 active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Form</span>
        </Button>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-border bg-card hover:bg-accent text-foreground shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-0 flex flex-col justify-between bg-card text-foreground">
            <div className="flex-1 overflow-y-auto p-5">
              <SheetHeader className="text-left pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <img
                    src={user.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full bg-muted object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0 flex-1">
                    <SheetTitle className="text-sm font-bold text-foreground truncate">
                      {user.name || "User"}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground truncate">{user.email || ""}</p>
                  </div>
                </div>
              </SheetHeader>

              {/* Navigation Links */}
              <div className="py-4 space-y-1">
                <p className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Navigation
                </p>
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Preferences & Tools */}
              <div className="pt-2 border-t border-border space-y-2">
                <p className="px-2 pt-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Preferences
                </p>
                <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                  <span>{t("themeLabel")}</span>
                  <ThemeToggle className="h-7 w-7 rounded-lg" />
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                  <span>Language</span>
                  <LocaleSwitcher />
                </div>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Code className="h-4 w-4" />
                  <span>{t("navDocs")}</span>
                </a>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border space-y-2 bg-card">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsChangePasswordModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-accent hover:text-foreground transition-colors text-left justify-start h-auto text-foreground"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Change Password</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors text-left justify-start h-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("signOut")}</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
