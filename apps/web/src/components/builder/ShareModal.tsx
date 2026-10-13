"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, QrCode, Code2, Link2, Globe } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BottomSheet } from "@/components/arc/bottom-sheet/bottom-sheet";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  publicFormUrl: string;
  formId?: string;
  hostOrigin?: string;
}

export function ShareModal({
  isOpen,
  setIsOpen,
  publicFormUrl,
  formId,
  hostOrigin = typeof window !== "undefined" ? window.location.origin : "",
}: ShareModalProps) {
  const t = useTranslations("Builder");
  const [activeTab, setActiveTab] = useState<"link" | "embed">("link");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const iframeSnippet = `<iframe src="${publicFormUrl}" width="100%" height="650px" frameborder="0" style="border: none; border-radius: 12px; width: 100%;"></iframe>`;
  const scriptSnippet = `<div id="sec-form-embed-${formId || "form"}"></div>\n<script src="${hostOrigin}/embed.js" data-form="${formId || ""}" data-target="sec-form-embed-${formId || "form"}"></script>`;

  const handleCopy = (text: string, type: "link" | "iframe" | "script") => {
    navigator.clipboard.writeText(text);
    if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === "iframe") {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    } else if (type === "script") {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
    toast.success(t("shareCopied") || "Copied to clipboard!");
  };

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Share & Embed Form"
      description="Distribute your form with a direct link, QR code, or embed on your website."
      detents={[0.65, 0.92]}
      initialDetent={0}
    >
      <div className="max-w-xl mx-auto space-y-6 pt-1 pb-6 px-1">
        {/* Segmented Tab Switcher */}
        <div className="flex p-1 bg-muted/60 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "link"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Direct Link & QR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("embed")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "embed"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Website Embed</span>
          </button>
        </div>

        {activeTab === "link" ? (
          <div className="space-y-6">
            {/* Direct Link Section */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Public Form URL
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center rounded-xl border border-border/80 bg-muted/30 px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20">
                  <Globe className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="text"
                    value={publicFormUrl}
                    readOnly
                    className="w-full text-xs font-mono bg-transparent border-none focus:outline-none text-foreground select-all"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleCopy(publicFormUrl, "link")}
                  className="rounded-xl h-9 px-4 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
                </Button>
                {publicFormUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(publicFormUrl, "_blank")}
                    className="rounded-xl h-9 w-9 shrink-0"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border/60 bg-muted/20 space-y-3">
              <div className="p-3.5 bg-white rounded-2xl shadow-md border border-black/10">
                <QRCodeSVG value={publicFormUrl || "https://sec-form.com"} size={140} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">Scan with phone camera</p>
                <p className="text-[11px] text-muted-foreground">
                  Instantly open and test the respondent form on any mobile device.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* iFrame Embed */}
            <div className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">iFrame Embed</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Embed inside any website (WordPress, Webflow, Notion, HTML).
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(iframeSnippet, "iframe")}
                  className="h-8 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedIframe ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIframe ? "Copied!" : "Copy Code"}</span>
                </Button>
              </div>
              <pre className="p-3 bg-muted/70 rounded-xl text-[11px] font-mono text-foreground overflow-x-auto whitespace-pre-wrap border border-border/60 select-all">
                {iframeSnippet}
              </pre>
            </div>

            {/* JavaScript Embed */}
            <div className="p-4 rounded-2xl border border-border/70 bg-muted/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">JavaScript SDK Tag</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Embed directly via dynamic script tag.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(scriptSnippet, "script")}
                  className="h-8 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? "Copied!" : "Copy Tag"}</span>
                </Button>
              </div>
              <pre className="p-3 bg-muted/70 rounded-xl text-[11px] font-mono text-foreground overflow-x-auto whitespace-pre-wrap border border-border/60 select-all">
                {scriptSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
