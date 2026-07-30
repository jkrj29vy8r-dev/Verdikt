"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

interface BarTrackProps {
  label: string;
  /** 0–100. */
  value: number;
  /** Fill color — a CSS color or token. */
  color?: string;
  /** Optional right-aligned value display; defaults to the rounded number. */
  valueLabel?: React.ReactNode;
  className?: string;
}

/**
 * BarTrack — a labeled horizontal meter that fills from zero when it enters
 * view. The command center's health/dimension read-out: label on the left,
 * value on the right, a glowing fill between. Fills instantly under reduced
 * motion.
 */
export function BarTrack({
  label,
  value,
  color = "var(--signature)",
  valueLabel,
  className,
}: BarTrackProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="tabular text-xs font-semibold">
          {valueLabel ?? Math.round(value)}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px -1px ${color}` }}
          initial={{ width: reduced ? `${pct}%` : 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: duration.slow, ease: easing.outExpo }
          }
        />
      </div>
    </div>
  );
}
