import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  description:
    "Sign in to your Formu.AI account to manage your forms, inspect response submissions, review AI sentiment reports, and edit custom themes.",
  path: "/login",
  keywords: ["login", "sign in", "Formu.AI account"],
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
