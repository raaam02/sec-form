"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress
 * A slim top-of-page progress bar that fires the instant the user clicks any
 * anchor / Next.js Link. It completes when the new pathname is detected.
 * No external dependencies — pure React + CSS animation.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname + searchParams.toString());

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const start = useCallback(() => {
    clear();
    // Instant initial progress so user immediately sees response
    setProgress(15);
    setVisible(true);

    let current = 15;
    intervalRef.current = setInterval(() => {
      // Ease towards 85% — never quite reaches 100% until navigation completes
      const remaining = 85 - current;
      const step = Math.max(0.5, remaining * 0.1);
      current = Math.min(current + step, 85);
      setProgress(current);
    }, 60);
  }, []);

  const finish = useCallback(() => {
    clear();
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  // Detect route change completion
  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (current !== prevPathRef.current) {
      prevPathRef.current = current;
      finish();
    }
  }, [pathname, searchParams, finish]);

  // Intercept history.pushState and history.replaceState for programmatic navigation (e.g., router.push)
  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const url = args[2];
      if (url) {
        const dest = typeof url === "string" ? url : url.toString();
        const current = window.location.pathname + window.location.search;
        if (dest !== current && !dest.startsWith("#")) {
          // Defer update so it doesn't trigger synchronously during React's insertion/render phase
          setTimeout(() => {
            start();
          }, 0);
        }
      }
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      return originalReplaceState.apply(this, args);
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [start]);

  // Listen for clicks on anchors and Next.js Link elements (using capture phase so child element clicks aren't lost)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger on right click or modified clicks
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = (e.target as Element | null)?.closest?.("a");
      if (!target) return;

      // Ignore links that don't open in the current window/tab
      const linkTarget = target.getAttribute("target");
      if (linkTarget && linkTarget !== "_self") return;

      // Ignore download links
      if (target.hasAttribute("download")) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

      // Ignore auth modal triggers
      if (
        href === "/login" ||
        href === "/signup" ||
        href.startsWith("/login?") ||
        href.startsWith("/signup?") ||
        target.hasAttribute("data-no-progress")
      ) {
        return;
      }

      // Only trigger for internal same-origin navigation
      if (href.startsWith("/") || href.startsWith(window.location.origin)) {
        const dest = href.startsWith("/") ? href : href.slice(window.location.origin.length);
        const current = pathname + searchParams.toString();
        // Only show if navigating away from the current page
        if (dest !== current) {
          start();
        }
      }
    };

    // Use capture: true so we receive the click before any stopPropagation
    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      clear();
    };
  }, [pathname, searchParams, start]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-[3px] transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
          boxShadow: "0 0 10px rgba(139, 92, 246, 0.8), 0 0 4px rgba(236, 72, 153, 0.6)",
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
