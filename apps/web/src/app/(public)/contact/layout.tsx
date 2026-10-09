import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact & Enterprise Inquiries",
  description:
    "Have questions or need enterprise quotas, custom SLA agreements, or technical help? Reach out to the Formu.AI support team directly.",
  path: "/contact",
  keywords: [
    "contact Formu.AI",
    "enterprise form support",
    "custom form builder inquiry",
    "customer support",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
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
