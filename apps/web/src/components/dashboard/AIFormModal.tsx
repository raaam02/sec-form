import React, { useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";

interface AIFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onGenerate: (prompt: string) => Promise<void>;
  isDemo?: boolean;
  aiCredits?: number;
}

export function AIFormModal({
  isOpen,
  setIsOpen,
  onGenerate,
  isDemo = false,
  aiCredits = 2,
}: AIFormModalProps) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || aiCredits <= 0) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      await onGenerate(prompt);
      setPrompt("");
      setIsOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || "AI generator failed. Try a simpler prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl text-foreground">
        {isDemo ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-1.5 mb-1 text-primary">
                <Sparkles className="h-5 w-5 fill-primary/10" />
                <DialogTitle className="font-outfit text-xl font-bold text-foreground">
                  Self-Login Required
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs mt-1">
                Sign in to use Gemini AI Generation features.
              </DialogDescription>
            </DialogHeader>

            <div className="text-center py-6 space-y-4">
              <div className="flex justify-center">
                <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                You are logged in with the demo account. To use Gemini AI form generation, please register or sign in using your own credentials.
              </p>
            </div>

            <DialogFooter className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="h-10 px-4 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="h-10 px-5 bg-gradient-to-r from-primary to-pink-500 hover:opacity-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                Sign Out
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-1.5 mb-1 text-primary">
                <Sparkles className="h-5 w-5 fill-primary/10" />
                <DialogTitle className="font-outfit text-xl font-bold text-foreground">
                  {t("modalAiTitle")}
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs mt-1">
                {t("modalAiDesc")}
              </DialogDescription>
            </DialogHeader>

            {errorMessage && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 my-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {aiCredits <= 0 && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 my-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <span>You have reached the limit of 2 AI-generated forms under the Free Tier. Please delete an existing AI form to free up credits.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 my-2">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Prompt Details
                  </Label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${aiCredits === 0 ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
                    Credits: {aiCredits}/2
                  </span>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-background text-foreground text-sm"
                  placeholder={t("modalAiPlaceholder")}
                  required
                  disabled={isLoading || aiCredits <= 0}
                />
              </div>

              <DialogFooter className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="h-10 px-4 rounded-xl"
                  disabled={isLoading}
                >
                  {tCommon("cancel")}
                </Button>
                <Button
                  type="submit"
                  className="h-10 px-5 bg-gradient-to-r from-primary to-pink-500 hover:opacity-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  disabled={isLoading || aiCredits <= 0}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="w-4 h-4" color="text-white" />
                      <span>{t("modalAiGenerating")}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>{t("modalAiBtn")}</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
