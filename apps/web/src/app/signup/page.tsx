"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, Mail, User, CheckCircle2, ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { LoadingSpinner } from "@sec-form/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { signUpAction, verifySignupAction, resendSignupOtpAction } from "../actions/auth";
import { Logo } from "@/components/Logo";

function SignupForm() {
  const router = useRouter();
  const t = useTranslations("Signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [needsOtp, setNeedsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await signUpAction({ name, email, password });

      if ("error" in res && res.error) {
        setError(res.error);
      } else if ("needsOtp" in res && res.needsOtp) {
        setNeedsOtp(true);
      } else {
        setSuccess(t("successMessage"));
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError(t("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      const res = await verifySignupAction({ email, otp });
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Account verified successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const res = await resendSignupOtpAction({ email });
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Verification code resent successfully!");
      }
    } catch (err) {
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between items-center px-4 py-16 relative overflow-hidden transition-colors duration-200">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-indigo-200/20 dark:bg-indigo-950/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-200/20 dark:bg-purple-950/10 blur-3xl" />

      <div className="max-w-md w-full relative z-10 my-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <Logo size="md" />
          </Link>
          <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <Card className="bg-card rounded-2xl border border-border p-8 shadow-md">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm p-3 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {needsOtp ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center pb-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>. Please enter it below to confirm your email.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    pattern="\d*"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-11 px-3 text-center tracking-[0.3em] font-mono text-lg rounded-xl border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isVerifying || otp.length !== 6 || !!success}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="flex flex-col gap-2 pt-2 text-center text-xs font-medium">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending || !!success}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend Verification Code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNeedsOtp(false);
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mt-1 font-semibold"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign Up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  {t("nameLabel")}
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 pl-10 rounded-xl border border-border bg-background text-foreground text-sm"
                    required
                  />
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 pl-10 rounded-xl border border-border bg-background text-foreground text-sm"
                    required
                  />
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 pl-10 rounded-xl border border-border bg-background text-foreground text-sm"
                    required
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !!success}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? t("signingUp") : t("signUpBtn")}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-border text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-primary hover:underline"
            >
              {t("alreadyHaveAccount")}
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-xs text-center text-xs text-muted-foreground relative z-10 flex flex-col items-center gap-3 mt-10">
        <div className="flex gap-4 font-semibold">
          <Link href="/" className="hover:text-indigo-650 dark:hover:text-indigo-400">Home</Link>
          <Link href="/explore" className="hover:text-indigo-650 dark:hover:text-indigo-400">Explore</Link>
          <Link href="/pricing" className="hover:text-indigo-650 dark:hover:text-indigo-400">Pricing</Link>
        </div>
        <LocaleSwitcher />
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <LoadingSpinner className="w-8 h-8" color="text-primary" />
          <span className="text-xs text-muted-foreground font-semibold">Loading registration panel...</span>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
