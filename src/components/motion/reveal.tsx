"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";

import { fadeInUp, inViewport } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

interface RevealProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  "children"
> {
  children?: React.ReactNode;
  /** Variant to animate with. Defaults to the house `fadeInUp`. */
  variants?: Variants;
  /** Delay in seconds before the reveal begins. */
  delay?: number;
  /** Animate every time it enters the viewport, not just once. */
  repeat?: boolean;
}

/**
 * Reveal — declarative scroll-triggered entrance.
 *
 * The single, reusable primitive for "animate this in as it scrolls into view".
 * Wrap any content; it honors reduced-motion by rendering statically. Because
 * it forwards all `motion.div` props, callers can still customize per use.
 */
export function Reveal({
  children,
  variants = fadeInUp,
  delay = 0,
  repeat = false,
  ...props
}: RevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div {...(props as React.ComponentProps<"div">)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ ...inViewport, once: !repeat }}
      variants={variants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
