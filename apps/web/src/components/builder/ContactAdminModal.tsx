import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

import { Mail, MessageSquare, Send, User, X } from "lucide-react";

interface ContactAdminFormProps {
  onClose: () => void;
  defaultPlan?: "general" | "pro" | "enterprise";
}

export function ContactAdminForm({ onClose, defaultPlan = "pro" }: ContactAdminFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("pro");
  const [message, setMessage] = useState("");

  const sendInquiry = trpc.support.sendContactInquiry.useMutation();

  useEffect(() => {
    setPlan(defaultPlan);
    if (defaultPlan === "pro") {
      setMessage("I would like to upgrade my account to the Professional Plan. Please contact me with the details.");
    } else if (defaultPlan === "enterprise") {
      setMessage("I am interested in the Enterprise Plan for my team. Please contact me with pricing and setup details.");
    } else {
      setMessage("");
    }
  }, [defaultPlan]);

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
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to send inquiry. Please try again.");
    }
  };

  return (
    <>
      <div className="space-y-2 mb-4">
        <h2 className="font-outfit text-xl font-extrabold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Contact Administrator
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="admin-name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Full Name
          </Label>
          <Input
            id="admin-name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all py-4 text-xs"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="admin-email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email Address
          </Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all py-4 text-xs"
          />
        </div>

        {/* Subject selection */}
        <div className="space-y-1.5">
          <Label htmlFor="admin-plan" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Subject / Plan Upgrade
          </Label>
          <Select value={plan} onValueChange={(val) => setPlan(val)}>
            <SelectTrigger className="w-full rounded-xl border border-border bg-background/50 px-3 py-5 text-xs focus:ring-primary focus:ring-offset-0 transition-all">
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
          <Label htmlFor="admin-message" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Message
          </Label>
          <Textarea
            id="admin-message"
            placeholder="Tell us about your requirements..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            required
            className="rounded-xl border border-border bg-background/50 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all resize-none text-xs"
          />
        </div>

        {/* Submit button */}
        <div className="flex gap-2 pt-2">
          <Button 
            type="submit" 
            disabled={sendInquiry.isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {sendInquiry.isLoading ? "Sending..." : "Send Request"}
          </Button>
          <Button 
            variant="outline" 
            type="button"
            onClick={onClose}
            className="rounded-xl py-4 border-border font-bold text-muted-foreground"
          >
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}

interface ContactAdminModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlan?: "general" | "pro" | "enterprise";
}

export function ContactAdminModal({ isOpen, onOpenChange, defaultPlan = "pro" }: ContactAdminModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

        <ContactAdminForm onClose={() => onOpenChange(false)} defaultPlan={defaultPlan} />
      </div>
    </div>,
    document.body
  );
}
