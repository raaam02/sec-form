import React from "react";
import { CheckCircle2, Send, Copy, Check, Loader2, Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ConfirmationPopover } from "@/components/ui/confirmation-popover";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Link from "next/link";

import { MorphSelect, MorphSelectOption } from "@/components/arc/morph-select/morph-select";
import { FileText, Layers, Split } from "lucide-react";

const LAYOUT_OPTIONS: MorphSelectOption[] = [
  { value: "standard", label: "Standard (1 Page)", meta: "Single page", icon: <FileText className="h-3.5 w-3.5" /> },
  { value: "single_field", label: "Single Field per Step", meta: "One-by-one", icon: <Layers className="h-3.5 w-3.5" /> },
  { value: "custom_steps", label: "Custom Steps", meta: "Step Breaks", icon: <Split className="h-3.5 w-3.5" /> },
];

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
  allowedDomains: string[];
  onSaveAllowedDomains: (domains: string[]) => Promise<void>;
  manualChatIdInput: string;
  setManualChatIdInput: (val: string) => void;
  publicFormUrl: string;
  isTelegramSyncing?: boolean;
  isTelegramFetching?: boolean;
  onStartTelegramSync?: () => void;
  onCheckTelegramStatus?: () => void;
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
  allowedDomains,
  onSaveAllowedDomains,
  manualChatIdInput,
  setManualChatIdInput,
  publicFormUrl,
  isTelegramSyncing,
  isTelegramFetching,
  onStartTelegramSync,
  onCheckTelegramStatus,
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

    if (trimmed.length < 3 || !/^(?=.*[a-z0-9])[a-z0-9-]+$/.test(trimmed)) {
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

  const [domainInputs, setDomainInputs] = React.useState<string[]>(allowedDomains || []);

  React.useEffect(() => {
    if (allowedDomains) {
      setDomainInputs(allowedDomains);
    }
  }, [allowedDomains]);

  const cleanDomain = (value: string) => {
    let cleaned = value.trim();
    cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?/, "");
    cleaned = cleaned.split("/")[0];
    cleaned = cleaned.split("?")[0];
    return cleaned.toLowerCase();
  };

  const isValidDomain = (d: string) => {
    if (!d) return true;
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanDomain(d));
  };

  const handleDomainInputChange = (index: number, val: string) => {
    const updated = [...domainInputs];
    updated[index] = val;
    setDomainInputs(updated);
  };

  const handleDomainInputBlur = () => {
    const validDomains = domainInputs
      .map(cleanDomain)
      .filter((d) => d && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(d));
    onSaveAllowedDomains(validDomains);
  };

  const addDomainInput = () => {
    if (domainInputs.length < 4) {
      setDomainInputs([...domainInputs, ""]);
    }
  };

  const removeDomainInput = (index: number) => {
    const updated = domainInputs.filter((_, i) => i !== index);
    setDomainInputs(updated);
    const validDomains = updated
      .map(cleanDomain)
      .filter((d) => d && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(d));
    onSaveAllowedDomains(validDomains);
  };

  const slugBorderColor =
    slugStatus === "available" ? "border-emerald-500 focus-within:ring-emerald-500/20" :
    slugStatus === "taken" || slugStatus === "invalid" ? "border-rose-500 focus-within:ring-rose-500/20" :
    slugStatus === "network_error" ? "border-amber-500 focus-within:ring-amber-500/20" :
    "border-border/70";

  return (
    <div className="space-y-6 text-xs text-muted-foreground font-medium">
      {/* Visibility Toggle */}
      <div className="flex items-center justify-between pb-5 border-b border-border/40">
        <div className="space-y-0.5 pr-4">
          <label className="text-xs font-semibold text-foreground block">
            {visibility === "public" ? t("public_visibility") : t("unlisted_visibility")}
          </label>
          <p className="text-[11px] font-normal leading-relaxed text-muted-foreground">
            {visibility === "public"
              ? "Public forms are open for anyone to view and submit responses."
              : "Unlisted forms are private. Only the creator can view; public submissions are disabled."}
          </p>
        </div>
        {visibility === "public" ? (
          <ConfirmationPopover
            onConfirm={() => onSaveVisibility("unlisted")}
            title="Unlist Form?"
            description="Are you sure you want to unlist this form? Public submissions will be disabled."
            confirmText="Unlist"
            cancelText="Cancel"
          >
            <div className="cursor-pointer shrink-0">
              <Switch checked={true} className="pointer-events-none" />
            </div>
          </ConfirmationPopover>
        ) : (
          <Switch
            checked={false}
            className="shrink-0"
            onCheckedChange={(checked) => {
              if (checked) {
                onSaveVisibility("public");
              }
            }}
          />
        )}
      </div>

      {/* Form Display Layout with MorphSelect */}
      <div className="space-y-2 pb-5 border-b border-border/40">
        <label className="text-xs font-semibold text-foreground block">
          Form Display Layout
        </label>
        <MorphSelect
          label="Form Display Layout"
          hideLabel
          items={LAYOUT_OPTIONS}
          value={layoutMode || "standard"}
          onValueChange={(val) => setLayoutMode && setLayoutMode(val as any)}
          panelWidth={320}
          className="w-full"
        />
        <p className="text-[11px] text-muted-foreground mt-2 font-normal leading-relaxed">
          {(!layoutMode || layoutMode === "standard") && "All fields are displayed sequentially on a single page."}
          {layoutMode === "single_field" && "Each field gets its own separate card with Next/Back buttons."}
          {layoutMode === "custom_steps" && "Drag and drop 'Step Break' fields into the canvas to split the form into custom pages."}
        </p>
      </div>

      {/* Custom Form URL Slug */}
      <div className="space-y-2 pb-5 border-b border-border/40">
        <label className="text-xs font-semibold text-foreground block">
          Custom Form URL Slug
        </label>
        <div className="flex items-center gap-2">
          <div className={`flex-1 flex items-center rounded-xl border ${slugBorderColor} overflow-hidden bg-background/50 transition-colors`}>
            <span className="text-xs font-mono text-muted-foreground px-2.5 bg-muted/40 h-8 flex items-center border-r border-border shrink-0 select-none">/f/</span>
            <Input
              type="text"
              value={tempSlug}
              onChange={(e) => setTempSlug(e.target.value)}
              className="flex-1 h-8 px-2.5 bg-transparent border-0 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium"
              placeholder="custom-slug"
            />
            {/* Copy button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCopyUrl}
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 border-l border-border rounded-none"
              title="Copy URL"
            >
              {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-in zoom-in duration-200" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
          {/* Direct Save Button */}
          {tempSlug !== initialSlug && (
            <Button
              type="button"
              onClick={handleSaveSlugClick}
              disabled={slugStatus !== "available" || isSavingSlug}
              className="h-8 px-3 font-semibold text-xs rounded-xl shrink-0 gap-1.5 min-w-[60px] transition-all animate-in fade-in zoom-in duration-200"
            >
              {isSavingSlug ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
            </Button>
          )}
        </div>

        {/* Validation Feedback Messages */}
        <div className="text-[11px] font-normal leading-relaxed">
          {slugStatus === "checking" && <span className="text-muted-foreground flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin inline" /> Checking availability...</span>}
          {slugStatus === "available" && <span className="text-emerald-600 dark:text-emerald-500 font-medium">✓ Available & valid slug! Click Save to apply.</span>}
          {slugStatus === "taken" && <span className="text-rose-600 dark:text-rose-500 font-medium">✗ This custom slug is already taken.</span>}
          {slugStatus === "invalid" && <span className="text-rose-600 dark:text-rose-500 font-medium">✗ Must be 3+ characters and contain only lowercase letters, numbers, and dashes.</span>}
          {slugStatus === "network_error" && <span className="text-amber-600 dark:text-amber-500 font-medium">⚠ Server connection issue. Please check your network or try again later.</span>}
          {slugStatus === "idle" && <span className="text-muted-foreground font-normal">This is the current active slug.</span>}
        </div>
      </div>

      {/* Telegram Notifications */}
      <div className="space-y-3 pb-5 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="pr-4">
            <label className="text-xs font-semibold text-foreground block mb-0.5">Telegram Notifications</label>
            <p className="text-[11px] text-muted-foreground font-normal leading-relaxed">
              Receive real-time notifications in Telegram when responses are submitted.
            </p>
          </div>
          <Switch
            checked={telegramEnabled}
            className="shrink-0"
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
          <div className="space-y-3 pt-2">
            {telegramChatId ? (
              <div className="space-y-2">
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
                  className="h-7 px-2.5 text-[10px] font-medium rounded-lg"
                >
                  Disconnect Telegram
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-foreground">
                    Quick Connect via Bot
                    <p className="mt-0.5 text-[11px] text-muted-foreground font-normal leading-relaxed">
                      Open our Telegram Bot and press <strong>Start</strong> to link this form.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        onSaveTelegram({
                          enabled: true,
                          chatId: telegramChatId || undefined,
                          chatName: telegramChatName || undefined
                        });
                        const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "FormuAi_bot";
                        window.open(`https://t.me/${botName}?start=${formId}`, "_blank");
                        onStartTelegramSync?.();
                      }}
                      disabled={isTelegramSyncing}
                      className="h-8 px-3 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      {isTelegramSyncing ? (
                        isTelegramFetching ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                            Connecting...
                          </>
                        )
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Connect Telegram Bot
                        </>
                      )}
                    </Button>

                    {isTelegramSyncing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onCheckTelegramStatus?.()}
                        className="h-8 px-2.5 font-medium text-xs rounded-xl flex items-center gap-1.5 border-border hover:bg-muted"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Check Status
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/30">
                  <div className="text-[11px] font-semibold text-foreground">
                    Or Enter Chat ID Manually
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={manualChatIdInput}
                      onChange={(e) => setManualChatIdInput(e.target.value)}
                      placeholder="e.g. 535123456"
                      className="h-8 px-2.5 bg-background/50 text-xs text-foreground rounded-xl flex-1 border-border/70"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (manualChatIdInput.trim()) {
                          onSaveTelegram({
                            enabled: true,
                            chatId: manualChatIdInput.trim(),
                            chatName: undefined
                          });
                        }
                      }}
                      disabled={!manualChatIdInput.trim()}
                      className="h-8 px-3 font-medium text-xs rounded-xl shrink-0"
                    >
                      Link
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Allowed Embed Domains */}
      <div className="space-y-2.5">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-0.5">Allowed Embed Domains</label>
          <p className="text-[11px] text-muted-foreground font-normal leading-relaxed">
            Restrict where this form can be embedded. Enter specific domains (max 4) or leave empty for anywhere.
          </p>
        </div>

        {domainInputs.length === 0 ? (
          <p className="text-[11px] font-normal text-muted-foreground italic py-0.5">
            Embedding is currently allowed on any domain.
          </p>
        ) : (
          <div className="space-y-2">
            {domainInputs.map((domain, index) => {
              const valid = isValidDomain(domain);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={domain}
                      onChange={(e) => handleDomainInputChange(index, e.target.value)}
                      onBlur={handleDomainInputBlur}
                      placeholder="e.g. mywebsite.com"
                      className={`h-8 px-2.5 bg-background/50 text-xs text-foreground rounded-xl flex-1 focus-visible:ring-1 transition-colors ${
                        !valid ? "border-rose-500 focus-visible:ring-rose-500/30" : "border-border/70 focus-visible:ring-primary/30"
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDomainInput(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {!valid && (
                    <p className="text-[10px] text-rose-500 font-medium pl-1">
                      Invalid domain format. Protocol and paths will be stripped.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {domainInputs.length < 4 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDomainInput}
            className="h-7 px-2.5 font-medium text-xs rounded-lg flex items-center gap-1.5 w-fit border-border/70 hover:bg-muted"
          >
            <Plus className="h-3 w-3" />
            Add Domain
          </Button>
        )}
      </div>
    </div>
  );
}
