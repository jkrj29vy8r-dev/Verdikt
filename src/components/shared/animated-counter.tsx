"use client";

import * as React from "react";
import { animate, useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

interface AnimatedCounterProps {
  /** The final value to count up to. */
  value: number;
  /** Format the animating number for display (e.g. currency, %). Defaults to a
   * locale integer. Called on every frame, so keep it cheap. */
  format?: (value: number) => string;
  className?: string;
}

/**
 * AnimatedCounter — a number that counts up to its value the first time it
 * scrolls into view, then holds.
 *
 * The small motion that makes a KPI feel *live* rather than printed. Uses
 * tabular figures so the width never jitters mid-count. Under reduced motion it
 * renders the final value immediately — no animation, no layout shift.
 */
export function AnimatedCounter({
  value,
  format = (v) => Math.round(v).toLocaleString(),
  className,
}: AnimatedCounterProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: duration.slower,
      ease: easing.outExpo,
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {format(inView ? display : 0)}
    </span>
  );
}
