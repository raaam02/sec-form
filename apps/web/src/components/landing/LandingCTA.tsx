"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Globe2, ArrowRight } from "lucide-react";
import { HighlightedWord, OrganicBlob } from "./HandDrawn";
import { useTranslations } from "next-intl";

export function LandingCTA() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const t = useTranslations("Landing");

  const handleDemoLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await signIn("credentials", { email: "demo@demo.com", password: "demo123", redirect: false });
      if (res?.ok) router.push("/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <OrganicBlob className="bottom-[-60px] right-[-60px] w-72 h-72 text-primary/60 pointer-events-none" />
      <OrganicBlob className="top-[-40px] left-[-50px] w-60 h-60 text-[#a78bfa]/60 rotate-90 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
          className="relative rounded-[2rem] bg-card border border-border shadow-2xl p-10 md:p-16 text-center overflow-hidden"
        >
          {/* Internal glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.1 }}
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-7 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Globe2 className="h-7 w-7 text-primary-foreground" />
            </motion.div>

            <h2 className="font-outfit text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-3">
              Build your first form{" "}
              <HighlightedWord className="text-primary">today</HighlightedWord>
            </h2>
            <p className="text-[17px] text-muted-foreground max-w-md mb-10">
              Free forever. No credit card. Unlimited forms on the free plan.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDemoLogin}
                disabled={isLoggingIn}
                className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-primary px-8 text-[15px] font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {isLoggingIn ? t("loggingIn") : "Get started free"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center rounded-xl border border-border bg-background px-8 text-[15px] font-semibold text-foreground hover:bg-accent transition-colors shadow-sm"
                >
                  View pricing
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
