import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Theme Gallery & Form Styling",
  description:
    "Explore beautiful pre-built themes or craft your own brand identity. Customize card backgrounds, accent colors, button radius, and typography for seamless embed aesthetics.",
  path: "/themes",
  keywords: [
    "form themes",
    "custom form styling",
    "CSS form designer",
    "branded survey design",
    "dark mode form builder",
    "Formu.AI themes",
  ],
});

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Themes", path: "/themes" },
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
