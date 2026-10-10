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
  Search,
} from "lucide-react";
import { FieldType } from "@sec-form/validators";

export interface SlashCommandItem {
  type: FieldType;
  label: string;
  description: string;
  icon: React.ElementType;
  category: "Inputs" | "Choices" | "Advanced";
}

const COMMAND_ITEMS: SlashCommandItem[] = [
  {
    type: "text",
    label: "Short Text",
    description: "Single-line text for names, titles, or brief input",
    icon: Type,
    category: "Inputs",
  },
  {
    type: "textarea",
    label: "Long Text",
    description: "Multi-line area for paragraphs, feedback, or descriptions",
    icon: AlignLeft,
    category: "Inputs",
  },
  {
    type: "email",
    label: "Email Address",
    description: "Email input with built-in format validation",
    icon: Mail,
    category: "Inputs",
  },
  {
    type: "phone",
    label: "Phone Number",
    description: "International phone input with validation",
    icon: Phone,
    category: "Inputs",
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric values with optional min/max limits",
    icon: Hash,
    category: "Inputs",
  },
  {
    type: "select",
    label: "Single Select",
    description: "Dropdown picker for choosing one option from a list",
    icon: List,
    category: "Choices",
  },
  {
    type: "multiselect",
    label: "Multi Select",
    description: "Allow respondent to choose multiple options",
    icon: CheckSquare,
    category: "Choices",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    description: "Single boolean checkbox for agreements and opt-ins",
    icon: CheckSquare,
    category: "Choices",
  },
  {
    type: "rating",
    label: "Rating",
    description: "Interactive 1-5 or 1-10 star rating score",
    icon: Star,
    category: "Advanced",
  },
  {
    type: "date",
    label: "Date",
    description: "Calendar date picker",
    icon: Calendar,
    category: "Advanced",
  },
  {
    type: "time",
    label: "Time",
    description: "Time selector for appointments and slots",
    icon: Clock,
    category: "Advanced",
  },
  {
    type: "step_break",
    label: "Page Break",
    description: "Divide form into separate pages or steps",
    icon: SplitSquareVertical,
    category: "Advanced",
  },
];

interface SlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: FieldType) => void;
  position?: { top: number; left: number } | null;
}

export function SlashCommandMenu({
  isOpen,
  onClose,
  onSelect,
  position,
}: SlashCommandMenuProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? filteredItems.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        onSelect(filteredItems[selectedIndex].type);
        onClose();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 bg-black/20 backdrop-blur-[2px]">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-full max-w-md bg-card/95 border border-border/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col"
          onKeyDown={handleKeyDown}
        >
          {/* Search Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/60 bg-muted/20">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search field type or type to filter..."
              className="w-full bg-transparent border-none text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted border border-border rounded">
              ESC
            </kbd>
          </div>

          {/* Items list */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No matching field found.
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      onSelect(item.type);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold leading-none mb-1">
                        {item.label}
                      </div>
                      <div
                        className={`text-[11px] truncate leading-tight ${
                          isSelected
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                        isSelected
                          ? "border-primary-foreground/30 text-primary-foreground/90"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {item.type}
                    </span>
                  </button>
                );
              })
            )}
          </div>
          <div className="px-3 py-2 border-t border-border/50 bg-muted/10 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Use ↑↓ to navigate</span>
            <span>Press Enter ↵ to insert</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
