import { db, users } from "@sec-form/db";
import { eq } from "@sec-form/db";
import crypto from "crypto";

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function findUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase().trim()),
  });
}

export async function createUser(name: string, email: string, passwordHash: string) {
  const [newUser] = await db
    .insert(users)
    .values({
      id: crypto.randomUUID() as any,
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    })
    .returning();
  return newUser;
}

export async function syncOAuthUser(name: string, email: string, image: string) {
  const lowerEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(lowerEmail);

  if (existingUser) {
    // Optionally update image if it changed
    if (image && existingUser.image !== image) {
      const [updated] = await db
        .update(users)
        .set({ image, updatedAt: new Date() })
        .where(eq(users.id, existingUser.id))
        .returning();
      return updated;
    }
    return existingUser;
  }

  const [newUser] = await db
    .insert(users)
    .values({
      id: crypto.randomUUID() as any,
      email: lowerEmail,
      name: name || "OAuth User",
      image: image || "",
      passwordHash: "oauth-user",
    })
    .returning();

  return newUser;
}

export async function verifyCredentials(email: string, passwordPlain: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const passwordHash = hashPassword(passwordPlain);
  if (user.passwordHash !== passwordHash) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    planId: user.planId,
  };
}
