"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { GlassPanel, PanelHeading } from "@/components/shared";
import { SparkArea } from "@/components/shared/charts";

/**
 * ScoreTrend — a premium area chart of verdict scores over time, with the
 * current value and the net change since the series began. The line draws itself
 * on and the latest point glows, so the trend reads as momentum rather than a
 * static plot.
 */
export function ScoreTrend({ trend }: { trend: number[] }) {
  const current = trend.at(-1) ?? 0;
  const first = trend[0] ?? current;
  const delta = current - first;
  const up = delta >= 0;

  return (
    <GlassPanel className="flex h-full flex-col">
      <PanelHeading
        eyebrow="Premium analytics"
        title="Confidence trend"
        trailing={
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold",
              up ? "text-verdict-clear" : "text-verdict-flag",
            )}
          >
            {up ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {up ? "+" : ""}
            {delta}
          </span>
        }
      />

      <div className="mb-3 flex items-baseline gap-2">
        <span className="tabular text-3xl font-semibold tracking-tight">
          {current}
        </span>
        <span className="text-xs text-muted-foreground">current avg</span>
      </div>

      {/* Fixed height: the SVG carries a viewBox aspect ratio, so an unbounded
       * flex height would let it inflate the whole panel. */}
      <div className="mt-auto h-36 w-full sm:h-44">
        <SparkArea data={trend} min={40} max={100} />
      </div>
    </GlassPanel>
  );
}
