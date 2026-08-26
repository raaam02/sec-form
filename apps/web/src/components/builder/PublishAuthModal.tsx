"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface PublishAuthModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formId: string;
}

export function PublishAuthModal({ isOpen, setIsOpen, formId }: PublishAuthModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const redirectTarget = encodeURIComponent(`${pathname}?publish=true`);

  const handleLogin = () => {
    setIsOpen(false);
    router.push(`/login?redirect=${redirectTarget}`);
  };

  const handleSignup = () => {
    setIsOpen(false);
    router.push(`/signup?redirect=${redirectTarget}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-card border-border shadow-2xl">
        <DialogHeader className="text-center sm:text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold font-outfit text-foreground">
            Sign in to Publish Your Form
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2 max-w-sm">
            Your form questions, theme, and settings are saved. Log in or create a free account to publish it live and start collecting responses.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleLogin}
            className="w-full h-11 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            Log In & Publish <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={handleSignup}
            className="w-full h-11 text-sm font-semibold rounded-xl border-border hover:bg-accent text-foreground"
          >
            Create Free Account
          </Button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground/70 mt-3">
          Free forever • No credit card required
        </p>
      </DialogContent>
    </Dialog>
  );
}
