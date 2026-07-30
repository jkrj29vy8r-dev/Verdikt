"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

interface SparkAreaProps {
  /** The series to plot (chronological). Rendered edge to edge. */
  data: number[];
  /** Value range; defaults to the data's own min/max with light padding. */
  min?: number;
  max?: number;
  /** Line/fill color — a CSS color or token. */
  color?: string;
  className?: string;
}

const VIEW_W = 100;
const VIEW_H = 42;

/**
 * SparkArea — a premium area chart for a short numeric series.
 *
 * Draws its line on when scrolled into view (pathLength) over a soft gradient
 * fill, then marks the latest point with a glowing node. Uses a fixed viewBox
 * stretched to the container, so it scales fluidly without JS resize handling.
 * Renders statically (no draw-on) under reduced motion.
 */
export function SparkArea({
  data,
  min,
  max,
  color = "var(--signature)",
  className,
}: SparkAreaProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const gradientId = React.useId();

  const { linePath, areaPath, lastPoint } = React.useMemo(() => {
    if (data.length === 0) {
      return { linePath: "", areaPath: "", lastPoint: null };
    }
    const lo = min ?? Math.min(...data);
    const hi = max ?? Math.max(...data);
    const span = hi - lo || 1;
    const stepX = data.length > 1 ? VIEW_W / (data.length - 1) : 0;
    const pts = data.map((v, i) => {
      const x = data.length > 1 ? i * stepX : VIEW_W / 2;
      // Pad 3px top/bottom so the glow node and peaks are never clipped.
      const y = 3 + (1 - (v - lo) / span) * (VIEW_H - 6);
      return [x, y] as const;
    });
    const line = pts
      .map(
        ([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`,
      )
      .join(" ");
    const first = pts[0]!;
    const last = pts[pts.length - 1]!;
    const area = `${line} L${last[0].toFixed(2)},${VIEW_H} L${first[0].toFixed(2)},${VIEW_H} Z`;
    return { linePath: line, areaPath: area, lastPoint: last };
  }, [data, min, max]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      className={cn("h-full w-full overflow-visible", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {areaPath ? (
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: duration.slow, ease: easing.outExpo }}
        />
      ) : null}

      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={
          reduced ? { duration: 0 } : { duration: 1.1, ease: easing.outExpo }
        }
      />

      {lastPoint ? (
        <motion.circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r={2}
          fill={color}
          vectorEffect="non-scaling-stroke"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: reduced ? 0 : 1, duration: duration.base }}
        />
      ) : null}
    </svg>
  );
}
