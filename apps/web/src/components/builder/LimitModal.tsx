import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { ContactAdminForm } from "./ContactAdminModal";

interface LimitModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContactAdmin?: () => void;
}

export function LimitModal({ isOpen, onOpenChange, onContactAdmin }: LimitModalProps) {
  const [view, setView] = useState<"limit" | "contact">("limit");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset view to "limit" when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setView("limit");
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)" }}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "28rem",
          zIndex: 10000,
        }}
        className="bg-background border border-border/80 shadow-2xl rounded-2xl p-6 relative"
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 text-foreground transition-opacity"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {view === "contact" ? (
          <ContactAdminForm onClose={() => onOpenChange(false)} defaultPlan="pro" />
        ) : (
          <div className="space-y-6 text-center">
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
              <h2 className="font-outfit text-xl font-extrabold text-foreground">
                Upgrade to Publish More Forms
              </h2>
              <div className="text-left space-y-3 text-sm text-muted-foreground pt-2">
                <p className="leading-relaxed">
                  You have reached the limit of active public questionnaires allowed under your current plan:
                </p>
                <ul className="space-y-2 bg-muted/40 p-4 rounded-xl border border-border/50 text-xs">
                  <li className="flex items-start gap-2 text-foreground/80">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                    <span><strong>Starter/Free Plan Limit:</strong> Maximum of 3 public forms active at a time.</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground/80">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                    <span><strong>Draft &amp; Private:</strong> You can create unlimited draft/unlisted forms.</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground/80">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                    <span><strong>Live updates:</strong> To publish more forms, you must set an existing form to draft/unlisted, or upgrade.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row-reverse gap-3 pt-2">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  if (onContactAdmin) {
                    setTimeout(() => onContactAdmin(), 100);
                  }
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl py-2.5"
              >
                Contact Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl py-2.5 border-border font-bold text-muted-foreground"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
