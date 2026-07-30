"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  FileText,
  Gauge,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";
import { AnimatedCounter, GlassPanel } from "@/components/shared";

import type { DashboardStats } from "../../dashboard";

interface Tile {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
  /** Accent tint class pair: icon bg + icon text. */
  tint: string;
  suffix?: string;
}

const TILES: Tile[] = [
  {
    key: "verdictsRun",
    label: "Verdicts run",
    icon: FileText,
    tint: "bg-signature/12 text-signature",
  },
  {
    key: "avgScore",
    label: "Fleet confidence",
    icon: Gauge,
    tint: "bg-signature-2/12 text-signature-2",
    suffix: "/100",
  },
  {
    key: "clearedCount",
    label: "Cleared",
    icon: ShieldCheck,
    tint: "bg-verdict-clear/12 text-verdict-clear",
  },
  {
    key: "attentionCount",
    label: "Needs attention",
    icon: TriangleAlert,
    tint: "bg-verdict-caution/12 text-verdict-caution",
  },
];

/**
 * StatCluster — the command center's four headline metrics, each a floating
 * glass tile whose number counts up on arrival. The KPIs read live rather than
 * printed; tiles stagger in and lift on hover.
 */
export function StatCluster({ stats }: { stats: DashboardStats }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {TILES.map((tile, i) => (
        <motion.div
          key={tile.key}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: duration.slow,
            ease: easing.outExpo,
            delay: reduced ? 0 : i * 0.07,
          }}
        >
          <GlassPanel interactive className="flex items-center gap-4">
            <div
              className={cn(
                "grid size-11 shrink-0 place-items-center rounded-xl",
                tile.tint,
              )}
            >
              <tile.icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-balance text-muted-foreground">
                {tile.label}
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                <AnimatedCounter value={stats[tile.key]} />
                {tile.suffix ? (
                  <span className="text-base text-muted-foreground">
                    {tile.suffix}
                  </span>
                ) : null}
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}
