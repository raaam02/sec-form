import React from "react";
import { useTheme } from "@/components/ThemeProvider";

export function NoiseBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="absolute inset-0 -z-10 pointer-events-none"
      style={{
        backgroundColor: isDark ? "#000000" : "#ffffff",
        backgroundImage: isDark
          ? `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.25) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.2) 1px, transparent 0)
          `
          : `
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.25) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.22) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.18) 1px, transparent 0)
          `,
        backgroundSize: "20px 20px, 30px 30px, 25px 25px",
        backgroundPosition: "0 0, 10px 10px, 15px 5px",
      }}
    />
  );
}
