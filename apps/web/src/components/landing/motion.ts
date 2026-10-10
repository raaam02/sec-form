/** Shared Framer Motion variants for landing page sections with refined cubic bezier easing */

export const easeEditorial = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween" as const, ease: easeEditorial, duration: 0.5 },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { type: "tween" as const, ease: "easeOut" as const, duration: 0.4 },
  },
};

export const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};
