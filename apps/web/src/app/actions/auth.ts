"use server";

import { trpcClient } from "@/lib/trpc-client";

export async function signUpAction(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data;

  if (!email || !name || !password) {
    return { error: "All fields are required" };
  }

  try {
    await trpcClient.auth.signUp.mutate({
      name,
      email,
      password,
    });
    return { success: true };
  } catch (e: any) {
    console.error("Signup failed:", e);
    return { error: e.message || "An unexpected error occurred during signup." };
  }
}
