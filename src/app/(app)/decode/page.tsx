import type { Metadata } from "next";

import { DecodeWorkspace } from "@/features/vehicle-intelligence";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Decode" };

/** Decode surface. Enter a VIN, get a saved verdict rendered inline. */
export default function DecodePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Run a verdict"
        description="Enter a 17-digit VIN. Your report is synthesized and saved to your account."
      />
      <DecodeWorkspace />
    </div>
  );
}
