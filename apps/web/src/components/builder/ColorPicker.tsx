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

  // Create a throttled parent update function, preserved across renders
  const throttledOnChange = React.useRef(
    throttle((val: string) => {
      onChange(val);
    }, 60) // 60ms throttle provides super smooth UI dragging (approx 16-17 updates/sec)
  );

  const handleChange = (newVal: string) => {
    setLocalVal(newVal);
    throttledOnChange.current(newVal);
  };

  const handleBlur = () => {
    if (localVal !== value) {
      onComplete(localVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-muted-foreground tracking-wider block">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-lg border border-border overflow-hidden shrink-0 shadow-sm transition-all hover:border-primary/50 focus-within:ring-1 focus-within:ring-ring focus-within:border-primary">
          <input
            type="color"
            value={localVal || "#ffffff"}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer focus:outline-none"
          />
        </div>
        <Input
          type="text"
          value={localVal || ""}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-8 text-xs font-mono rounded-lg"
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}
