import React from "react";

export interface TabItem<T> {
  value: T;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass?: string;
}

interface TabBarProps<T> {
  items: TabItem<T>[] | readonly TabItem<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
}

export function TabBar<T extends string>({
  items,
  selectedValue,
  onChange,
  fullWidth = false,
}: TabBarProps<T>) {
  return (
    <div className="bg-card border-b border-border p-3 shrink-0 flex justify-center items-center">
      <div
        className={`flex bg-muted p-1 rounded-xl text-xs font-bold text-muted-foreground max-w-full overflow-x-auto no-scrollbar gap-1 border border-border ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = selectedValue === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`px-3.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                fullWidth ? "flex-1" : ""
              } ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${item.iconColorClass || "text-indigo-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
