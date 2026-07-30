import { clientEnv } from "./env";

/**
 * Canonical product metadata. Consumed by SEO/metadata, the shell chrome, and
 * anywhere the brand needs to be referenced. Change the brand voice in one
 * place and it propagates everywhere.
 */
export const siteConfig = {
  name: "Verdikt",
  tagline: "The verdict on any vehicle.",
  description:
    "Verdikt is a premium AI-powered vehicle intelligence platform. Decode any VIN into a definitive verdict — history, valuation, risk and market position, synthesized in seconds.",
  url: clientEnv.NEXT_PUBLIC_APP_URL,
  ogImage: "/og.png",
  locale: "en_US",
  creator: "Verdikt",
  keywords: [
    "vehicle intelligence",
    "VIN decoder",
    "AI vehicle report",
    "car history",
    "vehicle valuation",
    "pre-purchase inspection",
  ],
  links: {
    twitter: "https://twitter.com/verdikt",
    github: "https://github.com/verdikt",
  },
} as const;

export type SiteConfig = typeof siteConfig;
