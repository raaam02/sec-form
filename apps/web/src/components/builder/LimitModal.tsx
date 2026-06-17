import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ContactAdminForm } from "./ContactAdminModal";

interface LimitModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContactAdmin?: () => void;
}

export function LimitModal({ isOpen, onOpenChange, onContactAdmin }: LimitModalProps) {
  const [view, setView] = useState<"limit" | "contact">("limit");

  console.log("[LimitModal] Rendered. isOpen:", isOpen, "view:", view);

  // Reset view to "limit" when the modal is closed and reopened
  useEffect(() => {
    if (isOpen) {
      setView("limit");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md border border-border/80 shadow-2xl bg-card rounded-2xl p-6 relative overflow-hidden"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {view === "contact" ? (
          <ContactAdminForm onClose={() => onOpenChange(false)} defaultPlan="pro" />
        ) : (
          <div className="space-y-6 text-center">
            <DialogHeader className="space-y-3">
              <div className="flex justify-center">
                <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
              <DialogTitle className="font-outfit text-xl font-extrabold text-foreground">
                Upgrade to Publish More Forms
              </DialogTitle>
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
                    <span><strong>Draft & Private:</strong> You can create unlimited draft/unlisted forms.</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground/80">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                    <span><strong>Live updates:</strong> To publish more forms, you must set an existing form to draft/unlisted, or upgrade.</span>
                  </li>
                </ul>
              </div>
            </DialogHeader>
            <div className="flex flex-col-reverse sm:flex-row-reverse gap-3 pt-2">
              <Button 
                onClick={() => {
                  onOpenChange(false);
                  if (onContactAdmin) {
                    setTimeout(() => {
                      onContactAdmin();
                    }, 150);
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
      </DialogContent>
    </Dialog>
  );
}
