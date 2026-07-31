"use client";

import { motion, useScroll, useSpring } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks";

/**
 * ScrollProgress — a hairline gradient bar tracking how far down the page the
 * visitor has read (the Vercel/Linear "you are here" cue). Spring-smoothed so
 * it never feels like it's snapping to the raw scroll position. Renders
 * nothing under reduced-motion — a moving indicator is exactly the kind of
 * motion those users opted out of.
 */
export function ScrollProgress() {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 40,
    mass: 0.2,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-signature via-signature-2 to-signature"
      style={{ scaleX }}
    />
  );
}
