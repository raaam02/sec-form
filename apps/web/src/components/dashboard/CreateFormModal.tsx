import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCreate: (title: string, description: string) => Promise<void>;
}

export function CreateFormModal({
  isOpen,
  setIsOpen,
  onCreate,
}: CreateFormModalProps) {
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsLoading(true);
    setErrorMessage("");
    try {
      await onCreate(formTitle, formDesc);
      setFormTitle("");
      setFormDesc("");
      setIsOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl text-foreground">
        <DialogHeader>
          <DialogTitle className="font-outfit text-xl font-bold">Create New Form</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs mt-1">
            Enter details below to establish a blank form layout.
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
              Form Title
            </Label>
            <Input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-sm"
              placeholder="e.g. Feedback Survey"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Description (optional)
            </Label>
            <Textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full min-h-[80px] p-3 rounded-xl border border-border bg-background text-foreground text-sm"
              placeholder="Provide context for respondents..."
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
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 px-5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner className="w-4 h-4" color="text-primary-foreground" /> : "Create Form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
