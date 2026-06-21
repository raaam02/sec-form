"use client";

import React from "react";
import { motion } from "motion/react";

export interface TabItem<T> {
  value: T;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass?: string;
  shortcut?: string;
}

interface TabBarProps<T> {
  items: TabItem<T>[] | readonly TabItem<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TabBar<T extends string>({
  items,
  selectedValue,
  onChange,
  fullWidth = false,
  leftElement,
  rightElement,
}: TabBarProps<T>) {
  const uniqueId = React.useId();
  const activeLayoutId = `active-tab-bg-${uniqueId}`;

  return (
    <div className="@container bg-transparent p-3 shrink-0 flex items-center justify-between absolute top-0 left-0 right-0 z-30 pointer-events-none">
      {/* Left Column */}
      <div className="flex-1 flex items-center justify-start min-w-0 pointer-events-auto">
        {leftElement}
      </div>

      {/* Middle Column */}
      <div className="flex-initial flex items-center justify-center min-w-0 mx-2 pointer-events-auto">
        <div
          className={`flex p-1 rounded-2xl text-xs bg-secondary/50 backdrop-blur-sm font-bold text-muted-foreground max-w-full overflow-x-auto no-scrollbar gap-1 ${
            fullWidth ? "w-full" : ""
          }`}
        >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = selectedValue === item.value;
          const button = (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`px-3.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 relative transition-colors duration-200 shrink-0 ${
                fullWidth ? "flex-1" : ""
              } ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={activeLayoutId}
                  className="absolute inset-0 bg-background shadow-sm rounded-lg -z-10"
                  transition={{ type: "tween", ease: "linear", duration: 0.16 }}
                />
              )}
              <Icon className={`h-3.5 w-3.5 ${item.iconColorClass || "text-indigo-500"} shrink-0 z-10`} />
              <span className="hidden @[250px]:inline whitespace-nowrap z-10">{item.label}</span>
            </button>
          );

          return (
            <Tooltip key={item.value}>
              <TooltipTrigger asChild>
                {button}
              </TooltipTrigger>
              <TooltipContent>
                {item.label}
                {item.shortcut && (
                  <kbd className="ml-1 text-[10px] font-mono opacity-80 uppercase">[{item.shortcut}]</kbd>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex items-center justify-end min-w-0 pointer-events-auto">
        {rightElement}
      </div>
    </div>
  );
}
