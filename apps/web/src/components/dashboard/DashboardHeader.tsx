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
    <header className={`min-h-16 h-auto sm:h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-8 shrink-0 gap-3 py-3 sm:py-0 flex-wrap sm:flex-nowrap transition-colors duration-200 ${className}`}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && <div className="flex items-center justify-center shrink-0">{icon}</div>}
        <div className="flex flex-col min-w-0">
          <h1 className="font-outfit text-lg sm:text-xl font-bold text-foreground flex items-center gap-2 truncate">{title}</h1>
          {description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </header>
  );
}
