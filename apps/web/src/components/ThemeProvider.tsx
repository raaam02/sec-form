"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();

  const toggleTheme = () => {
    // Determine the active resolved theme, defaulting to 'light'
    const current = resolvedTheme || theme || "light";
    const targetTheme = current === "dark" ? "light" : "dark";
    setTheme(targetTheme);
  };

  return {
    theme: (resolvedTheme || theme || "light") as "light" | "dark",
    toggleTheme,
    setTheme: (newTheme: "light" | "dark") => setTheme(newTheme),
  };
}
