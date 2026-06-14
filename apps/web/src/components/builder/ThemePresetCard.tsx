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
      className={`rounded-2xl border p-4 bg-card shadow-sm flex flex-col justify-between cursor-pointer hover:border-accent-foreground transition-all ${
        isActive 
          ? "ring-2 ring-indigo-600 border-indigo-600" 
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-outfit font-bold text-foreground text-xs">{theme.name}</span>
        {isActive && <span className="text-[10px] text-indigo-600 font-bold">Selected</span>}
      </div>
      
      <div className="mt-3 flex items-center gap-1.5">
        <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: theme.primaryColor }} title="Primary" />
        <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: theme.backgroundColor }} title="Background" />
        <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: theme.textColor }} title="Text color" />
        <div className="h-4 w-4 rounded border border-border" style={{ backgroundColor: theme.cardColor }} title="Card Background" />
      </div>
    </Card>
  );
}
