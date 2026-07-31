"use client";

import { motion } from "motion/react";

import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

/**
 * App route transition. A `template.tsx` remounts on every navigation (unlike a
 * layout), so wrapping children here gives each authenticated page a quick,
 * consistent blur-and-rise entrance as the user moves between dashboard,
 * reports, and settings. Transform/opacity/filter only — cheap on the
 * compositor — and skipped entirely under reduced motion.
 */
export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: duration.base, ease: easing.outExpo }}
    >
      {children}
    </motion.div>
  );
}
