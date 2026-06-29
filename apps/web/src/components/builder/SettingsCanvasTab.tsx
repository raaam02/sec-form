import React from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

interface SettingsCanvasTabProps {
  visibility: "draft" | "public" | "unlisted";
  setVisibility: (mode: "draft" | "public" | "unlisted") => void;
  layoutMode?: "standard" | "single_field" | "custom_steps";
  setLayoutMode?: (mode: "standard" | "single_field" | "custom_steps") => void;
  slug: string;
  setSlug: (slug: string) => void;
  telegramEnabled: boolean;
  setTelegramEnabled: (v: boolean) => void;
  telegramChatId: string;
  setTelegramChatId: (v: string) => void;
  telegramChatName: string;
  setTelegramChatName: (v: string) => void;
  formId: string;
  allowedDomainsText: string;
  handleDomainsChange: (text: string) => void;
  manualChatIdInput: string;
  setManualChatIdInput: (val: string) => void;
  handleSaveSettings: (e: React.FormEvent) => void;
}

export function SettingsCanvasTab({
  visibility,
  setVisibility,
  layoutMode,
  setLayoutMode,
  slug,
  setSlug,
  telegramEnabled,
  setTelegramEnabled,
  telegramChatId,
  setTelegramChatId,
  telegramChatName,
  setTelegramChatName,
  formId,
  allowedDomainsText,
  handleDomainsChange,
  manualChatIdInput,
  setManualChatIdInput,
  handleSaveSettings,
}: SettingsCanvasTabProps) {
  const t = useTranslations("Builder");
  const tCommon = useTranslations("Common");

  return (
    <form onSubmit={handleSaveSettings} className="backdrop-blur-[1px] p-4 rounded-3xl border border-border/70 space-y-5 flex flex-col gap-2 text-xs text-muted-foreground font-semibold">
      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-2">Visibility Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {(["public", "unlisted"] as const).map((mode) => (
            <Button
              key={mode}
              type="button"
              variant={visibility === mode ? "default" : "outline"}
              onClick={() => setVisibility(mode)}
              className={`h-9 w-full font-bold text-xs capitalize transition-colors rounded-xl`}
            >
              {mode}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-normal leading-normal">
          {visibility === "public" && "Public forms are open for anyone to view and submit responses."}
          {visibility === "unlisted" && "Unlisted forms are private. Only the creator can view it; public submissions are disabled."}
        </p>
      </div>

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
              className={`h-9 w-full font-bold text-xs transition-colors rounded-xl`}
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

      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1">Custom Form URL Slug</label>
        <div className="flex items-center rounded-xl border border-border overflow-hidden">
          <span className="text-xs font-mono text-muted-foreground px-3 bg-muted/40 h-9 flex items-center border-r border-border">/f/</span>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            className="flex-1 h-9 px-3 bg-transparent border-0 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            placeholder="custom-slug"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-normal">Shorthand slug name. Letters, numbers, and dashes only.</p>
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
            onCheckedChange={setTelegramEnabled}
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
                    setTelegramChatId("");
                    setTelegramChatName("");
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
                          setTelegramChatId(manualChatIdInput.trim());
                          setTelegramChatName("Manual Input");
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

      <div className="p-4 rounded-lg bg-secondary/35 backdrop-blur-[1px]">
        <label className="text-xs font-bold text-foreground capitalize tracking-wider block mb-1">Allowed Embed Domains</label>
        <Input
          type="text"
          value={allowedDomainsText}
          onChange={(e) => handleDomainsChange(e.target.value)}
          className="h-9 px-3 bg-transparent text-xs text-foreground rounded-xl"
          placeholder="e.g. mywebsite.com, anotherdomain.com"
        />
        <p className="text-xs text-muted-foreground mt-1 font-normal leading-normal">
          Restrict where your form can be embedded. Enter a comma-separated list of domains. Leave empty to allow embedding anywhere.
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="submit"
          className="h-9 px-4 font-semibold text-xs rounded-xl"
        >
          {tCommon("save")}
        </Button>
      </div>
    </form>
  );
}
