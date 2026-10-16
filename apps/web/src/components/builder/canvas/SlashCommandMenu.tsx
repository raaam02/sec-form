"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  List,
  CheckSquare,
  Star,
  Calendar,
  Clock,
  SplitSquareVertical,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { FieldType } from "@sec-form/validators";

export interface SlashCommandItem {
  type: FieldType;
  label: string;
  badge?: string;
  icon?: React.ElementType;
  iconColor: string;
  bgColor: string;
}

const COMMAND_ITEMS: SlashCommandItem[] = [
  { type: "text", label: "Short answer", badge: "Aa", icon: Type, iconColor: "text-blue-500", bgColor: "bg-blue-500/10 dark:bg-blue-500/20" },
  { type: "textarea", label: "Long answer", badge: "AB", icon: AlignLeft, iconColor: "text-sky-500", bgColor: "bg-sky-500/10 dark:bg-sky-500/20" },
  { type: "select", label: "Multiple choice", icon: CheckCircle2, iconColor: "text-violet-500", bgColor: "bg-violet-500/10 dark:bg-violet-500/20" },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare, iconColor: "text-emerald-500", bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20" },
  { type: "select", label: "Dropdown", icon: ChevronDown, iconColor: "text-orange-500", bgColor: "bg-orange-500/10 dark:bg-orange-500/20" },
  { type: "multiselect", label: "Multi-select", icon: List, iconColor: "text-teal-500", bgColor: "bg-teal-500/10 dark:bg-teal-500/20" },
  { type: "number", label: "Number", icon: Hash, iconColor: "text-amber-500", bgColor: "bg-amber-500/10 dark:bg-amber-500/20" },
  { type: "email", label: "Email", icon: Mail, iconColor: "text-rose-500", bgColor: "bg-rose-500/10 dark:bg-rose-500/20" },
  { type: "phone", label: "Phone number", icon: Phone, iconColor: "text-green-500", bgColor: "bg-green-500/10 dark:bg-green-500/20" },
  { type: "rating", label: "Rating score", icon: Star, iconColor: "text-yellow-500", bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20" },
  { type: "date", label: "Date picker", icon: Calendar, iconColor: "text-pink-500", bgColor: "bg-pink-500/10 dark:bg-pink-500/20" },
  { type: "time", label: "Time picker", icon: Clock, iconColor: "text-purple-500", bgColor: "bg-purple-500/10 dark:bg-purple-500/20" },
  { type: "step_break", label: "Page break", icon: SplitSquareVertical, iconColor: "text-indigo-500", bgColor: "bg-indigo-500/10 dark:bg-indigo-500/20" },
];

interface SlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: FieldType) => void;
  query?: string;
  className?: string;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export function SlashCommandMenu({
  isOpen,
  onClose,
  onSelect,
  query = "",
  className = "",
  anchorRef,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [maxListHeight, setMaxListHeight] = useState<number>(288);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const cleanQuery = query.startsWith("/") ? query.slice(1).trim().toLowerCase() : query.trim().toLowerCase();

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(cleanQuery) ||
    item.type.toLowerCase().includes(cleanQuery)
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [cleanQuery, isOpen]);

  // Viewport edge-awareness: detect if menu should open upwards or downwards
  useEffect(() => {
    if (!isOpen) return;

    const updatePlacement = () => {
      const anchor = anchorRef?.current || containerRef.current?.parentElement;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const neededHeight = 310;

      if (spaceBelow < neededHeight && spaceAbove > spaceBelow) {
        setPlacement("top");
        setMaxListHeight(Math.max(160, Math.min(288, spaceAbove - 32)));
      } else {
        setPlacement("bottom");
        setMaxListHeight(Math.max(160, Math.min(288, spaceBelow - 32)));
      }
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [isOpen, anchorRef]);

  // Auto-scroll selected item into view during arrow key navigation
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
    if (selectedEl && typeof selectedEl.scrollIntoView === "function") {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Global arrow / enter listener when menu is open
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev <= 0 ? Math.max(0, filteredItems.length - 1) : prev - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].type);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`absolute left-6 z-50 ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>
      <AnimatePresence mode="wait">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.96, y: placement === "top" ? 6 : -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: placement === "top" ? 6 : -6 }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className={`w-64 bg-popover/95 border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col py-1.5 ${className}`}
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground/80 select-none">
            Questions
          </div>

          <div
            ref={listRef}
            className="overflow-y-auto px-1 space-y-0.5 custom-scrollbar"
            style={{ maxHeight: `${maxListHeight}px` }}
          >
            {filteredItems.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No matching questions
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={`${item.type}-${item.label}-${idx}`}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => onSelect(item.type)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-accent text-accent-foreground shadow-2xs font-semibold"
                        : "text-foreground hover:bg-muted/70"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.bgColor} ${item.iconColor} transition-transform ${
                        isSelected ? "scale-105" : ""
                      }`}
                    >
                      {item.badge ? (
                        <span className="font-bold text-[11px] font-sans tracking-tight leading-none">
                          {item.badge}
                        </span>
                      ) : Icon ? (
                        <Icon className="w-3.5 h-3.5" />
                      ) : null}
                    </div>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SlashCommandMenu;
