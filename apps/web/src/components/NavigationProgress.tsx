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
    setProgress(0);
    setVisible(true);

    let current = 0;
    intervalRef.current = setInterval(() => {
      // Ease towards 85% — never quite reaches 100% until navigation completes
      const remaining = 85 - current;
      const step = Math.max(0.5, remaining * 0.08);
      current = Math.min(current + step, 85);
      setProgress(current);
    }, 80);
  }, []);

  const finish = useCallback(() => {
    clear();
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  }, []);

  // Detect route change completion
  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (current !== prevPathRef.current) {
      prevPathRef.current = current;
      finish();
    }
  }, [pathname, searchParams, finish]);

  // Listen for clicks on anchors and Next.js Link elements
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

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

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clear();
    };
  }, [pathname, searchParams, start]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-[2.5px] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
          boxShadow: "0 0 8px rgba(139, 92, 246, 0.7)",
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
