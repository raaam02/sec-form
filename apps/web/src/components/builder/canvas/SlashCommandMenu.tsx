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
}

const COMMAND_ITEMS: SlashCommandItem[] = [
  { type: "text", label: "Short answer", badge: "Aa", icon: Type },
  { type: "textarea", label: "Long answer", badge: "AB", icon: AlignLeft },
  { type: "select", label: "Multiple choice", icon: CheckCircle2 },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
  { type: "select", label: "Dropdown", icon: ChevronDown },
  { type: "multiselect", label: "Multi-select", icon: List },
  { type: "number", label: "Number", icon: Hash },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone number", icon: Phone },
  { type: "rating", label: "Rating score", icon: Star },
  { type: "date", label: "Date picker", icon: Calendar },
  { type: "time", label: "Time picker", icon: Clock },
  { type: "step_break", label: "Page break", icon: SplitSquareVertical },
];

interface SlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: FieldType) => void;
  query?: string;
  className?: string;
}

export function SlashCommandMenu({
  isOpen,
  onClose,
  onSelect,
  query = "",
  className = "",
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanQuery = query.startsWith("/") ? query.slice(1).trim().toLowerCase() : query.trim().toLowerCase();

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(cleanQuery) ||
    item.type.toLowerCase().includes(cleanQuery)
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [cleanQuery, isOpen]);

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
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -4 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className={`w-64 bg-popover/95 border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden flex flex-col py-1.5 ${className}`}
      >
        <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground/80 select-none">
          Questions
        </div>

        <div className="max-h-72 overflow-y-auto px-1 space-y-0.5 custom-scrollbar">
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
                  key={`${item.type}-${idx}`}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => onSelect(item.type)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-2xs font-semibold"
                      : "text-foreground hover:bg-muted/70"
                  }`}
                >
                  <div className="w-5 flex items-center justify-center shrink-0 text-muted-foreground/80">
                    {item.badge ? (
                      <span className="font-semibold text-xs font-sans tracking-tight">{item.badge}</span>
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
  );
}
