"use client";

import { ReactNode, useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

export type DirectionAwareTab = {
  id: number;
  label: string;
  icon?: React.ElementType;
  iconColorClass?: string;
  content?: ReactNode;
};

interface DirectionAwareTabsProps {
  tabs: DirectionAwareTab[];
  className?: string;
  /** Outer container radius (e.g. `rounded-full`) */
  rounded?: string;
  /** Inner tab/bubble radius */
  roundedInner?: string;
  onChange?: () => void;
  activeTab?: number;
  onTabChange?: (newTabId: number) => void;
  showContent?: boolean;
}

export function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  roundedInner,
  onChange,
  activeTab: controlledActiveTab,
  onTabChange,
  showContent = true,
}: DirectionAwareTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ref, bounds] = useMeasure();

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
    return activeTabContent || null;
  }, [activeTab, tabs]);

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1;
      setDirection(newDirection);
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(newTabId);
      }
      onTabChange?.(newTabId);
      onChange ? onChange() : null;
    }
  };

  const variants = {
    initial: (dir: number) => ({
      x: 300 * dir,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: -300 * dir,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Direction-Aware Tab Pills */}
      <div
        className={cn(
          "flex cursor-pointer items-center space-x-1 rounded-full border border-border/80 bg-secondary/80 backdrop-blur-xl p-1 shadow-inner ring-1 ring-white/[0.05]",
          className,
          rounded
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none z-10 select-none",
                isSelected
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
                rounded ? roundedInner : undefined
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isSelected && (
                <motion.span
                  layoutId="direction-aware-tab-bubble"
                  className={cn(
                    "absolute inset-0 z-[-1] rounded-full bg-background border border-border/90 shadow-sm",
                    rounded ? roundedInner : "rounded-full"
                  )}
                  transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
                />
              )}

              {Icon && (
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 transition-colors shrink-0",
                    tab.iconColorClass || (isSelected ? "text-primary" : "text-muted-foreground")
                  )}
                />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Optional Content Container */}
      {showContent && content && (
        <MotionConfig transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}>
          <motion.div
            className="relative mx-auto h-full w-full overflow-hidden"
            initial={false}
            animate={{ height: bounds.height }}
          >
            <div className="p-1" ref={ref}>
              <AnimatePresence
                custom={direction}
                mode="popLayout"
                onExitComplete={() => setIsAnimating(false)}
              >
                <motion.div
                  key={activeTab}
                  variants={variants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  custom={direction}
                  onAnimationStart={() => setIsAnimating(true)}
                  onAnimationComplete={() => setIsAnimating(false)}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </MotionConfig>
      )}
    </div>
  );
}
