import React from "react";
import { ThemeConfig } from "@sec-form/shared";
import { ThemeCard } from "./ThemeCard";
export { ThemeFormPreview } from "./ThemeFormPreview";

export interface ThemePresetCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ThemePresetCard(props: ThemePresetCardProps) {
  return <ThemeCard {...props} />;
}

export default ThemePresetCard;
