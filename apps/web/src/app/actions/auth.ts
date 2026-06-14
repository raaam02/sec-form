"use server";

import { db, users } from "@sec-form/db";
import { eq } from "@sec-form/db";
import { hashPassword } from "@/lib/auth";

export async function signUpAction(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data;

  if (!email || !name || !password) {
    return { error: "All fields are required" };
  }

  try {
    // Check if user already exists in Drizzle database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      return { error: "A user with this email already exists" };
    }

    // Hash the password using our project SHA-256 helper
    const passwordHash = hashPassword(password);

    // Insert user
    await db.insert(users).values({
      name,
      email: email.toLowerCase(),
      passwordHash,
      image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    });

    return { success: true };
  } catch (e: any) {
    console.error("Signup failed:", e);
    return { error: e.message || "An unexpected error occurred during signup." };
  }
}
