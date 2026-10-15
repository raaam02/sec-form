import React from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onComplete: (val: string) => void;
}

// Simple throttle utility to limit function execution rate and prevent React re-render lag
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle = false;
  let lastArgs: any[] | null = null;

  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  } as any;
}

export function ColorPicker({ label, value, onChange, onComplete }: ColorPickerProps) {
  const [localVal, setLocalVal] = React.useState(value);

  // Sync local value when parent value changes (e.g. preset clicked)
  React.useEffect(() => {
    setLocalVal(value);
  }, [value]);

  const onChangeRef = React.useRef(onChange);
  const onCompleteRef = React.useRef(onComplete);

  React.useEffect(() => {
    onChangeRef.current = onChange;
    onCompleteRef.current = onComplete;
  }, [onChange, onComplete]);

  // Create a throttled parent update function, preserved across renders
  const throttledOnChange = React.useRef(
    throttle((val: string) => {
      onChangeRef.current(val);
    }, 60) // 60ms throttle provides super smooth UI dragging (approx 16-17 updates/sec)
  );

  const handleChange = (newVal: string) => {
    setLocalVal(newVal);
    throttledOnChange.current(newVal);
  };

  const handleBlur = () => {
    if (localVal !== value) {
      onCompleteRef.current(localVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground block truncate">
        {label}
      </label>
      <div className="relative flex items-center h-9 w-full rounded-xl border border-border/70 bg-background/60 hover:border-foreground/30 focus-within:border-primary/80 focus-within:ring-1 focus-within:ring-primary/20 transition-all px-2.5 gap-2">
        {/* Color Swatch with overlaid invisible native color input */}
        <div
          className="relative h-5 w-5 rounded-md border border-black/15 dark:border-white/20 shrink-0 shadow-xs cursor-pointer overflow-hidden"
          style={{ backgroundColor: localVal || "#ffffff" }}
          title="Pick color"
        >
          <input
            type="color"
            value={localVal && localVal.startsWith("#") ? localVal : "#ffffff"}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className="absolute -inset-2 w-[150%] h-[150%] opacity-0 cursor-pointer"
          />
        </div>
        {/* Hex input */}
        <input
          type="text"
          value={localVal || ""}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 p-0 text-xs font-mono text-foreground focus:outline-none uppercase min-w-0"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );
}
