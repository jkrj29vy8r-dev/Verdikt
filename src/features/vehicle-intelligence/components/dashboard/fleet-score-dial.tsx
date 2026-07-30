"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { formatVin } from "@/lib/utils";
import { GlassPanel, PanelHeading, RadialGauge } from "@/components/shared";

import type { FleetVehicle } from "../../dashboard";
import { STATUS_DOT, STATUS_LABEL, STATUS_TOKEN } from "./status-visuals";

/**
 * FleetScoreDial — the interactive score.
 *
 * A radial gauge that reads the fleet's average by default and eases to a single
 * vehicle's score when you hover or focus its row, recoloring to that vehicle's
 * verdict. Hovering the list *drives* the dial — the score is something you
 * explore, not just read. Fully keyboard-operable (each row is a button) and,
 * under reduced motion, the arc snaps instead of sweeping.
 */
export function FleetScoreDial({
  avgScore,
  fleet,
}: {
  avgScore: number;
  fleet: FleetVehicle[];
}) {
  const [active, setActive] = React.useState<FleetVehicle | null>(null);

  const value = active?.score ?? avgScore;
  const color = active ? STATUS_TOKEN[active.status] : "var(--signature)";

  return (
    <GlassPanel className="flex h-full flex-col">
      <PanelHeading eyebrow="Interactive score" title="Fleet verdict" />

      <div className="flex flex-1 flex-col items-center gap-6 sm:flex-row sm:items-center">
        <RadialGauge value={value} color={color} size={168} thickness={11}>
          <span
            className="tabular text-4xl font-semibold tracking-tight transition-colors"
            style={{ color }}
          >
            {value}
          </span>
          <span className="mt-0.5 max-w-[7rem] truncate text-center text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
            {active ? STATUS_LABEL[active.status] : "Fleet average"}
          </span>
        </RadialGauge>

        <ul className="w-full flex-1 space-y-1">
          {fleet.map((vehicle) => {
            const isActive = active?.id === vehicle.id;
            return (
              <li key={vehicle.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(vehicle)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(vehicle)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left transition-colors outline-none",
                    "hover:bg-foreground/[0.04] focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    isActive && "bg-foreground/[0.06]",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      STATUS_DOT[vehicle.status],
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {vehicle.title}
                    </span>
                    <span className="tabular block truncate text-[0.7rem] tracking-wider text-muted-foreground">
                      {formatVin(vehicle.vin)}
                    </span>
                  </span>
                  <span
                    className="tabular text-sm font-semibold"
                    style={{ color: STATUS_TOKEN[vehicle.status] }}
                  >
                    {vehicle.score}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </GlassPanel>
  );
}
