"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export type ColorTheme =
  | "cobalt"
  | "tangerine"
  | "monochrome"
  | "emerald"
  | "purple"
  | "rosewood"
  | "forest"
  | "ocean"
  | "crimson"
  | "cyberpunk"
  | "sand"
  | "navy"
  | "gold"
  | "graphite"
  | "midnight"
  | "apricot"
  | "lavender"
  | "mist"
  | "matcha"
  | "sakura"
  | "honey"
  | "sky"
  | "bubblegum"
  | "rosegold"
  | "blush"
  | "lava"
  | "matrix"
  | "royal";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType>({
  colorTheme: "purple",
  setColorTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("purple");

  useEffect(() => {
    const saved = localStorage.getItem("color-theme") as ColorTheme;
    if (saved) {
      setColorThemeState(saved);
      document.documentElement.setAttribute("data-color-theme", saved);
    } else {
      document.documentElement.setAttribute("data-color-theme", "purple");
    }
  }, []);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem("color-theme", theme);
    document.documentElement.setAttribute("data-color-theme", theme);
  };

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorThemeContext);
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
