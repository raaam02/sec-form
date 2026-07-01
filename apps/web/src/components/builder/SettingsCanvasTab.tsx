import React from "react";
import { CheckCircle2, Send, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface SettingsCanvasTabProps {
  visibility: "draft" | "public" | "unlisted";
  onSaveVisibility: (v: "draft" | "public" | "unlisted") => Promise<void>;
  layoutMode?: "standard" | "single_field" | "custom_steps";
  setLayoutMode?: (mode: "standard" | "single_field" | "custom_steps") => void;
  slug: string;
  initialSlug: string;
  onSaveSlug: (slug: string) => Promise<void>;
  onValidateSlug: (slug: string) => Promise<"available" | "taken" | "invalid" | "network_error">;
  telegramEnabled: boolean;
  onSaveTelegram: (telegram: { enabled: boolean; chatId?: string; chatName?: string }) => Promise<void>;
  telegramChatId: string;
  telegramChatName: string;
  formId: string;
  allowedDomainsText: string;
  handleDomainsChange: (text: string) => void;
  onSaveAllowedDomains: (domains: string[]) => Promise<void>;
  manualChatIdInput: string;
  setManualChatIdInput: (val: string) => void;
  publicFormUrl: string;
}

export function SettingsCanvasTab({
  visibility,
  onSaveVisibility,
  layoutMode,
  setLayoutMode,
  slug,
  initialSlug,
  onSaveSlug,
  onValidateSlug,
  telegramEnabled,
  onSaveTelegram,
  telegramChatId,
  telegramChatName,
  formId,
  allowedDomainsText,
  handleDomainsChange,
  onSaveAllowedDomains,
  manualChatIdInput,
  setManualChatIdInput,
  publicFormUrl,
}: SettingsCanvasTabProps) {
  const t = useTranslations("Builder");
  const tCommon = useTranslations("Common");

  const [tempSlug, setTempSlug] = React.useState(slug);
  const [slugStatus, setSlugStatus] = React.useState<"idle" | "checking" | "available" | "taken" | "invalid" | "network_error">("idle");
  const [isSavingSlug, setIsSavingSlug] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    setTempSlug(slug);
  }, [slug]);

  React.useEffect(() => {
    const trimmed = tempSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (trimmed !== tempSlug) {
      setTempSlug(trimmed);
      return;
    }

    if (trimmed === initialSlug) {
      setSlugStatus("idle");
      return;
    }

    if (trimmed.length < 3 || !/^[a-z0-9-]+$/.test(trimmed)) {
      setSlugStatus("invalid");
      return;
    }

    setSlugStatus("checking");
    const timeout = setTimeout(async () => {
      const status = await onValidateSlug(trimmed);
      setSlugStatus(status);
    }, 500);

    return () => clearTimeout(timeout);
  }, [tempSlug, initialSlug, onValidateSlug]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicFormUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Form URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleSaveSlugClick = async () => {
    if (slugStatus !== "available") return;
    setIsSavingSlug(true);
    try {
      await onSaveSlug(tempSlug);
    } catch (err: any) {
      toast.error(err.message || "Failed to save slug");
    } finally {
      setIsSavingSlug(false);
    }
  };

  const handleDomainsBlur = () => {
    const domains = allowedDomainsText
      .split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    onSaveAllowedDomains(domains);
  };

  const slugBorderColor =
    slugStatus === "available" ? "border-emerald-500 focus-within:ring-emerald-500/20" :
    slugStatus === "taken" || slugStatus === "invalid" ? "border-rose-500 focus-within:ring-rose-500/20" :
    slugStatus === "network_error" ? "border-amber-500 focus-within:ring-amber-500/20" :
    "border-border";

  return (
    <div className="backdrop-blur-[1px] p-4 rounded-3xl border border-border/70 space-y-5 flex flex-col gap-2 text-xs text-muted-foreground font-semibold">
      {/* Visibility Toggle */}
      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-foreground capitalize tracking-wider block">Public Visibility</label>
            <p className="text-[11px] font-normal leading-normal text-muted-foreground max-w-[280px]">
              {visibility === "public"
                ? "Public forms are open for anyone to view and submit responses."
                : "Unlisted forms are private. Only the creator can view; public submissions are disabled."}
            </p>
          </div>
          <Switch
            checked={visibility === "public"}
            onCheckedChange={(checked) => onSaveVisibility(checked ? "public" : "unlisted")}
          />
        </div>
      </div>

      {/* Form Display Layout */}
      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-2">Form Display Layout</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { mode: "standard", label: "Standard (1 Page)" },
            { mode: "single_field", label: "Single Field per Step" },
            { mode: "custom_steps", label: "Custom Steps" }
          ].map((option) => (
            <Button
              key={option.mode}
              type="button"
              variant={layoutMode === option.mode ? "default" : "outline"}
              onClick={() => setLayoutMode && setLayoutMode(option.mode as any)}
              className="h-9 w-full font-bold text-xs transition-colors rounded-xl"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-normal leading-normal">
          {layoutMode === "standard" && "All fields are displayed on a single page."}
          {layoutMode === "single_field" && "Each field gets its own separate page with Next/Back buttons."}
          {layoutMode === "custom_steps" && "Drag and drop 'Step Break' fields into the canvas to split the form into custom pages."}
        </p>
      </div>

      {/* Custom Form URL Slug */}
      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1.5">Custom Form URL Slug</label>
        <div className="flex items-center gap-2">
          <div className={`flex-1 flex items-center rounded-xl border ${slugBorderColor} overflow-hidden bg-background/50 transition-colors`}>
            <span className="text-xs font-mono text-muted-foreground px-3 bg-muted/40 h-9 flex items-center border-r border-border shrink-0 select-none">/f/</span>
            <Input
              type="text"
              value={tempSlug}
              onChange={(e) => setTempSlug(e.target.value)}
              className="flex-1 h-9 px-3 bg-transparent border-0 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium"
              placeholder="custom-slug"
            />
            {/* Copy button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopyUrl}
              className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0 border-l border-border rounded-none"
              title="Copy URL"
            >
              {isCopied ? <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in duration-200" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          {/* Direct Save Button */}
          {tempSlug !== initialSlug && (
            <Button
              type="button"
              onClick={handleSaveSlugClick}
              disabled={slugStatus !== "available" || isSavingSlug}
              className="h-9 px-3 font-semibold text-xs rounded-xl shrink-0 gap-1.5 min-w-[64px] transition-all animate-in fade-in zoom-in duration-200"
            >
              {isSavingSlug ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
            </Button>
          )}
        </div>

        {/* Validation Feedback Messages */}
        <div className="mt-1.5 text-xs font-normal leading-normal">
          {slugStatus === "checking" && <span className="text-muted-foreground flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin inline" /> Checking availability...</span>}
          {slugStatus === "available" && <span className="text-emerald-600 dark:text-emerald-500 font-medium">✓ Available & valid slug! Click Save to apply.</span>}
          {slugStatus === "taken" && <span className="text-rose-600 dark:text-rose-500 font-medium">✗ This custom slug is already taken.</span>}
          {slugStatus === "invalid" && <span className="text-rose-600 dark:text-rose-500 font-medium">✗ Must be 3+ characters and contain only lowercase letters, numbers, and dashes.</span>}
          {slugStatus === "network_error" && <span className="text-amber-600 dark:text-amber-500 font-medium">⚠ Server connection issue. Please check your network or try again later.</span>}
          {slugStatus === "idle" && <span className="text-muted-foreground font-normal">This is the current active slug.</span>}
        </div>
      </div>

      {/* Telegram Notifications */}
      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1">Telegram Notifications</label>
            <p className="text-xs text-muted-foreground font-normal leading-normal">
              Receive real-time notifications in your own Telegram chats when answers are submitted.
            </p>
          </div>
          <Switch
            checked={telegramEnabled}
            onCheckedChange={(checked) => {
              onSaveTelegram({
                enabled: checked,
                chatId: telegramChatId || undefined,
                chatName: telegramChatName || undefined
              });
            }}
          />
        </div>

        {telegramEnabled && (
          <div className="space-y-4 mt-2">
            {telegramChatId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold">Connected to Telegram</div>
                    <div className="text-[9px] font-normal opacity-90">
                      Linked chat: <span className="font-semibold">{telegramChatName || telegramChatId}</span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onSaveTelegram({
                      enabled: false,
                      chatId: undefined,
                      chatName: undefined
                    });
                  }}
                  className="h-8 px-3 text-[10px] font-bold rounded-xl"
                >
                  Disconnect Telegram
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border-t border-border/60 my-2" />

                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground">
                    Option 1: Quick Connect (Simplest)
                    <p className="mt-0.5 text-xs text-muted-foreground font-normal leading-normal">
                      Click the button below to open our Telegram Bot, then press <strong>Start</strong> to link this form.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "FormuAIBot";
                      window.open(`https://t.me/${botName}?start=${formId}`, "_blank");
                    }}
                    className="h-8 px-3 font-bold text-[10px] uppercase rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Connect Telegram Bot
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground">
                    Option 2: Manual Chat ID Connection
                    <p className="mt-0.5 text-xs text-muted-foreground font-normal leading-normal">
                      Or enter your Telegram Chat ID manually. You can get your Chat ID by messaging the bot <code>@userinfobot</code> on Telegram.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={manualChatIdInput}
                      onChange={(e) => setManualChatIdInput(e.target.value)}
                      placeholder="e.g. 535123456"
                      className="h-9 px-3 bg-muted/50 text-xs text-foreground rounded-xl flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (manualChatIdInput.trim()) {
                          onSaveTelegram({
                            enabled: telegramEnabled,
                            chatId: manualChatIdInput.trim(),
                            chatName: undefined
                          });
                        }
                      }}
                      disabled={!manualChatIdInput.trim()}
                      className="h-9 px-4 font-bold text-[10px] uppercase rounded-xl shrink-0"
                    >
                      Link Chat
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Allowed Embed Domains */}
      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1">Allowed Embed Domains</label>
        <Input
          type="text"
          value={allowedDomainsText}
          onChange={(e) => handleDomainsChange(e.target.value)}
          onBlur={handleDomainsBlur}
          className="h-9 px-3 bg-transparent text-xs text-foreground rounded-xl"
          placeholder="e.g. mywebsite.com, anotherdomain.com"
        />
        <p className="text-xs text-muted-foreground mt-1 font-normal leading-normal">
          Restrict where your form can be embedded. Enter a comma-separated list of domains. Leave empty to allow embedding anywhere. Saves automatically on blur.
        </p>
      </div>
    </div>
  );
}
