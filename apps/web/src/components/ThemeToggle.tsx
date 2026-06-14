"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-muted animate-pulse ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-9 h-9 flex items-center justify-center rounded-xl bg-background/50 hover:bg-accent hover:text-accent-foreground border border-border text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40 shadow-sm ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === "light" ? (
          <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12 text-muted-foreground" />
        ) : (
          <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45 text-yellow-400" />
        )}
      </div>
    </button>
  );
}
