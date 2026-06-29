import React from "react";
import { Copy, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface EmbedCanvasTabProps {
  publicFormUrl: string;
  id: string;
  hostOrigin: string;
}

export function EmbedCanvasTab({
  publicFormUrl,
  id,
  hostOrigin,
}: EmbedCanvasTabProps) {
  const t = useTranslations("Builder");

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("shareCopied"));
  };

  return (
    <div className="space-y-6">
      {/* Embed Code Section */}
      <div className="backdrop-blur-[1px] p-6 rounded-3xl border border-border/70 bg-card/20 space-y-4">
        <div>
          <h3 className="font-outfit font-bold text-foreground text-sm">{t("shareEmbed")} Code</h3>
          <p className="text-muted-foreground text-[10px] mt-0.5">Embed the form on any webpage using an iframe.</p>
        </div>
        
        <div className="relative">
          <pre className="bg-muted p-2.5 rounded-lg text-[10px] text-foreground overflow-x-auto whitespace-pre-wrap font-mono select-all pr-10 border border-border">
            {`<iframe src="${publicFormUrl}" width="100%" height="600px" frameborder="0"></iframe>`}
          </pre>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleCopyCode(`<iframe src="${publicFormUrl}" width="100%" height="600px" frameborder="0"></iframe>`)}
            className="absolute right-2 top-2 h-7 w-7 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Script Tag Section */}
      <div className="backdrop-blur-[1px] p-6 rounded-3xl border border-border/70 bg-card/20 space-y-4">
        <div>
          <h3 className="font-outfit font-bold text-foreground text-sm">JavaScript Script Tag</h3>
          <p className="text-muted-foreground text-[10px] mt-0.5">Embed using a clean SDK script tag.</p>
        </div>
        
        <div className="relative">
          <pre className="bg-muted p-2.5 rounded-lg text-[10px] text-foreground overflow-x-auto whitespace-pre-wrap font-mono select-all pr-10 border border-border">
            {`<div id="formu-embed-${id}"></div>\n<script src="${hostOrigin}/embed.js" data-form="${id}" data-target="formu-embed-${id}"></script>`}
          </pre>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleCopyCode(`<div id="formu-embed-${id}"></div>\n<script src="${hostOrigin}/embed.js" data-form="${id}" data-target="formu-embed-${id}"></script>`)}
            className="absolute right-2 top-2 h-7 w-7 rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="backdrop-blur-[1px] p-6 rounded-3xl border border-border/70 bg-card/20 flex flex-col items-center text-center space-y-4">
        <div className="flex flex-col items-center">
          <QrCode className="h-6 w-6 text-indigo-600 mb-1" />
          <h3 className="font-outfit font-bold text-foreground text-sm">QR Code Sharing</h3>
          <p className="text-muted-foreground text-[10px] mt-0.5 mb-4">Scan to open the public form instantly on mobile.</p>
        </div>
        
        <div className="p-3 bg-white border border-border rounded-2xl shadow-sm">
          <QRCodeSVG value={publicFormUrl} size={130} />
        </div>
        
        <span className="font-mono text-[10px] text-indigo-600 mt-3 select-all truncate max-w-full">{publicFormUrl}</span>
      </div>
    </div>
  );
}
