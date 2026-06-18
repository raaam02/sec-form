"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Lock, Mail, AlertTriangle, ArrowRight, Code, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";
import { LoadingSpinner } from "@sec-form/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useTranslations } from "next-intl";
import { OrganicBlob } from "@/components/landing/HandDrawn";
import { LoginMascot } from "@/components/landing/LoginMascot";

// ─── Floating security badges ────────────────────────────────────────────────

const FloatingBadge = ({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    className={`flex items-center gap-2 bg-card/30 backdrop-blur-sm border border-border/60 rounded-xl px-3 py-2 shadow-sm text-[11px] font-semibold text-muted-foreground ${className}`}
  >
    {children}
  </motion.div>
);

// ─── Main Login Form ─────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const t = useTranslations("Login");
  const tLanding = useTranslations("Landing");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"none" | "email" | "password">("none");
  const [capsLockActive, setCapsLockActive] = useState(false);


  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const toastId = toast.loading(t("signingIn"));
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (res && !res.error) {
        toast.success("Welcome back!", { id: toastId });
        router.push(redirect);
      } else {
        toast.error(t("errorInvalid"), { id: toastId });
      }
    } catch (err) {
      toast.error(t("errorGeneric"), { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: redirect });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { type: "tween" as const, ease: "easeOut" as const, duration: 0.38, delay: i * 0.08 },
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden transition-colors duration-200">
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <OrganicBlob className="top-[-10%] right-[-4%] w-[540px] h-[540px] text-primary/6" />
        <OrganicBlob className="bottom-[-12%] left-[-8%] w-[440px] h-[440px] text-[#a78bfa]/7 rotate-45" />
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(333 71% 51%) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 75% 75% at center, white, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 75% at center, white, transparent)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
           LEFT PANEL — Branding, navigation, interactive mascot
         ═══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-center items-center p-8 xl:p-12 relative">
        <div className="max-w-lg w-full flex flex-col items-center justify-center text-center space-y-8">
          {/* Logo & Navigation links */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
          >
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="font-outfit text-xl font-bold tracking-tight">
                Formu<span className="text-primary">.AI</span>
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/explore" className="hover:text-foreground transition-colors">{tLanding("navExplore")}</Link>
              <Link href="/themes" className="hover:text-foreground transition-colors">{tLanding("navThemes")}</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">{tLanding("navPricing")}</Link>
            </nav>
          </motion.div>

          {/* Interactive Mascot + Welcome Text */}
          <div className="flex flex-col items-center justify-center w-full">
            {/* Interactive mascot */}
            <LoginMascot
              focusedField={focusedField}
              emailLength={email.length}
              showPassword={showPassword}
            />

            <motion.div
              className="text-center mt-4 max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
            >
              <h1 className="font-outfit text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground">
                {t("title")}
              </h1>
              <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
                {t("subtitle")}
              </p>
            </motion.div>

            {/* Floating badges around mascot */}
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <FloatingBadge delay={0.6}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                256-bit encryption
              </FloatingBadge>
              <FloatingBadge delay={0.75}>
                <Lock className="h-3.5 w-3.5 text-primary/70" />
                Secure authentication
              </FloatingBadge>
              <FloatingBadge delay={0.9}>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                GDPR compliant
              </FloatingBadge>
            </div>
          </div>

          {/* Locale switcher + Theme toggle */}
          <motion.div
            className="flex items-center justify-center gap-3 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <LocaleSwitcher />
            <ThemeToggle />
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
           RIGHT PANEL — Login card
         ═══════════════════════════════════════════════════════════════════════ */}

      <div className="flex-1 flex flex-col justify-center bg-primary/5 dark:bg-secondary/5 items-center px-4 sm:px-8 py-10 lg:py-0">
        {/* Mobile-only top bar */}
        <div className="lg:hidden w-full max-w-md mb-0 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-outfit text-lg font-bold tracking-tight">
              Formu<span className="text-primary">.AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile mascot (smaller) */}
        <div className="w-full max-w-md sm:hidden">
          <LoginMascot
            focusedField={focusedField}
            emailLength={email.length}
            showPassword={showPassword}
          />
        </div>

        {/* Mobile title */}
        <div className="lg:hidden text-center mb-6 -mt-4">
          <h1 className="font-outfit text-2xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-0 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-7 sm:p-8 shadow-lg relative overflow-hidden">
            {/* Subtle glow at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <motion.div custom={0} variants={fadeUp}>
              <h2 className="font-outfit text-xl font-bold tracking-tight text-foreground lg:hidden mb-0.5">
                {t("signInBtn")}
              </h2>
              <h2 className="hidden lg:block font-outfit text-xl font-bold tracking-tight text-foreground mb-0.5">
                Sign in to your account
              </h2>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              {/* Email */}
              <motion.div custom={1} variants={fadeUp}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  {t("emailLabel")}
                </label>
                <div className="relative group">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("none")}
                    placeholder="demo@demo.com"
                    className="w-full h-11 px-3 pl-10 rounded-xl border border-border bg-background text-foreground text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                    required
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary/70" />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div custom={2} variants={fadeUp}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  {t("passwordLabel")}
                </label>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("none")}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    placeholder="demo123"
                    className="w-full h-11 px-3 pl-10 pr-20 rounded-xl border border-border bg-background text-foreground text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary/70" />

                  <div className="absolute right-2.5 top-2 flex items-center gap-1">
                    {capsLockActive && (
                      <div title="Caps Lock is ON" className="p-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div custom={3} variants={fadeUp}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    t("signingIn")
                  ) : (
                    <>
                      {t("signInBtn")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div custom={4} variants={fadeUp} className="my-5 flex items-center">
              <span className="border-t border-border flex-1" />
              <span className="text-[11px] text-muted-foreground uppercase font-semibold px-3">{t("or")}</span>
              <span className="border-t border-border flex-1" />
            </motion.div>

            {/* Google */}
            <motion.div custom={5} variants={fadeUp}>
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-11 border border-border hover:bg-accent hover:text-accent-foreground bg-card text-muted-foreground font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.27-2.08 3.59-5.17 3.59-8.46z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.27v3.1A12 12 0 0 0 12 24z" />
                  <path fill="#FBBC05" d="M5.24 14.24a7.15 7.15 0 0 1 0-4.48V6.66H1.27a11.96 11.96 0 0 0 0 10.68l3.97-3.1z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.37 2.64 1.27 6.66l3.97 3.1c.95-2.88 3.61-5.01 6.76-5.01z" />
                </svg>
                {t("googleBtn")}
              </Button>
            </motion.div>

            {/* Sign up link */}
            <motion.div custom={6} variants={fadeUp} className="mt-5 pt-4 border-t border-border text-center">
              <Link
                href="/signup"
                className="text-xs font-bold text-primary hover:underline"
              >
                {t("dontHaveAccount")}
              </Link>
            </motion.div>
          </Card>

          {/* Demo credentials hint */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center mt-5"
          >
            {/* <div className="inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-2.5"> */}
              {/* <Sparkles className="h-3.5 w-3.5 text-primary" /> */}
              <div className="text-center">
                {/* <span className="block text-[11px] text-muted-foreground/30 mt-0.5">{t("demoTitle")}</span> */}
                <span className="block text-[10px] text-muted-foreground/30 mt-0.5">{t("demoCredentials")}</span>
              </div>
            {/* </div> */}
          </motion.div>

          {/* Mobile-only nav links */}
          <div className="lg:hidden mt-8 flex flex-wrap gap-4 justify-center text-xs font-semibold text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/explore" className="hover:text-foreground transition-colors">{tLanding("navExplore")}</Link>
            <Link href="/themes" className="hover:text-foreground transition-colors">{tLanding("navThemes")}</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">{tLanding("navPricing")}</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <LoadingSpinner className="w-8 h-8" color="text-primary" />
          <span className="text-xs text-muted-foreground font-semibold">Loading authentication panel...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
