"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export type AuthModalMode = "login" | "signup";

interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  redirectUrl: string;
  layoutId: string;
  openAuthModal: (
    mode?: AuthModalMode,
    redirectUrl?: string,
    layoutId?: string
  ) => void;
  closeAuthModal: () => void;
  setMode: (mode: AuthModalMode) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");
  const [redirectUrl, setRedirectUrl] = useState<string>("/dashboard");
  const [layoutId, setLayoutId] = useState<string>("auth-modal-navbar");
  const pathname = usePathname();

  const openAuthModal = useCallback(
    (
      newMode: AuthModalMode = "login",
      newRedirectUrl?: string,
      customLayoutId?: string
    ) => {
      setMode(newMode);
      if (newRedirectUrl) {
        setRedirectUrl(newRedirectUrl);
      } else if (pathname && pathname !== "/login" && pathname !== "/signup") {
        setRedirectUrl(pathname);
      } else {
        setRedirectUrl("/dashboard");
      }

      setLayoutId(customLayoutId || "auth-modal-navbar");
      setIsOpen(true);
    },
    [pathname]
  );

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Intercept any click on links with href="/login" or href="/signup"
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Don't intercept if user is already on dedicated /login or /signup page
      if (window.location.pathname === "/login" || window.location.pathname === "/signup") {
        return;
      }

      const link = (e.target as HTMLElement)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      if (href === "/login" || href.startsWith("/login?")) {
        e.preventDefault();
        const urlParams = new URLSearchParams(href.split("?")[1] || "");
        const redirect = urlParams.get("redirect") || "/dashboard";
        openAuthModal("login", redirect, "auth-modal-navbar");
      } else if (href === "/signup" || href.startsWith("/signup?")) {
        e.preventDefault();
        const urlParams = new URLSearchParams(href.split("?")[1] || "");
        const redirect = urlParams.get("redirect") || "/dashboard";
        openAuthModal("signup", redirect, "auth-modal-navbar");
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [openAuthModal]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        redirectUrl,
        layoutId,
        openAuthModal,
        closeAuthModal,
        setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
