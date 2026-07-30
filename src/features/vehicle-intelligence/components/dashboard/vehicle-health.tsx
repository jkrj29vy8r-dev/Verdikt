"use client";

import * as React from "react";

import { formatVin } from "@/lib/utils";
import {
  BarTrack,
  GlassPanel,
  PanelHeading,
  VerdictScore,
} from "@/components/shared";

import type { FeaturedVehicle } from "../../dashboard";
import { RecommendationPill } from "../recommendation-pill";
import { STATUS_TOKEN } from "./status-visuals";

/**
 * VehicleHealth — a diagnostic read-out for the spotlighted vehicle.
 *
 * Pairs the signature verdict ring and the explicit buy/consider/avoid call with
 * a per-dimension health breakdown (title, risk, valuation, market, ownership),
 * each an animated meter in its own verdict color. The command center's "vitals"
 * panel — the vehicle as a living system, not a row in a table.
 */
export function VehicleHealth({ featured }: { featured: FeaturedVehicle }) {
  return (
    <GlassPanel className="flex h-full flex-col">
      <PanelHeading
        eyebrow="Vehicle health"
        title={featured.title}
        trailing={
          <RecommendationPill
            recommendation={featured.recommendation}
            showPrefix={false}
          />
        }
      />

      <div className="mb-5 flex items-center gap-4">
        <VerdictScore
          score={featured.score}
          status={featured.status}
          size="sm"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium">Overall condition</p>
          <p className="tabular text-xs tracking-wider text-muted-foreground">
            {formatVin(featured.vin)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3">
        {featured.health.map((dim) => (
          <BarTrack
            key={dim.key}
            label={dim.label}
            value={dim.score}
            color={STATUS_TOKEN[dim.status]}
          />
        ))}
      </div>
    </GlassPanel>
  );
}
