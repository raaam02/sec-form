"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  id?: string;
  question?: string;
  answer?: string | React.ReactNode;
  q?: string;
  a?: string | React.ReactNode;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
  itemClassName?: string;
}

export function FAQAccordion({
  items,
  defaultOpenId,
  allowMultiple = true,
  className,
  itemClassName,
}: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    if (defaultOpenId) {
      return { [defaultOpenId]: true };
    }
    return {};
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const willBeOpen = !prev[id];
      if (allowMultiple) {
        return {
          ...prev,
          [id]: willBeOpen,
        };
      }
      return willBeOpen ? { [id]: true } : {};
    });
  };

  return (
    <div className={cn("space-y-2.5", className)}>
      {items.map((item, index) => {
        const itemId = item.id || item.q || `faq-${index}`;
        const question = item.question || item.q || "";
        const answer = item.answer || item.a || "";
        const isOpen = !!openItems[itemId];

        return (
          <div
            key={itemId}
            className={cn(
              "rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs dark:shadow-md dark:shadow-black/20",
              isOpen
                ? "border-primary/40 bg-card shadow-sm ring-1 ring-primary/10"
                : "border-border/80 bg-card/90 dark:bg-card/90 hover:border-border hover:bg-card",
              itemClassName
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(itemId)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-[14px] sm:text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary pr-4">
                {question}
              </span>

              <div
                className={cn(
                  "h-6 w-6 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200",
                  isOpen
                    ? "rotate-180 bg-primary/10 text-primary border-primary/20"
                    : "border-border/60 text-muted-foreground group-hover:text-foreground"
                )}
              >
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                    {answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
