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
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const { isOpen, mode, redirectUrl, closeAuthModal, setMode } = useAuthModal();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl">
        <DialogTitle className="sr-only">
          {mode === "login" ? "Sign In to Formu.AI" : "Create Formu.AI Account"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Authentication dialog with animated mode toggle
        </DialogDescription>

        {/* Top Header */}
        <div className="relative pt-6 px-6 pb-5 text-center border-b border-border/40">
          <div className="inline-flex items-center gap-2 mb-2">
            <Logo size="sm" />
          </div>

          <h2 className="font-outfit text-xl font-bold tracking-tight text-foreground">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          {/*<p className="text-xs text-muted-foreground mt-0.5">
            {mode === "login"
              ? "Sign in to manage your forms and AI insights"
              : "Start building and customizing forms for free"}
          </p>*/}
        </div>

        {/* Swipe Animated Container */}
        <div className="p-6 overflow-hidden relative min-h-[340px]">
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
      </DialogContent>
    </Dialog>
  );
}
