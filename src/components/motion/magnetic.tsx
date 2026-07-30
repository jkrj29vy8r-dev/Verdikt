"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { spring } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

interface MagneticProps extends React.ComponentProps<typeof motion.div> {
  /** How far the element is pulled toward the cursor, in px. */
  strength?: number;
}

/**
 * Magnetic — pulls its content toward the cursor on hover, a signature premium
 * micro-interaction for CTAs and interactive icons. Springs back on leave, and
 * is inert under reduced-motion.
 */
export function Magnetic({ children, strength = 12, ...props }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.gentle);
  const sy = useSpring(y, spring.gentle);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength * 2);
    y.set((relY / rect.height) * strength * 2);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
