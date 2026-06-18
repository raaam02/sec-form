"use client";

import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Send, 
  User, 
  Mail,
  Heart
} from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
        message,
        name: name.trim() || null,
        email: email.trim() || null,
      });
      toast.success("Thank you! Your feedback has been sent to the admin.");
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
          <Card className="max-w-md w-full border border-border/80 p-8 shadow-xl bg-card rounded-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <Heart className="h-10 w-10 fill-current" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-outfit text-2xl font-extrabold text-foreground">Thank You!</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We truly appreciate you taking the time to share your feedback. Your suggestions and insights help us make Formu.AI better for everyone.
              </p>
            </div>
            <div className="pt-4 space-y-3">
              <Link href="/dashboard" className="block w-full">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all">
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2.5 rounded-xl font-bold border-border text-muted-foreground"
              >
                Submit More Feedback
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <DashboardHeader title={t("navFeedback")} />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
        <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-6">
          <Card className="border border-border/80 shadow-xl bg-card/65 backdrop-blur-md rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <CardHeader className="space-y-2 border-b border-border/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MessageSquare className="h-5.5 w-5.5" />
                </div>
                <div>
                  <CardTitle className="font-outfit text-xl font-extrabold text-foreground">
                    Share Your Feedback
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs mt-0.5">
                    Help us improve Formu.AI. Tell us what you like, what we can fix, or suggest new features.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-5">
                {/* Message Field (Required) */}
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-message" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    Feedback Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Describe your feedback here... What features would you like to see? What issues did you face?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all resize-none text-sm p-4"
                  />
                </div>

                {/* Name Field (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-name" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <User className="h-3.5 w-3.5" /> Full Name (optional)
                  </Label>
                  <Input
                    id="feedback-name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all py-5 text-sm"
                  />
                </div>

                {/* Email Field (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-email" className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Mail className="h-3.5 w-3.5" /> Email Address (optional)
                  </Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all py-5 text-sm"
                  />
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 border-t border-border/50 flex items-center justify-between gap-4">
                <p className="text-[11px] text-muted-foreground">
                  Your feedback is sent directly to our administration team.
                </p>
                <Button 
                  type="submit" 
                  disabled={submitFeedback.isLoading}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0"
                >
                  <Send className="h-4 w-4" />
                  {submitFeedback.isLoading ? "Sending..." : "Submit Feedback"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
