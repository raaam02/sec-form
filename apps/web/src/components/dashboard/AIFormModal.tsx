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

interface AIFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onGenerate: (prompt: string) => Promise<void>;
}

export function AIFormModal({
  isOpen,
  setIsOpen,
  onGenerate,
}: AIFormModalProps) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

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

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Prompt Details
            </Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-background text-foreground text-sm"
              placeholder={t("modalAiPlaceholder")}
              required
              disabled={isLoading}
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
              disabled={isLoading}
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
      </DialogContent>
    </Dialog>
  );
}
