import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create Free Account",
  description:
    "Join Formu.AI today. Scaffold AI-powered questionnaires, customize themes, embed seamlessly, and collect user submissions for free.",
  path: "/signup",
  keywords: ["sign up", "register", "create account", "free form builder"],
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
