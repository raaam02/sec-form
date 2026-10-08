import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Formu.AI - AI-Powered Form Builder",
    short_name: "Formu.AI",
    description:
      "Create, customize, embed, and analyze forms instantly with Gemini AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
