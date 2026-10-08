import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Online Form | ${SITE_NAME}`,
    description: "Fill out and submit this interactive online form powered by Formu.AI.",
    alternates: {
      canonical: `${SITE_URL}/f/${slug}`,
    },
    openGraph: {
      title: `Online Form | ${SITE_NAME}`,
      description: "Fill out and submit this interactive online form powered by Formu.AI.",
      url: `${SITE_URL}/f/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Formu.AI Form",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Online Form | ${SITE_NAME}`,
      description: "Fill out and submit this interactive online form powered by Formu.AI.",
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PublicFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
