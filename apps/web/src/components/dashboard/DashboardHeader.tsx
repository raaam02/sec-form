import React from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ title, description, icon, children, className = "" }: DashboardHeaderProps) {
  return (
    <header className={`h-16 border-b border-border bg-card flex items-center justify-between px-6 sm:px-8 shrink-0 transition-colors duration-200 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="flex items-center justify-center shrink-0">{icon}</div>}
        <div className="flex flex-col">
          <h1 className="font-outfit text-xl font-bold text-foreground flex items-center gap-2">{title}</h1>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </header>
  );
}
