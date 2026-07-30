"use client";

import * as React from "react";

import { GlassPanel, PanelHeading } from "@/components/shared";
import { SegmentedBar, type Segment } from "@/components/shared/charts";

import type { StatusDistribution as Distribution } from "../../dashboard";
import { STATUS_TOKEN } from "./status-visuals";

/**
 * StatusDistribution — how the fleet splits across the three verdict states,
 * as one proportional segmented bar with a legend. A calm, at-a-glance read of
 * the whole set's health, in the same semantic colors used everywhere else.
 */
export function StatusDistribution({
  distribution,
}: {
  distribution: Distribution;
}) {
  const segments: Segment[] = [
    { label: "Clear", value: distribution.clear, color: STATUS_TOKEN.clear },
    {
      label: "Caution",
      value: distribution.caution,
      color: STATUS_TOKEN.caution,
    },
    {
      label: "Flagged",
      value: distribution.flagged,
      color: STATUS_TOKEN.flagged,
    },
  ];

  const total =
    distribution.clear + distribution.caution + distribution.flagged;
  const clearedPct = total ? Math.round((distribution.clear / total) * 100) : 0;

  return (
    <GlassPanel className="flex h-full flex-col">
      <PanelHeading eyebrow="Verdict mix" title="Distribution" />
      <div className="mb-4 flex items-baseline gap-2">
        <span className="tabular text-3xl font-semibold tracking-tight text-verdict-clear">
          {clearedPct}%
        </span>
        <span className="text-xs text-muted-foreground">
          cleared for purchase
        </span>
      </div>
      <div className="mt-auto">
        <SegmentedBar segments={segments} />
      </div>
    </GlassPanel>
  );
}
