import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://form.emoicons.com";

export const SITE_NAME = "Formu.AI";

export const DEFAULT_TITLE = "Formu.AI | Premium AI-Powered Form Builder";

export const DEFAULT_DESCRIPTION =
  "Create, fully customize theme colors, embed, and analyze forms instantly utilizing next-gen AI insights. Build beautiful tailored forms for high conversion.";

export const DEFAULT_KEYWORDS = [
  "form builder",
  "AI form generator",
  "online forms",
  "create survey",
  "contact forms",
  "embedded forms",
  "sentiment analysis",
  "feedback analysis",
  "Next.js form builder",
  "Shadcn form builder",
  "Formu.AI",
  "custom color form builder",
  "fully customizable forms",
  "brand form builder",
  "custom theme forms",
  "conversational forms",
  "interactive surveys",
  "typeform alternative",
  "google forms alternative",
];

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
  image?: string;
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  keywords = DEFAULT_KEYWORDS,
  noIndex = false,
  ogType = "website",
  image = "/opengraph-image",
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = path ? `${SITE_URL}${path}` : SITE_URL;
  const ogImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title: pageTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type: ogType,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${title || "AI-Powered Form Builder"}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImageUrl],
      creator: "@FormuAI",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  sameAs: [
    "https://github.com/raaam02/sec-form",
    "https://twitter.com/FormuAI",
  ],
  description: DEFAULT_DESCRIPTION,
};

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  operatingSystem: "All",
  applicationCategory: "BusinessApplication",
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD",
    category: "Free/Freemium",
  },
  featureList: [
    "AI-Powered Form Generation with Gemini AI",
    "Real-time Theme & Color Customization",
    "Seamless Embeddable JavaScript Widget",
    "Advanced AI Sentiment & Response Summaries",
    "Multi-step & Typeform-Style Form Navigation",
    "Pre-built Responsive Template Catalog",
    "Custom Webhooks & REST API Integrations",
  ],
};

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
