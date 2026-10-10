"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence, type Variants } from "motion/react";
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
  X,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { ExpandableScreen, ExpandableScreenContent } from "@/components/ui/expandable-screen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuthModal } from "./AuthModalContext";
import { signUpAction, verifySignupAction, resendSignupOtpAction } from "@/app/actions/auth";

const swipeVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.24,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

export function AuthModal() {
  const { isOpen, mode, redirectUrl, layoutId, closeAuthModal, setMode } = useAuthModal();
  const router = useRouter();

  // 1 = swipe forward (login -> signup), -1 = swipe backward (signup -> login)
  const [direction, setDirection] = useState(1);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  // OTP state for Signup
  const [needsOtp, setNeedsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const switchMode = (newMode: "login" | "signup") => {
    setDirection(newMode === "signup" ? 1 : -1);
    setSignupError("");
    setSignupSuccess("");
    setMode(newMode);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const toastId = toast.loading("Signing in...");
    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (res && !res.error) {
        toast.success("Welcome back!", { id: toastId });
        closeAuthModal();
        router.push(redirectUrl);
      } else {
        toast.error("Invalid email or password", { id: toastId });
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: redirectUrl });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    setSignupSuccess("");

    try {
      const res = await signUpAction({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });

      if ("error" in res && res.error) {
        setSignupError(res.error);
      } else if ("needsOtp" in res && res.needsOtp) {
        setNeedsOtp(true);
      } else {
        setSignupSuccess("Account created successfully!");
        setTimeout(() => {
          switchMode("login");
        }, 1500);
      }
    } catch {
      setSignupError("An unexpected error occurred during signup.");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setSignupError("Please enter a valid 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setSignupError("");

    try {
      const res = await verifySignupAction({ email: signupEmail, otp });
      if (res.error) {
        setSignupError(res.error);
      } else {
        setSignupSuccess("Email verified! Signing you in...");
        const loginRes = await signIn("credentials", {
          email: signupEmail,
          password: signupPassword,
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
      setSignupError("Verification failed. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    try {
      const res = await resendSignupOtpAction({ email: signupEmail });
      if (res.error) {
        setSignupError(res.error);
      } else {
        toast.success("Verification code resent!");
      }
    } catch {
      setSignupError("Failed to resend code.");
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
        className="w-full max-w-[1100px] border border-border/60 bg-card/95 backdrop-blur-2xl shadow-2xl overflow-y-auto text-foreground"
        showCloseButton={true}
        closeButtonClassName="text-muted-foreground hover:text-foreground hover:bg-muted/80 bg-background/60 backdrop-blur-xs border border-border/40 absolute top-5 right-5 z-30 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="relative z-10 mx-auto flex h-full w-full max-w-[1100px] flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 p-6 sm:p-10 lg:p-14 my-auto"
        >
          {/* Left Column: Brand Story & Value Pillars */}
          <div className="flex-1 space-y-6 text-center lg:text-left w-full max-w-lg lg:max-w-none">
            <div className="inline-flex items-center gap-2">
              <Logo size="md" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-outfit tracking-tight text-foreground leading-[1.15]">
                {mode === "login"
                  ? "Welcome back to your workspace."
                  : "Supercharge how you build forms."}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                AI-powered form generation, live schemas, enterprise encryption, and multi-channel instant analytics.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid gap-3 pt-2 text-left">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">AI Schema Generation</h4>
                  <p className="text-[11px] text-muted-foreground">Type prompt, get production-ready reactive forms in seconds.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">End-to-End Encryption</h4>
                  <p className="text-[11px] text-muted-foreground">Zero-knowledge responses, strictly secured by SEC-level standards.</p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="pt-2 hidden sm:block">
              <p className="text-xs italic text-muted-foreground">
                "Formu.AI replaced our entire complex form pipeline in an afternoon. Truly game-changing speed."
              </p>
              <div className="mt-2 flex items-center gap-2 justify-center lg:justify-start">
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  A
                </div>
                <span className="text-xs font-medium text-foreground">Alex Chen</span>
                <span className="text-[11px] text-muted-foreground">• Product Lead at HyperGrowth</span>
              </div>
            </div>
          </div>

          {/* Right Column: Elevated Interactive Auth Card */}
          <div className="w-full flex-1 max-w-md bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/70 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* Header / Mode Switch Tabs */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
              <div>
                <h2 id="auth-modal-title" className="font-outfit text-xl font-bold tracking-tight text-foreground">
                  {mode === "login" ? "Sign In" : "Get Started Free"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mode === "login"
                    ? "Access your dashboard & analytics"
                    : "No credit card required • Instant access"}
                </p>
              </div>

              {/* Mode switch pills */}
              <div className="flex p-0.5 rounded-xl bg-muted/60 border border-border/40 text-xs">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    mode === "login"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    mode === "signup"
                      ? "bg-background text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Swipe Animated Form Body */}
            <div className="overflow-hidden relative min-h-[320px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                custom={direction}
                variants={swipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground block">
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="h-10 pl-9 rounded-xl text-xs bg-background/60"
                      />
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground block">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-10 pl-9 pr-9 rounded-xl text-xs bg-background/60"
                      />
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {loginLoading ? "Signing in..." : "Sign in to Account"}
                    {!loginLoading && <ArrowRight className="h-3.5 w-3.5" />}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <span className="flex-1 border-t border-border/60" />
                  <span className="px-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Or
                  </span>
                  <span className="flex-1 border-t border-border/60" />
                </div>

                {/* Google Sign in */}
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

                {/* Footer Switch Link */}
                <div className="pt-2 text-center text-xs text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-bold text-primary hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                custom={direction}
                variants={swipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                {signupError && (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs p-2.5 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                {signupSuccess && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-2.5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{signupSuccess}</span>
                  </div>
                )}

                {needsOtp ? (
                  <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                    <p className="text-xs text-muted-foreground text-center">
                      We sent a 6-digit verification code to <span className="font-semibold text-foreground">{signupEmail}</span>.
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
                  </form>
                ) : (
                  <form onSubmit={handleSignupSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground block">
                        Name
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="Jane Doe"
                          required
                          className="h-9 pl-9 rounded-xl text-xs bg-background/60"
                        />
                        <User className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground block">
                        Email
                      </label>
                      <div className="relative">
                        <Input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="h-9 pl-9 rounded-xl text-xs bg-background/60"
                        />
                        <Mail className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground block">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showSignupPassword ? "text" : "password"}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          required
                          className="h-9 pl-9 pr-9 rounded-xl text-xs bg-background/60"
                        />
                        <Lock className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={signupLoading}
                      className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 mt-2"
                    >
                      {signupLoading ? "Creating account..." : "Create Free Account"}
                      {!signupLoading && <ArrowRight className="h-3.5 w-3.5" />}
                    </Button>
                  </form>
                )}

                {/* Divider */}
                <div className="flex items-center my-3">
                  <span className="flex-1 border-t border-border/60" />
                  <span className="px-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Or
                  </span>
                  <span className="flex-1 border-t border-border/60" />
                </div>

                {/* Google sign up */}
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

                {/* Footer Switch Link */}
                <div className="pt-2 text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-bold text-primary hover:underline"
                  >
                    Log in
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>
          </div>
        </div>
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}
