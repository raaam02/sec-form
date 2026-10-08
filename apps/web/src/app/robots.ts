import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/themes", "/pricing", "/contact", "/f/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/explore", "/themes", "/pricing", "/contact", "/f/"],
        disallow: ["/dashboard/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/explore", "/themes", "/pricing", "/contact", "/f/"],
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
