import type { Metadata } from "next";

import { DecodeWorkspace } from "@/features/vehicle-intelligence";

export const metadata: Metadata = { title: "Decode" };

/**
 * Decode surface. Enter a VIN, get a saved verdict rendered inline. No plain
 * `PageHeader` here — `DecodeWorkspace`'s own `DecodeStage` already frames
 * the page with its idle orb and copy, so a text header above it would just
 * repeat the same invitation twice.
 */
export default function DecodePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <DecodeWorkspace />
    </div>
  );
}
