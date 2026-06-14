import React from "react";
import { Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface ShareModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  publicFormUrl: string;
}

export function ShareModal({
  isOpen,
  setIsOpen,
  publicFormUrl,
}: ShareModalProps) {
  const t = useTranslations("Builder");

  const handleCopy = () => {
    navigator.clipboard.writeText(publicFormUrl);
    alert(t("shareCopied"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl text-foreground">
        <DialogHeader>
          <DialogTitle className="font-outfit text-xl font-bold">{t("shareTitle")}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs mt-1">
            {t("shareDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center text-center space-y-6 my-4">
          <div className="p-4 bg-white border border-border rounded-2xl shadow-sm">
            <QRCodeSVG value={publicFormUrl} size={160} />
          </div>

          <div className="w-full space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block text-left">
              {t("shareLink")}
            </label>
            <div className="flex items-center rounded-xl border border-border overflow-hidden bg-muted/50 w-full">
              <Input
                type="text"
                value={publicFormUrl}
                readOnly
                className="flex-1 h-9 px-3 bg-transparent border-0 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 font-mono shadow-none"
              />
              <Button
                onClick={handleCopy}
                className="h-9 rounded-none bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{t("shareCopy")}</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 mt-2 border-t border-border flex justify-end">
          <Button
            variant="secondary"
            onClick={() => setIsOpen(false)}
            className="h-9 px-4 text-xs font-semibold rounded-xl"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
