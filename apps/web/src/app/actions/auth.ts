"use server";

import { trpcClient } from "@/lib/trpc-client";

export async function signUpAction(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data;

  if (!email || !name || !password) {
    return { error: "All fields are required" };
  }

  try {
    const res = await trpcClient.auth.signUp.mutate({
      name,
      email,
      password,
    });
    return res;
  } catch (e: any) {
    console.error("Signup failed:", e);
    return { error: e.message || "An unexpected error occurred during signup." };
  }
}

export async function verifySignupAction(data: { email: string; otp: string }) {
  const { email, otp } = data;
  try {
    await trpcClient.auth.verifySignup.mutate({ email, otp });
    return { success: true };
  } catch (e: any) {
    console.error("OTP verification failed:", e);
    return { error: e.message || "Invalid OTP code." };
  }
}

export async function resendSignupOtpAction(data: { email: string }) {
  const { email } = data;
  try {
    await trpcClient.auth.resendSignupOtp.mutate({ email });
    return { success: true };
  } catch (e: any) {
    console.error("Resending OTP failed:", e);
    return { error: e.message || "Failed to resend OTP." };
  }
}
