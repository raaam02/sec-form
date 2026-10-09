import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Explore Form Templates",
  description:
    "Browse, preview, and clone high-converting form templates. Pre-built surveys, feedback forms, lead capture forms, event registrations, and job applications.",
  path: "/explore",
  keywords: [
    "form templates",
    "free survey templates",
    "customer feedback form template",
    "lead capture form",
    "event registration template",
    "job application form",
    "restaurant survey",
    "Formu.AI templates",
  ],
});

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Explore Templates", path: "/explore" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {children}
    </>
  );
}
