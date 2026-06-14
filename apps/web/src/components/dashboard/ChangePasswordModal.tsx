import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Lock, Send, KeyRound, AlertTriangle } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "../../utils/trpc";

interface ChangePasswordModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userEmail: string;
}

export function ChangePasswordModal({
  isOpen,
  setIsOpen,
  userEmail,
}: ChangePasswordModalProps) {
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  // tRPC mutations
  const requestOtpMutation = trpc.auth.requestPasswordResetOtp.useMutation();
  const resetPasswordMutation = trpc.auth.resetPasswordWithOtp.useMutation();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await requestOtpMutation.mutateAsync();
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (otp.length !== 6) {
      setError("Verification code must be exactly 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await resetPasswordMutation.mutateAsync({
        otp,
        newPassword,
        confirmPassword,
      });
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state back to initial values after closing animation
    setTimeout(() => {
      setStep("request");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl text-foreground">
        
        {step === "request" && (
          <>
            <DialogHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <DialogTitle className="font-outfit text-xl font-bold">Change Password</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs mt-1">
                To keep your account secure, we will send a 6-digit verification code (OTP) to your registered email address.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 my-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestOtp} className="space-y-4 my-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Registered Email
                </Label>
                <Input
                  type="email"
                  value={userEmail}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-zinc-900 text-muted-foreground text-sm cursor-not-allowed"
                  disabled
                />
              </div>

              <DialogFooter className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="h-10 px-4 rounded-xl"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 px-5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin" color="text-primary-foreground" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Code
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "verify" && (
          <>
            <DialogHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <KeyRound className="h-5 w-5" />
              </div>
              <DialogTitle className="font-outfit text-xl font-bold">Enter Verification Details</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs mt-1">
                Enter the 6-digit code sent to <span className="font-semibold text-foreground">{userEmail}</span> and choose a new password.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 my-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4 my-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  6-Digit OTP Code
                </Label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono text-center tracking-widest text-lg"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    className="w-full h-10 px-3 pr-10 rounded-xl border border-border bg-background text-foreground text-sm"
                    required
                    disabled={isLoading}
                  />
                  {capsLockActive && (
                    <div className="absolute right-3 top-3" title="Caps Lock is ON">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={checkCapsLock}
                    onKeyUp={checkCapsLock}
                    className="w-full h-10 px-3 pr-10 rounded-xl border border-border bg-background text-foreground text-sm"
                    required
                    disabled={isLoading}
                  />
                  {capsLockActive && (
                    <div className="absolute right-3 top-3" title="Caps Lock is ON">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("request")}
                  className="h-10 px-4 rounded-xl"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="h-10 px-5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner className="w-4 h-4 animate-spin" color="text-primary-foreground" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-outfit text-xl font-bold text-foreground">Password Changed Successfully</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed font-medium">
              Your password has been securely updated. You can now use your new credentials on your next sign-in.
            </p>
            <div className="w-full pt-6 border-t border-border mt-6 flex justify-center">
              <Button onClick={handleClose} className="h-10 px-6 rounded-xl font-semibold bg-primary text-primary-foreground">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
