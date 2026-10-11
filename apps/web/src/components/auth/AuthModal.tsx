"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { ExpandableScreen, ExpandableScreenContent } from "@/components/ui/expandable-screen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { TextMorph } from "@/components/arc/text-morph/text-morph";
import { useAuthModal } from "./AuthModalContext";
import { signUpAction, verifySignupAction, resendSignupOtpAction } from "@/app/actions/auth";

export function AuthModal() {
  const { isOpen, mode, redirectUrl, layoutId, closeAuthModal, setMode } = useAuthModal();
  const router = useRouter();

  // Unified form fields - values carry over seamlessly between login & signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OTP state for Signup
  const [needsOtp, setNeedsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const switchMode = (newMode: "login" | "signup") => {
    setError("");
    setSuccess("");
    setNeedsOtp(false);
    setMode(newMode);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const toastId = toast.loading("Signing in...");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res && !res.error) {
        toast.success("Welcome back!", { id: toastId });
        closeAuthModal();
        router.push(redirectUrl);
      } else {
        toast.error("Invalid email or password", { id: toastId });
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: redirectUrl });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await signUpAction({
        name,
        email,
        password,
      });

      if ("error" in res && res.error) {
        setError(res.error);
      } else if ("needsOtp" in res && res.needsOtp) {
        setNeedsOtp(true);
      } else {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          switchMode("login");
        }, 1500);
      }
    } catch {
      setError("An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setError("");

    try {
      const res = await verifySignupAction({ email, otp });
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Email verified! Signing you in...");
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (loginRes && !loginRes.error) {
          toast.success("Welcome to Formu.AI!");
          closeAuthModal();
          router.push(redirectUrl);
        } else {
          switchMode("login");
        }
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      const res = await resendSignupOtpAction({ email });
      if (res.error) {
        setError(res.error);
      } else {
        toast.success("Verification code resent!");
      }
    } catch {
      setError("Failed to resend code.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <ExpandableScreen
      expanded={isOpen}
      onExpandChange={(expanded) => !expanded && closeAuthModal()}
      layoutId={layoutId}
      triggerRadius="16px"
      contentRadius="24px"
      animationDuration={0.25}
    >
      <ExpandableScreenContent
        className="w-full max-w-6xl border border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-y-auto text-foreground"
        showCloseButton={true}
        closeButtonClassName="text-muted-foreground hover:text-foreground hover:bg-muted/80 bg-background/60 backdrop-blur-xs border border-border/40 absolute top-5 right-5 z-30 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col lg:flex-row items-center justify-center gap-3.5 sm:gap-6 lg:gap-14 p-4 sm:p-8 lg:p-14 my-auto"
        >
          {/* Left Column: Brand Story & Value Pillars */}
          <div className="relative flex-none lg:flex-1 space-y-2 sm:space-y-4 lg:space-y-6 text-center lg:text-left w-full max-w-lg lg:max-w-none">
            {/* Subtle atmospheric glow behind brand column */}
            <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent blur-3xl opacity-70" />

            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <Logo size="md" />
            </div>

            <div className="space-y-1 sm:space-y-3">
              <div className="min-h-0 sm:min-h-[72px] lg:min-h-[104px] flex items-center justify-center lg:justify-start">
                <AnimatePresence mode="wait" initial={false}>
                  {mode === "login" ? (
                    <motion.h1
                      key="login"
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="text-2xl sm:text-4xl lg:text-[44px] font-extrabold font-outfit tracking-tight text-foreground leading-[1.12]"
                    >
                      Welcome back to{" "}
                      <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                        your workspace.
                      </span>
                    </motion.h1>
                  ) : (
                    <motion.h1
                      key="signup"
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold font-outfit tracking-tight text-foreground leading-[1.12]"
                    >
                      Build reactive forms{" "}
                      <span className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent">
                        at the speed of thought.
                      </span>
                    </motion.h1>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Feature highlights - hidden on mobile screens to keep auth focused and compact */}
            <div className="hidden lg:block space-y-2.5 pt-2 text-left">
              {/* Pillar 1: AI Engine */}
              <div className="group/pillar flex items-center gap-3.5 p-3 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-border/60 transition-all duration-200">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20 group-hover/pillar:scale-105 transition-transform">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground tracking-tight">Prompt-to-Schema Engine</h4>
                    <span className="text-[10px] font-mono font-medium text-violet-500 dark:text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-md">
                      AI Reactive
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    Production-ready schemas, validation, and field types in seconds.
                  </p>
                </div>
              </div>

              {/* Pillar 2: Security */}
              <div className="group/pillar flex items-center gap-3.5 p-3 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-border/60 transition-all duration-200">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover/pillar:scale-105 transition-transform">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground tracking-tight">Zero-Knowledge Security</h4>
                    <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                      256-bit AES
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    End-to-end encrypted submissions with strict privacy isolation.
                  </p>
                </div>
              </div>

              {/* Pillar 3: Real-Time Alerts */}
              <div className="group/pillar flex items-center gap-3.5 p-3 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-border/60 transition-all duration-200">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover/pillar:scale-105 transition-transform">
                  <Zap className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-foreground tracking-tight">Instant Response Routing</h4>
                    <span className="text-[10px] font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                      &lt; 100ms
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    Live push to Telegram, webhooks, and analytics dashboards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Elevated Interactive Auth Card */}
          <div className="w-full flex-none lg:flex-1 max-w-md bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 rounded-3xl p-5 sm:p-8 shadow-2xl">
            {/* Header / Mode Switch Tabs */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
              <div>
                <h2 id="auth-modal-title" className="font-outfit text-xl font-bold tracking-tight text-foreground">
                  <TextMorph as="span">
                    {needsOtp
                      ? "Verify Email"
                      : mode === "login"
                      ? "Sign In"
                      : "Get Started Free"}
                  </TextMorph>
                </h2>
                <p className="hidden sm:block text-xs text-muted-foreground mt-0.5">
                  <TextMorph as="span">
                    {needsOtp
                      ? "Enter verification code"
                      : mode === "login"
                      ? "Access your dashboard & analytics"
                      : "No credit card required • Instant access"}
                  </TextMorph>
                </p>
              </div>

              {/* Mode switch pills with smooth shared indicator */}
              <div className="relative flex p-0.5 rounded-xl bg-muted/60 border border-border/40 text-xs">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`relative z-10 px-3 py-1 rounded-lg font-medium transition-colors ${
                    mode === "login"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "login" && (
                    <motion.div
                      layoutId="auth-mode-tab-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 rounded-lg bg-background shadow-xs -z-10"
                    />
                  )}
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`relative z-10 px-3 py-1 rounded-lg font-medium transition-colors ${
                    mode === "signup"
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "signup" && (
                    <motion.div
                      layoutId="auth-mode-tab-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 rounded-lg bg-background shadow-xs -z-10"
                    />
                  )}
                  Sign up
                </button>
              </div>
            </div>

            {/* Error / Success Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs p-2.5 flex items-center gap-2 mb-3 overflow-hidden"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-2.5 flex items-center gap-2 mb-3 overflow-hidden"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Place Smooth Transition Form */}
            <div className="relative">
              {needsOtp ? (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-3.5"
                >
                  <p className="text-xs text-muted-foreground text-center">
                    We sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>.
                  </p>

                  <div>
                    <Input
                      type="text"
                      pattern="\d*"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="h-11 text-center tracking-[0.3em] font-mono text-base rounded-xl"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isVerifyingOtp || otp.length !== 6}
                    className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                  </Button>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResendingOtp}
                      className="text-primary hover:underline text-[11px] font-semibold"
                    >
                      {isResendingOtp ? "Resending..." : "Resend code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNeedsOtp(false);
                        setOtp("");
                      }}
                      className="text-muted-foreground hover:text-foreground text-[11px] flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back
                    </button>
                  </div>
                </motion.form>
              ) : (
                <form onSubmit={mode === "login" ? handleLoginSubmit : handleSignupSubmit} className="space-y-3.5">
                  {/* Name field: seamlessly expands in signup, collapses in login */}
                  <AnimatePresence initial={false}>
                    {mode === "signup" && (
                      <motion.div
                        key="name-field"
                        initial={{ opacity: 0, height: 0, scale: 0.96 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.96 }}
                        transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1.5 pb-0.5">
                          <label className="text-xs font-medium text-foreground block">
                            Name
                          </label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Jane Doe"
                              required={mode === "signup"}
                              className="h-10 pl-9 rounded-xl text-xs bg-background/60"
                            />
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email: Stays mounted and glides smoothly */}
                  <motion.div layout="position" transition={{ duration: 0.24 }} className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground block">
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="h-10 pl-9 rounded-xl text-xs bg-background/60"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.div>

                  {/* Password: Stays mounted and glides smoothly */}
                  <motion.div layout="position" transition={{ duration: 0.24 }} className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground block">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                        required
                        className="h-10 pl-9 pr-9 rounded-xl text-xs bg-background/60"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-3 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button with TextMorph */}
                  <motion.div layout="position" transition={{ duration: 0.24 }}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <TextMorph as="span">
                        {loading
                          ? mode === "login"
                            ? "Signing in..."
                            : "Creating account..."
                          : mode === "login"
                          ? "Sign in to Account"
                          : "Create Free Account"}
                      </TextMorph>
                      {!loading && <ArrowRight className="h-3.5 w-3.5" />}
                    </Button>
                  </motion.div>

                  {/* Divider */}
                  <motion.div layout="position" transition={{ duration: 0.24 }} className="flex items-center my-3">
                    <span className="flex-1 border-t border-border/60" />
                    <span className="px-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Or
                    </span>
                    <span className="flex-1 border-t border-border/60" />
                  </motion.div>

                  {/* Google Sign in */}
                  <motion.div layout="position" transition={{ duration: 0.24 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      className="w-full h-10 rounded-xl text-xs font-semibold border-border hover:bg-accent flex items-center justify-center gap-2"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.27-2.08 3.59-5.17 3.59-8.46z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.27v3.1A12 12 0 0 0 12 24z" />
                        <path fill="#FBBC05" d="M5.24 14.24a7.15 7.15 0 0 1 0-4.48V6.66H1.27a11.96 11.96 0 0 0 0 10.68l3.97-3.1z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.37 2.64 1.27 6.66l3.97 3.1c.95-2.88 3.61-5.01 6.76-5.01z" />
                      </svg>
                      Continue with Google
                    </Button>
                  </motion.div>

                  {/* Footer Switch Link with TextMorph */}
                  <motion.div layout="position" transition={{ duration: 0.24 }} className="pt-2 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <TextMorph as="span">
                      {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                    </TextMorph>
                    <button
                      type="button"
                      onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                      className="font-bold text-primary hover:underline ml-1"
                    >
                      <TextMorph as="span">
                        {mode === "login" ? "Sign up" : "Log in"}
                      </TextMorph>
                    </button>
                  </motion.div>
                </form>
              )}
            </div>
          </div>
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}
