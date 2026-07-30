import {
  Hero,
  FeatureGrid,
  Pricing,
  CallToAction,
} from "@/components/marketing";

/**
 * Landing page. Pure composition of marketing sections — the page owns order
 * and nothing else, so sections stay independently reusable and testable.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <Pricing />
      <CallToAction />
    </>
  );
}
