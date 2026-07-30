import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { DashboardModel } from "../../dashboard";
import { StatCluster } from "./stat-cluster";
import { FleetScoreDial } from "./fleet-score-dial";
import { AiPulse } from "./ai-pulse";
import { StatusDistribution } from "./status-distribution";
import { ScoreTrend } from "./score-trend";
import { VehicleHealth } from "./vehicle-health";
import { FleetTimeline } from "./fleet-timeline";

/**
 * CommandCenter — the dashboard as a futuristic operations deck.
 *
 * A Server Component that arranges the client widget islands into a floating
 * bento of glass panels: headline counters up top, then the interactive fleet
 * dial and the live AI feed, premium trend/distribution charts, and the vehicle
 * vitals + activity timeline. It owns layout only; every panel receives plain,
 * serializable model data and animates itself. When the model is a preview
 * (`isSample`), it says so and points at the first real verdict.
 */
export function CommandCenter({ model }: { model: DashboardModel }) {
  return (
    <div className="relative mx-auto max-w-7xl">
      {/* Ambient command-deck glow behind the header. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-64 w-[min(90%,52rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-signature/12 to-transparent blur-3xl"
      />

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[0.7rem] font-medium tracking-[0.16em] text-signature uppercase">
            Command center
          </span>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Your fleet, at a glance
          </h1>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {model.isSample ? (
              <>
                <Badge variant="secondary">Preview</Badge>
                Sample data — run a verdict to make it yours.
              </>
            ) : (
              "Live intelligence across every vehicle you've decoded."
            )}
          </p>
        </div>

        <Button variant="signature" size="lg" asChild>
          <Link href="/decode">
            <Plus className="size-4" />
            {model.isSample ? "Run your first verdict" : "New verdict"}
          </Link>
        </Button>
      </header>

      <div className="space-y-4">
        <StatCluster stats={model.stats} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="md:col-span-2 xl:col-span-4">
            <FleetScoreDial
              avgScore={model.stats.avgScore}
              fleet={model.fleet}
            />
          </div>
          <div className="xl:col-span-2">
            <AiPulse insights={model.insights} />
          </div>

          <div className="xl:col-span-2">
            <StatusDistribution distribution={model.distribution} />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <ScoreTrend trend={model.trend} />
          </div>

          <div className="xl:col-span-3">
            <VehicleHealth featured={model.featured} />
          </div>
          <div className="xl:col-span-3">
            <FleetTimeline
              timeline={model.timeline}
              linkable={!model.isSample}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
