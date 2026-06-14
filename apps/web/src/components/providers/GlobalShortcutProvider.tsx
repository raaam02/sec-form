"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "next-themes";

type Shortcut = {
  keys: string; // e.g. "ctrl+n" or "n"
  description: string;
  action: () => void;
  group: string;
};

type GlobalShortcutContextType = {
  registerShortcut: (id: string, shortcut: Shortcut) => void;
  unregisterShortcut: (id: string) => void;
  toggleHelp: () => void;
};

const GlobalShortcutContext = createContext<GlobalShortcutContextType | null>(null);

export function GlobalShortcutProvider({ children }: { children: React.ReactNode }) {
  const [shortcuts, setShortcuts] = useState<Record<string, Shortcut>>({});
  const [showHelp, setShowHelp] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const registerShortcut = useCallback((id: string, shortcut: Shortcut) => {
    setShortcuts(prev => ({ ...prev, [id]: shortcut }));
  }, []);

  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInputFocused = 
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.tagName === "SELECT" ||
        activeEl?.isContentEditable;

      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      // Check global help shortcut: Ctrl + Space or Cmd + Space
      if ((e.ctrlKey || e.metaKey) && e.code === "Space") {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }

      // Check global theme toggle shortcut: Ctrl + M or Cmd + M
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
        return;
      }

      // Match other shortcuts
      for (const shortcut of Object.values(shortcuts)) {
        const parts = shortcut.keys.toLowerCase().split("+");
        const needsCtrl = parts.includes("ctrl") || parts.includes("cmd") || parts.includes("meta");
        const needsShift = parts.includes("shift");
        const needsAlt = parts.includes("alt");
        const key = parts[parts.length - 1];

        // If it doesn't need modifiers and an input is focused, don't trigger (prevents typing "n" or "g" from triggering shortcuts)
        if (!needsCtrl && !needsAlt && isInputFocused) {
          continue;
        }

        const hasCtrlMatch = e.ctrlKey || e.metaKey;
        const isKeyMatch = e.key.toLowerCase() === key;

        if (needsCtrl === hasCtrlMatch && needsShift === e.shiftKey && needsAlt === e.altKey && isKeyMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  const toggleHelp = useCallback(() => setShowHelp(prev => !prev), []);
  const contextValue = React.useMemo(() => ({ registerShortcut, unregisterShortcut, toggleHelp }), [registerShortcut, unregisterShortcut, toggleHelp]);

  // Group shortcuts
  const groupedShortcuts = Object.values(shortcuts).reduce((acc, shortcut) => {
    if (!acc[shortcut.group]) acc[shortcut.group] = [];
    acc[shortcut.group].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  // Add the built-in Global shortcut to the Global group
  if (!groupedShortcuts["Global"]) {
    groupedShortcuts["Global"] = [];
  }
  // We'll render it manually or inject it
  
  return (
    <GlobalShortcutContext.Provider value={contextValue}>
      {children}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md rounded-2xl border border-border shadow-xl bg-background">
          <DialogHeader>
            <DialogTitle className="font-outfit text-xl font-bold">Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Global Group (Always has Help) */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Global</h4>
              <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <span className="text-sm font-medium text-foreground">Show Keyboard Shortcuts</span>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono font-semibold text-muted-foreground border border-border">Ctrl + Space</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <span className="text-sm font-medium text-foreground">Toggle Theme Mode</span>
                <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono font-semibold text-muted-foreground border border-border">Ctrl + M</kbd>
              </div>
              {groupedShortcuts["Global"]?.map((s, i) => (
                <div key={`global-${i}`} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium text-foreground">{s.description}</span>
                  <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono font-semibold text-muted-foreground border border-border capitalize">
                    {s.keys.replace(/ctrl\+/gi, "Ctrl + ").replace(/shift\+/gi, "Shift + ").replace(/alt\+/gi, "Alt + ")}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Other Groups */}
            {Object.keys(groupedShortcuts).filter(g => g !== "Global").map(group => (
              <div key={group} className="space-y-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-4">{group}</h4>
                {groupedShortcuts[group].map((s, i) => (
                  <div key={`${group}-${i}`} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm font-medium text-foreground">{s.description}</span>
                    <kbd className="px-2 py-1 bg-muted rounded-md text-xs font-mono font-semibold text-muted-foreground border border-border capitalize">
                      {s.keys.replace(/ctrl\+/gi, "Ctrl + ").replace(/shift\+/gi, "Shift + ").replace(/alt\+/gi, "Alt + ")}
                    </kbd>
                  </div>
                ))}
              </div>
            ))}
            
          </div>
        </DialogContent>
      </Dialog>
    </GlobalShortcutContext.Provider>
  );
}

export function useGlobalShortcut(id: string, keys: string, description: string, action: () => void, group: string = "Page Actions") {
  const context = useContext(GlobalShortcutContext);
  const actionRef = React.useRef(action);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);
  
  useEffect(() => {
    if (!context) return;
    const stableAction = () => {
      if (actionRef.current) {
        actionRef.current();
      }
    };
    context.registerShortcut(id, { keys, description, action: stableAction, group });
    return () => context.unregisterShortcut(id);
  }, [context, id, keys, description, group]);
}

export function useGlobalShortcutHelp() {
  const context = useContext(GlobalShortcutContext);
  if (!context) throw new Error("useGlobalShortcutHelp must be used within GlobalShortcutProvider");
  return context.toggleHelp;
}
