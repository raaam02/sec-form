"use client";

import React, { useState } from "react";
import { Palette, Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useColorTheme, ColorTheme } from "./ThemeProvider";

const THEME_OPTIONS: { value: ColorTheme; label: string; color: string }[] = [
  { value: "cobalt", label: "Cobalt Blue", color: "bg-blue-600" },
  { value: "apricot", label: "Apricot Warmth (Subtle)", color: "bg-[#FFB366]" },
  { value: "lavender", label: "Lavender Dusk (Subtle)", color: "bg-[#C8B1E4]" },
  { value: "mist", label: "Ocean Mist (Subtle)", color: "bg-[#A8DADC]" },
  { value: "matcha", label: "Matcha Mint (Subtle)", color: "bg-[#8ECA90]" },
  { value: "sakura", label: "Sakura Blossom (Subtle)", color: "bg-[#FFC0CB]" },
  { value: "bubblegum", label: "Bubblegum Pink (Subtle)", color: "bg-[#FF85B3]" },
  { value: "rosegold", label: "Rose Gold (Subtle)", color: "bg-[#E09F9F]" },
  { value: "blush", label: "Blush Nude (Subtle)", color: "bg-[#FCA5A5]" },
  { value: "honey", label: "Honey Chamomile (Subtle)", color: "bg-[#F7E185]" },
  { value: "sky", label: "Sky Haze (Subtle)", color: "bg-[#90CAF9]" },
  { value: "tangerine", label: "Tangerine Orange", color: "bg-[#E28743]" },
  { value: "monochrome", label: "Zinc Monochrome", color: "bg-zinc-600 dark:bg-zinc-300" },
  { value: "emerald", label: "Emerald Mint", color: "bg-emerald-600" },
  { value: "purple", label: "Amethyst Purple", color: "bg-purple-600" },
  { value: "rosewood", label: "Rosewood Terracotta", color: "bg-[#E07A5F]" },
  { value: "forest", label: "Forest Moss", color: "bg-[#4A7C59]" },
  { value: "ocean", label: "Ocean Teal", color: "bg-[#008080]" },
  { value: "crimson", label: "Crimson Rust", color: "bg-[#9B2226]" },
  { value: "cyberpunk", label: "Cyberpunk Neon", color: "bg-[#ff007f]" },
  { value: "sand", label: "Desert Sand", color: "bg-[#D4A373]" },
  { value: "navy", label: "Corporate Navy", color: "bg-[#1D3557]" },
  { value: "gold", label: "Solar Gold", color: "bg-[#E5A93C]" },
  { value: "graphite", label: "Graphite Charcoal", color: "bg-[#5C6B73]" },
  { value: "midnight", label: "Midnight Velvet", color: "bg-[#3f37c9]" },
  { value: "lava", label: "Lava Rock (Bold)", color: "bg-[#ff4500]" },
  { value: "matrix", label: "Neon Matrix (Bold)", color: "bg-[#00ff00]" },
  { value: "royal", label: "Royal Velvet (Bold)", color: "bg-[#8a2be2]" },
];

export function ColorThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const [open, setOpen] = useState(false);

  const getThemeLabel = (theme: ColorTheme) => {
    return THEME_OPTIONS.find((t) => t.value === theme)?.label || "Cobalt Blue";
  };

  const getThemeColorClass = (theme: ColorTheme) => {
    return THEME_OPTIONS.find((t) => t.value === theme)?.color || "bg-blue-600";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-[160px] backdrop-blur-sm bg-secondary/20 border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all rounded-lg text-xs font-semibold gap-1.5 shrink-0 justify-between px-3"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${getThemeColorClass(colorTheme)}`} />
            <span className="truncate">{getThemeLabel(colorTheme)}</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[180px] max-h-[300px] overflow-y-auto custom-scrollbar bg-popover border-border rounded-xl text-popover-foreground p-1 shadow-lg z-50">
        <div className="space-y-0.5">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setColorTheme(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                colorTheme === opt.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${opt.color}`} />
                <span>{opt.label}</span>
              </div>
              {colorTheme === opt.value && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
