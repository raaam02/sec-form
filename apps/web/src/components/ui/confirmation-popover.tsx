"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface ConfirmationPopoverProps {
  children: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationPopover({
  children,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent 
        className="w-72 p-4 rounded-xl border border-border shadow-lg" 
        side="top" 
        align="center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "tween" as const, ease: "linear" as const, duration: 0.14 }}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-semibold text-sm leading-none">{title}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <motion.div
              whileHover={{ scale: 1.03, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.1 } }}
              whileTap={{ scale: 0.97, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
            >
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="h-8 px-3 text-xs">
                {cancelText}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.1 } }}
              whileTap={{ scale: 0.97, transition: { type: "tween" as const, ease: "linear" as const, duration: 0.08 } }}
            >
              <Button variant="destructive" size="sm" onClick={handleConfirm} className="h-8 px-3 text-xs">
                {confirmText}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
