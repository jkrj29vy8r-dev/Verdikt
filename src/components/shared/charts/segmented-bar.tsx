"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

export interface Segment {
  label: string;
  value: number;
  /** A CSS color or token. */
  color: string;
}

/**
 * SegmentedBar — a single proportional bar split into colored segments, with a
 * legend. The command center's status-distribution read-out (clear / caution /
 * flagged at a glance). Segments grow from zero-width when scrolled into view;
 * static under reduced motion. Zero-total renders an empty track, never NaN.
 */
export function SegmentedBar({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div ref={ref} className={cn("flex flex-col gap-3", className)}>
      <div className="flex h-2.5 w-full gap-1 overflow-hidden rounded-full">
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.value / total) * 100 : 0;
          return (
            <motion.div
              key={seg.label}
              className="h-full rounded-full first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: seg.color }}
              initial={{ width: reduced ? `${pct}%` : 0 }}
              animate={inView ? { width: `${pct}%` } : {}}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: duration.slow, ease: easing.outExpo }
              }
            />
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: seg.color }}
              aria-hidden
            />
            <span className="text-xs text-muted-foreground">{seg.label}</span>
            <span className="tabular text-xs font-semibold">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
