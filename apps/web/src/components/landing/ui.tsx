"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";

/** One standardized container width for every section with consistent margins and responsive gutters */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={cn(
        "mb-10 sm:mb-14",
        isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3.5 inline-flex items-center gap-2",
            isCenter ? "justify-center" : "justify-start"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-outfit text-3xl font-black leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
