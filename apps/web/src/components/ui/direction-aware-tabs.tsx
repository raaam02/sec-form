"use client"

import { ReactNode, useMemo, useState } from "react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

type Tab = {
  id: number
  label: string
  content: ReactNode
}

interface OgImageSectionProps {
  tabs: Tab[]
  className?: string
  /** Outer container radius (e.g. `rounded-lg`) */
  rounded?: string
  /** Inner tab/bubble radius — should be outer radius minus container padding (~3px) */
  roundedInner?: string
  onChange?: () => void
  activeTab?: number
  onTabChange?: (newTabId: number) => void
}

function DirectionAwareTabs({
  tabs,
  className,
  rounded,
  roundedInner,
  onChange,
  activeTab: controlledActiveTab,
  onTabChange,
}: OgImageSectionProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(0)
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [ref, bounds] = useMeasure()

  const content = useMemo(() => {
    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content
    return activeTabContent || null
  }, [activeTab, tabs])

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1
      setDirection(newDirection)
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(newTabId)
      }
      onTabChange?.(newTabId)
      onChange ? onChange() : null
    }
  }

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: "blur(4px)",
    }),
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={cn(
          "flex cursor-pointer space-x-1 rounded-full border border-border/70 bg-secondary/60 backdrop-blur-md p-1 shadow-sm",
          className,
          rounded
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-muted-foreground transition focus-visible:ring-1 focus-visible:outline-none sm:text-xs z-10",
              activeTab === tab.id
                ? "text-foreground font-bold"
                : "hover:text-foreground/80",
              rounded ? roundedInner : undefined
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className={cn(
                  "absolute inset-0 z-[-1] rounded-full bg-background border border-border/80 shadow-sm",
                  rounded ? roundedInner : "rounded-full"
                )}
                transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
              />
            )}

            {tab.label}
          </button>
        ))}
      </div>
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
    </div>
  )
}
export { DirectionAwareTabs }
