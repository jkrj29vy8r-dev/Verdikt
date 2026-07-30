"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

interface RadialGaugeProps {
  /** Current value, in the same unit as `max`. */
  value: number;
  max?: number;
  /** Diameter in px. */
  size?: number;
  /** Stroke width in px. */
  thickness?: number;
  /** Arc color — a CSS color or token, e.g. `var(--signature)`. */
  color?: string;
  /** Center content (a counter, a label). */
  children?: React.ReactNode;
  className?: string;
}

/**
 * RadialGauge — a generic animated progress arc.
 *
 * The reusable core behind the command center's interactive score dial: it
 * animates smoothly whenever `value` or `color` changes (so selecting a vehicle
 * eases the arc to that vehicle's score), and glows in its own color. Distinct
 * from `VerdictScore`, which is the fixed, domain-semantic ring — this one is a
 * neutral primitive any metric can drive. Snaps rather than animates under
 * reduced motion.
 */
export function RadialGauge({
  value,
  max = 100,
  size = 180,
  thickness = 10,
  color = "var(--signature)",
  children,
  className,
}: RadialGaugeProps) {
  const reduced = usePrefersReducedMotion();
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = circumference - pct * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={thickness}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduced ? offset : circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: duration.slow, ease: easing.outExpo }
          }
          style={{ filter: `drop-shadow(0 0 7px ${color})`, stroke: color }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
