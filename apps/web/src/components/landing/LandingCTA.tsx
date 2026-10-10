"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "./ui";
import { PromptBox } from "./PromptBox";

export function LandingCTA() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
          className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card p-8 text-center shadow-2xl shadow-primary/10 sm:p-14"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[560px] -translate-x-1/2 rounded-full bg-primary/15 blur-[90px]" aria-hidden />
          <div className="relative z-10">
            <h2 className="font-outfit text-3xl font-black tracking-tight text-foreground sm:text-5xl">
              Your next form is one sentence away
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              Start free, no credit card. Upgrade only when you need more.
            </p>

            <div className="mx-auto mt-9 max-w-2xl">
              <PromptBox showChips={false} />
            </div>

            <Link
              href="/pricing"
              className="mt-6 inline-block text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              Compare plans
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
