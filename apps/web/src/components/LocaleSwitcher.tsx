"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { setLocaleAction } from "../app/actions/locale";
import { Globe, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const handleValueChange = async (newLocale: string) => {
    if (newLocale === locale) {
      setOpen(false);
      return;
    }
    await setLocaleAction(newLocale);
    window.location.reload();
  };

  const getLocaleLabel = (loc: string) => {
    if (loc === "hi") return "हिन्दी (Hindi)";
    return "English";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-[130px] bg-card/50 border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all rounded-lg text-xs font-semibold gap-1.5 shrink-0 justify-between px-3"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{getLocaleLabel(locale)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0 select-none">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[150px] bg-popover border-border rounded-xl text-popover-foreground p-1 shadow-lg z-50">
        <div className="space-y-0.5">
          <button
            onClick={() => handleValueChange("en")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
              locale === "en"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <span>English</span>
            {locale === "en" && <Check className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => handleValueChange("hi")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
              locale === "hi"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <span>हिन्दी (Hindi)</span>
            {locale === "hi" && <Check className="h-3.5 w-3.5" />}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
