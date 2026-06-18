import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kanbloom-three.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/board/*", "/board"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
