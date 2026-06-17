"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";

export interface MascotProps {
  focusedField: "none" | "email" | "password";
  emailLength: number;
  showPassword: boolean;
}

export function LoginMascot({ focusedField, emailLength, showPassword }: MascotProps) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate pupil position based on email length (tracks typing)
  let pupilX = 0;
  let pupilY = 0;

  if (focusedField === "email") {
    pupilY = 3.5;
    if (isDesktop) {
      // Form is on the right side of the screen on desktop
      pupilX = 2.5 + Math.min(emailLength * 0.25, 3.5);
    } else {
      // Form is stacked below the mascot on mobile, cursor starts left and moves right
      pupilX = Math.min(emailLength * 0.4, 6) - 3;
    }
  }

  const [isHappy, setIsHappy] = React.useState(false);

  const triggerHappy = () => {
    setIsHappy(true);

    setTimeout(() => {
      setIsHappy(false);
    }, 500);
  };

  const isHiding = focusedField === "password" && !showPassword;
  const showCuteEyes = isHappy && !isHiding;

  const { resolvedTheme } = useTheme();

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-44 h-44 mx-auto select-none"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
      aria-hidden
    >
      {/* Body */}
      <motion.ellipse
        cx="100" cy="130" rx="65" ry="55"
        className="fill-primary/10 dark:fill-primary/15 stroke-primary/30"
        strokeWidth="2"
      />

      {/* Head */}
      <motion.circle
        cx="100" cy="85" r="50"
        className="fill-card stroke-border"
        strokeWidth="2.5"
        animate={
          isHappy
            ? {
                y: [-2, 0, -2, 0],
              }
            : {}
        }
      />

      {/* Ears */}
      <motion.path
        d="M58 55 L45 25 L72 48"
        className="fill-card stroke-border"
        strokeWidth="2.5"
        strokeLinejoin="round"
        whileTap={{ scale: 0.9 }}
        onTap={triggerHappy}
      />
      <motion.path
        d="M142 55 L155 25 L128 48"
        className="fill-card stroke-border"
        strokeWidth="2.5"
        strokeLinejoin="round"
        whileTap={{ scale: 0.9 }}
        onTap={triggerHappy}
      />

      {/* Inner ears */}
      <motion.path d="M60 54 L52 34 L70 50" className="fill-primary/20 hover:fill-primary" onTap={triggerHappy} whileTap={{ scale: 0.9 }} />
      <motion.path d="M140 54 L148 34 L130 50" className="fill-primary/20 hover:fill-primary" onTap={triggerHappy} whileTap={{ scale: 0.9 }} />

      {/* Eyes container */}
      <g>
        {/* Left eye white */}
        <ellipse cx="78" cy="82" rx="16" ry="17" className="fill-background stroke-border" strokeWidth="1.5" />
        {/* Right eye white */}
        <ellipse cx="122" cy="82" rx="16" ry="17" className="fill-background stroke-border" strokeWidth="1.5" />

        {/* Pupils - animated */}
        <AnimatePresence mode="wait">
          {showCuteEyes ? (
            <motion.g
              key="happy-eyes"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.path
                d="M66 82 Q78 94 90 82"
                fill="none"
                className="stroke-foreground"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <motion.path
                d="M110 82 Q122 94 134 82"
                fill="none"
                className="stroke-foreground"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </motion.g>
          ) : !isHiding ? (
            <motion.g
              key="eyes-open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.circle
                cx={78}
                cy={82}
                r="7"
                className="fill-foreground"
                animate={{ cx: 78 + pupilX, cy: 82 + pupilY }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.circle
                cx={122}
                cy={82}
                r="7"
                className="fill-foreground"
                animate={{ cx: 122 + pupilX, cy: 82 + pupilY }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              {/* Eye shine */}
              <motion.circle
                cx={80}
                cy={79}
                className="fill-background"
                animate={{ cx: 80 + pupilX, cy: 79 + pupilY, r: resolvedTheme === "dark" ? 5 : 2.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.circle
                cx={122}
                cy={79}
                r="2.5"
                className="fill-background"
                animate={{ cx: 122 + pupilX, cy: 79 + pupilY, r: resolvedTheme === "dark" ? 5 : 2.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.g>
          ) : (
            <motion.g
              key="eyes-covered"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Closed / squinting eyes (cute lines) */}
              <motion.path
                d="M65 83 Q78 90 91 83"
                fill="none"
                className="stroke-foreground"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <motion.path
                d="M109 83 Q122 90 135 83"
                fill="none"
                className="stroke-foreground"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </motion.g>
          )}
        </AnimatePresence>
      </g>

      {/* Hands covering eyes during password */}
      <AnimatePresence>
        {isHiding && (
          <>
            <motion.ellipse
              key="left-paw"
              cx="78" cy="82" rx="20" ry="14"
              className="fill-card stroke-border"
              strokeWidth="2"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 16 }}
            />
            <motion.ellipse
              key="right-paw"
              cx="122" cy="82" rx="20" ry="14"
              className="fill-card stroke-border"
              strokeWidth="2"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 16, delay: 0.05 }}
            />
            {/* Paw pads */}
            <motion.circle cx="72" cy="80" r="3" className="fill-primary/20"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 16 }}
            />
            <motion.circle cx="84" cy="80" r="3" className="fill-primary/20"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 16 }}
            />
            <motion.circle cx="116" cy="80" r="3" className="fill-primary/20"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 16, delay: 0.05 }}
            />
            <motion.circle cx="128" cy="80" r="3" className="fill-primary/20"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 16, delay: 0.05 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Nose */}
      <ellipse cx="100" cy="97" rx="4" ry="3" className="fill-primary/40" />

      {/* Mouth */}
      <motion.path
        d="M93 104 Q100 110 107 104"
        fill="none"
        className="stroke-primary/50"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{
          d: focusedField === "password" && !showPassword
            ? "M93 105 Q100 103 107 105"
            : "M93 104 Q100 110 107 104"
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Whiskers */}
      <line x1="50" y1="92" x2="68" y2="95" className="stroke-border" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="48" y1="100" x2="67" y2="100" className="stroke-border" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="132" y1="95" x2="150" y2="92" className="stroke-border" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="133" y1="100" x2="152" y2="100" className="stroke-border" strokeWidth="1.2" strokeLinecap="round" />
    </motion.svg>
  );
}
