"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

/**
 * The three verdict states. These literals are the canonical values and match
 * the `verdict_status` database enum exactly, so domain data flows into this
 * component without translation.
 */
export type VerdictStatus = "clear" | "caution" | "flagged";

const STATUS_TOKEN: Record<VerdictStatus, string> = {
  clear: "var(--verdict-clear)",
  caution: "var(--verdict-caution)",
  flagged: "var(--verdict-flag)",
};

const STATUS_LABEL: Record<VerdictStatus, string> = {
  clear: "Clear",
  caution: "Caution",
  flagged: "Flagged",
};

const SIZES = {
  sm: { box: 72, stroke: 6, text: "text-lg" },
  md: { box: 120, stroke: 8, text: "text-3xl" },
  lg: { box: 168, stroke: 10, text: "text-5xl" },
} as const;

interface VerdictScoreProps {
  /** 0–100 confidence score. */
  score: number;
  status: VerdictStatus;
  size?: keyof typeof SIZES;
  /** Hide the textual status beneath the number. */
  hideLabel?: boolean;
  className?: string;
}

/**
 * VerdictScore — the product's signature data-viz element.
 *
 * An animated circular gauge that renders a 0–100 verdict score in the
 * status's semantic color. Presentational and domain-agnostic: callers map
 * their data to `score`/`status`, so the same ring serves the dashboard,
 * report header, and watchlist. Fully accessible via role/aria.
 */
export function VerdictScore({
  score,
  status,
  size = "md",
  hideLabel = false,
  className,
}: VerdictScoreProps) {
  const reduced = usePrefersReducedMotion();
  const { box, stroke, text } = SIZES[size];
  const value = Math.max(0, Math.min(100, Math.round(score)));

  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = STATUS_TOKEN[status];

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: box, height: box }}
      role="img"
      aria-label={`Verdict score ${value} out of 100 — ${STATUS_LABEL[status]}`}
    >
      <svg
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        className="-rotate-90"
      >
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduced ? offset : circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: duration.slow, ease: easing.outExpo }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("tabular font-semibold tracking-tight", text)}>
          {value}
        </span>
        {!hideLabel ? (
          <span
            className="text-xs font-medium tracking-wide uppercase"
            style={{ color }}
          >
            {STATUS_LABEL[status]}
          </span>
        ) : null}
      </div>
    </div>
  );
}
