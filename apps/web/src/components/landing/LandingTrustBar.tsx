"use client";

import React from "react";
import { motion } from "motion/react";
import { Github, Palette, Sparkles, TextCursorInput } from "lucide-react";
import { Container } from "./ui";
import { fadeUp, stagger } from "./motion";

const FIELD_TYPES = 11;

const FACTS = [
  { icon: Github, title: "Open source", sub: "Read it, fork it, self-host it" },
  { icon: Sparkles, title: "Gemini-powered", sub: "Generation and response insights" },
  { icon: TextCursorInput, title: `${FIELD_TYPES} field types`, sub: "Text, rating, choice, date and more" },
  { icon: Palette, title: "50+ themes", sub: "Or generate one from a prompt" },
];

export function LandingTrustBar() {
  return (
    <section className="border-y border-border bg-card/30 py-10">
      <Container>
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-border"
        >
          {FACTS.map(({ icon: Icon, title, sub }) => (
            <motion.li key={title} variants={fadeUp} className="flex items-start gap-3 lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{sub}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
