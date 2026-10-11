"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { toast } from "sonner";
import { 
  Send, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackPage() {
  const t = useTranslations("Dashboard");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const submitFeedback = trpc.support.submitFeedback.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Feedback message is required.");
      return;
    }

    try {
      await submitFeedback.mutateAsync({
        message: message.trim(),
        name: name.trim() || null,
        email: email.trim() || null,
      });
      toast.success("Thank you! Your feedback has been sent.");
      setIsSubmitted(true);
      setMessage("");
      setName("");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send feedback. Please try again later.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <DashboardHeader title={t("navFeedback")} />
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 flex items-center justify-center">
          <div className="max-w-md w-full border border-border/60 p-8 bg-card/60 rounded-3xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-xs">
            <div className="flex justify-center">
              <div className="h-14 w-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h2 className="font-outfit text-xl font-bold text-foreground">Thank you for your feedback!</h2>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto">
                Your thoughts and suggestions help us improve Formu.AI for everyone. We review every note we receive.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full bg-foreground text-background hover:opacity-90 font-medium text-xs h-10 px-5 rounded-xl shadow-xs transition-opacity">
                  Back to Dashboard
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto h-10 px-5 rounded-xl text-xs font-medium border-border/70 hover:bg-muted/50"
              >
                Send Another Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <DashboardHeader title={t("navFeedback")} />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
        <div className="max-w-xl mx-auto py-4 sm:py-6 space-y-6">
          {/* Header intro */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground text-[11px] font-medium mb-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>We value your input</span>
            </div>
            <h1 className="font-outfit text-2xl font-bold tracking-tight text-foreground">
              Share your feedback
            </h1>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Have an idea, found a bug, or want a new feature? Tell us what you think.
            </p>
          </div>

          {/* Minimal Form Card */}
          <form 
            onSubmit={handleSubmit}
            className="rounded-3xl border border-border/50 bg-card/60 p-6 sm:p-7 space-y-5 shadow-xs"
          >
            {/* Feedback Message */}
            <div className="space-y-1.5">
              <Label 
                htmlFor="feedback-message" 
                className="text-xs font-medium text-foreground flex items-center justify-between"
              >
                <span>Message</span>
                <span className="text-[11px] text-muted-foreground font-normal">Required</span>
              </Label>
              <Textarea
                id="feedback-message"
                placeholder="What's on your mind? Tell us what you like or how we can improve..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="rounded-2xl border border-border/60 bg-background/50 focus:bg-background focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all resize-none text-xs sm:text-sm p-4 placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Optional Contact Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label 
                  htmlFor="feedback-name" 
                  className="text-xs font-medium text-foreground flex items-center justify-between"
                >
                  <span>Name</span>
                  <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
                </Label>
                <Input
                  id="feedback-name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all text-xs sm:text-sm placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label 
                  htmlFor="feedback-email" 
                  className="text-xs font-medium text-foreground flex items-center justify-between"
                >
                  <span>Email</span>
                  <span className="text-[11px] text-muted-foreground font-normal">Optional</span>
                </Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl border border-border/60 bg-background/50 focus:bg-background focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all text-xs sm:text-sm placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {/* Form Footer */}
            <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground">
                We read every message and respond if an email is provided.
              </p>
              <button
                type="submit"
                disabled={submitFeedback.isLoading || !message.trim()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-foreground text-background hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 px-5 text-xs font-semibold transition-opacity shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitFeedback.isLoading ? "Sending..." : "Submit Feedback"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
