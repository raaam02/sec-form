import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing Plans & Features",
  description:
    "Transparent pricing for individuals, startups, and growing teams. Start free with up to 5 forms, or scale with Pro and Enterprise for unlimited forms, AI insights, and custom SLAs.",
  path: "/pricing",
  keywords: [
    "form builder pricing",
    "free online form builder",
    "pro form plan",
    "enterprise form builder",
    "affordable typeform alternative",
    "Formu.AI pricing",
  ],
});

const pricingFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there a free plan for Formu.AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Formu.AI offers a free tier that allows up to 5 active forms, 2 AI form generations, and 100 submissions per month with full theme customization.",
      },
    },
    {
      "@type": "Question",
      name: "Can I try Formu.AI before subscribing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can test the builder immediately using the instant sandbox demo account (demo@demo.com) without entering payment details.",
      },
    },
    {
      "@type": "Question",
      name: "Can I embed forms on my own website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all plans include embed support. You can embed any published form on your website or blog using a single lightweight script tag.",
      },
    },
  ],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, pricingFaqJsonLd]),
        }}
      />
      {children}
    </>
  );
}
