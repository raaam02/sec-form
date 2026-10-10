"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "./ui";
import { PromptBox } from "./PromptBox";

export function LandingCTA() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <Container className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-card/90 via-card/50 to-card/90 p-7 sm:p-14 text-center shadow-2xl backdrop-blur-xl ring-1 ring-white/[0.05]"
        >
          {/* Subtle Ambient Glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-[480px] -translate-x-1/2 rounded-full bg-primary/15 blur-[90px]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-outfit text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
              Build your next form in seconds.
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-muted-foreground">
              Type a prompt or start from blank. Free forever, no credit card required.
            </p>

            {/* Embedded Command Composer */}
            <div className="mx-auto mt-8 max-w-xl">
              <PromptBox showChips={false} />
            </div>

            {/* Guarantees & Link */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Free tier
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Export CSV
              </span>
              <Link
                href="/pricing"
                className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 underline underline-offset-4"
              >
                <span>Compare plans</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
