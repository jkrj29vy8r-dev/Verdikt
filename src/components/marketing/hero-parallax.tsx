"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks";

/**
 * HeroParallax — drifts the hero copy up and fades it as the visitor scrolls
 * into the page, handing the frame off to the content below (the 3D car recedes
 * in parallel — see `vehicle-silhouette.tsx`). Mapped over the first ~460px of
 * window scroll since the hero is one viewport tall. Renders statically under
 * reduced-motion.
 */
export function HeroParallax({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 460], [0, -72]);
  const opacity = useTransform(scrollY, [0, 340], [1, 0]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}
