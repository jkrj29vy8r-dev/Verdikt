import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Sitemap for the public marketing surface. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/login", "/signup"];
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.6,
  }));
}
