import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** robots.txt — allow crawling of public pages, keep the app private. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/decode",
        "/reports",
        "/watchlist",
        "/settings",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
