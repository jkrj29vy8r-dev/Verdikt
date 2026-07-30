import {
  Hero,
  FeatureGrid,
  Pricing,
  CallToAction,
} from "@/components/marketing";
import { AnalysisExperience } from "@/features/vehicle-intelligence";

/**
 * Landing page. Pure composition of marketing sections — the page owns order
 * and nothing else, so sections stay independently reusable and testable.
 * The hero's 5-second wow is followed immediately by the interactive analysis
 * experience: the product's core promise (VIN → verdict) made tangible.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <AnalysisExperience />
      <FeatureGrid />
      <Pricing />
      <CallToAction />
    </>
  );
}
