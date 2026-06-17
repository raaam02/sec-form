"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, MessageSquare, ArrowLeft, Send, CheckCircle2, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sendInquiry = trpc.support.sendContactInquiry.useMutation();

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "pro") {
      setPlan("pro");
      setMessage("I would like to upgrade my account to the Professional Plan. Please contact me with the details.");
    } else if (planParam === "enterprise") {
      setPlan("enterprise");
      setMessage("I am interested in the Enterprise Plan for my team. Please contact me with pricing and setup details.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let subjectString = "General Support";
    if (plan === "pro") subjectString = "Upgrade to Professional Plan ($29/mo)";
    if (plan === "enterprise") subjectString = "Upgrade to Enterprise Plan ($99/mo)";

    try {
      await sendInquiry.mutateAsync({
        name,
        email,
        subject: subjectString,
        message,
      });
      toast.success("Inquiry sent successfully!");
      setIsSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to send inquiry. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md w-full border border-border/80 p-8 shadow-xl bg-card rounded-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="font-outfit text-2xl font-bold text-foreground">Message Sent!</h2>
          <p className="text-muted-foreground text-sm">
            Thank you for reaching out. An administrator will review your request and get back to you at <span className="font-semibold text-foreground">{email}</span> within 24 hours.
          </p>
        </div>
        <div className="pt-4 space-y-3">
          <Link href="/dashboard" className="block w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg py-2.5 rounded-xl font-semibold">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/pricing" className="block w-full">
            <Button variant="outline" className="w-full py-2.5 rounded-xl font-semibold border-border">
              Back to Pricing
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg border border-border/80 shadow-xl bg-card/65 backdrop-blur-md p-6 sm:p-8 rounded-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/pricing"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to pricing
        </Link>
        {plan !== "general" && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            {plan} plan inquiry
          </span>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="font-outfit text-2xl font-extrabold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Contact Administrator
        </h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Fill out the form below to request premium options, custom quotas, or admin approval for paid plans.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Full Name
          </Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all py-5"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all py-5"
          />
        </div>

        {/* Plan / Subject Selection */}
        <div className="space-y-1.5">
          <Label htmlFor="plan" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Subject / Inquiry Type
          </Label>
          <Select value={plan} onValueChange={(val) => setPlan(val)}>
            <SelectTrigger className="w-full rounded-xl border border-border bg-background/50 px-3.5 py-6 text-sm focus:ring-primary focus:ring-offset-0 transition-all">
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border rounded-xl shadow-lg">
              <SelectItem value="general">General Support / Custom Proposal</SelectItem>
              <SelectItem value="pro">Upgrade to Professional Plan ($29/mo)</SelectItem>
              <SelectItem value="enterprise">Upgrade to Enterprise Plan ($99/mo)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message Field */}
        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us about your requirements..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all resize-none"
          />
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          disabled={sendInquiry.isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2"
        >
          <Send className="h-4 w-4" />
          {sendInquiry.isLoading ? "Sending inquiry..." : "Send Request"}
        </Button>
      </form>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] py-12 flex items-center justify-center px-4 sm:px-6 relative">
      <Suspense fallback={
        <Card className="max-w-md w-full border border-border p-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">Loading inquiry form...</p>
        </Card>
      }>
        <ContactFormContent />
      </Suspense>
    </div>
  );
}
