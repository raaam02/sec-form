"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, AlertCircle, Lock, Mail } from "lucide-react";
import { Suspense } from "react";
import { LoadingSpinner } from "@sec-form/ui";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("demo@demo.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (res?.ok) {
        router.push(redirect);
      } else {
        setError("Invalid email or password. Please use: demo@demo.com / demo123");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: redirect });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-200">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-indigo-200/20 dark:bg-indigo-950/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-200/20 dark:bg-purple-950/10 blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-50 to-violet-600 shadow-md">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-foreground">
              Formu.AI
            </span>
          </Link>
          <h2 className="font-outfit text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to start creating forms with AI
          </p>
        </div>

        <Card className="bg-card rounded-2xl border border-border p-8 shadow-md">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Email Address
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
                Password
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
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center justify-between">
            <span className="border-t border-border flex-1" />
            <span className="text-xs text-muted-foreground uppercase font-semibold px-3">or</span>
            <span className="border-t border-border flex-1" />
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-11 border border-border hover:bg-accent hover:text-accent-foreground bg-card text-muted-foreground font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {/* Google Icon SVG */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.77-2.4 3.61v3h3.86c2.27-2.08 3.59-5.17 3.59-8.46z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.27v3.1A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.24a7.15 7.15 0 0 1 0-4.48V6.66H1.27a11.96 11.96 0 0 0 0 10.68l3.97-3.1z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.37 2.64 1.27 6.66l3.97 3.1c.95-2.88 3.61-5.01 6.76-5.01z"
              />
            </svg>
            Sign in with Google
          </Button>
        </Card>

        <div className="text-center mt-6 text-xs text-slate-500 dark:text-zinc-500 transition-colors">
          <span className="font-bold">Hackathon Demo Credentials:</span>
          <span className="block mt-1 font-mono text-[11px] opacity-75">Email: demo@demo.com &nbsp;|&nbsp; Password: demo123</span>
        </div>
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

