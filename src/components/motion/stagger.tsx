"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";

import { fadeInUp, inViewport, staggerContainer } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

interface StaggerProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  "children"
> {
  children?: React.ReactNode;
  /** Seconds between each child's entrance. */
  gap?: number;
  /** Delay before the first child animates. */
  delay?: number;
}

/**
 * Stagger — orchestrates sequential entrance of its `Stagger.Item` children.
 * Compose lists, grids, and feature rows so they cascade in rather than
 * appearing all at once.
 */
export function Stagger({
  children,
  gap = 0.08,
  delay = 0,
  ...props
}: StaggerProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div {...(props as React.ComponentProps<"div">)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={inViewport}
      variants={staggerContainer(gap, delay)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  "children"
> {
  children?: React.ReactNode;
  variants?: Variants;
}

/**
 * StaggerItem — a child of `Stagger`. Exported as its own named component
 * (rather than `Stagger.Item`) because compound/static-property components do
 * NOT survive the RSC server→client boundary: a Server Component importing a
 * Client Component receives a client *reference*, so attached statics read as
 * `undefined`. Separate named exports each get their own reference.
 */
export function StaggerItem({
  children,
  variants = fadeInUp,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}
