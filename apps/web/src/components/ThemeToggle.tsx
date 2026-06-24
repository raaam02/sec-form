"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
    // Wrap Button in tooltip
    <Tooltip>
      <TooltipTrigger 
        onClick={toggleTheme} 
        className={`relative group w-9 h-9 flex items-center justify-center rounded-xl bg-background/50 hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-all duration-200 ${className}`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {theme === "light" ? (
            <Moon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45 text-yellow-400" />
          )}
        </div>
        <TooltipContent side="top" className="text-xs px-2.5 py-1">
          <span className="font-medium">Ctrl + M</span>
        </TooltipContent>
      </TooltipTrigger>
    </Tooltip>
  );
}
