import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/NavigationProgress";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Formu.AI | Premium AI-Powered Form Builder",
  description: "Create, theme, embed, and analyze forms instantly utilizing next-gen AI insights. Built for high conversion.",
  keywords: [
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
    "Formu.AI"
  ],
  metadataBase: new URL("https://form.emoicons.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Formu.AI | Premium AI-Powered Form Builder",
    description: "Create, theme, embed, and analyze forms instantly utilizing next-gen AI insights. Built for high conversion.",
    url: "https://form.emoicons.com",
    siteName: "Formu.AI",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Formu.AI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Formu.AI | Premium AI-Powered Form Builder",
    description: "Create, theme, embed, and analyze forms instantly utilizing next-gen AI insights. Built for high conversion.",
    images: ["/icon.png"],
  },
  robots: {
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Formu.AI",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": "Create, theme, embed, and analyze forms instantly utilizing next-gen AI insights. Built for high conversion.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "category": "Free/Freemium"
    },
    "featureList": [
      "AI-Powered Form Generation",
      "Dynamic CSS Theming",
      "Seamless Form Embedding",
      "Advanced AI Response Summaries",
      "Multi-step Forms"
    ]
  };

  return (
    <html lang={locale} className={`${plusJakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans h-full bg-background text-foreground transition-colors duration-200">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
            {children}
          </Providers>
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
