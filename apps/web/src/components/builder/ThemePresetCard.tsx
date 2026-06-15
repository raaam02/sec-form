import React from "react";
import { ThemeConfig } from "@sec-form/shared";
import { Card } from "@/components/ui/card";

interface ThemePresetCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onClick: () => void;
}

export function ThemePresetCard({ theme, isActive, onClick }: ThemePresetCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`rounded-xl border p-2.5 bg-card shadow-sm flex flex-col justify-between cursor-pointer hover:border-accent-foreground transition-all ${
        isActive 
          ? "ring-2 ring-indigo-600 border-indigo-600" 
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between min-w-0">
        <span className="font-outfit font-bold text-foreground text-[11px] truncate">{theme.name}</span>
        {isActive && <span className="text-[9px] text-indigo-600 font-bold shrink-0 ml-1">✓</span>}
      </div>
      
      <div className="mt-2 flex items-center gap-1">
        <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: theme.primaryColor }} title="Primary" />
        <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: theme.backgroundColor }} title="Background" />
        <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: theme.textColor }} title="Text color" />
        <div className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: theme.cardColor }} title="Card Background" />
      </div>
    </Card>
  );
}
