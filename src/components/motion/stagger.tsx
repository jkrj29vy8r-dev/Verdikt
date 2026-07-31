"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";

import { fadeInUp, inViewport, staggerContainer } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

/**
 * Elements a Stagger can render as. Deliberately a small, closed set: a
 * cascade is a *layout* device, and the element it renders must still be the
 * semantically correct one for the content. A kinetic headline has to be an
 * `h1`, not a `div` that merely looks like one — hence `as`.
 */
type StaggerTag = "div" | "h1" | "h2" | "h3" | "p" | "ul" | "span";
type StaggerItemTag = "div" | "span" | "li";

interface StaggerProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  "children"
> {
  children?: React.ReactNode;
  /** Seconds between each child's entrance. */
  gap?: number;
  /** Delay before the first child animates. */
  delay?: number;
  /** Element to render. Default `div`; use `h1`/`h2` when the staggered
   * content *is* the heading, so animation never costs document semantics. */
  as?: StaggerTag;
}

/**
 * Stagger — orchestrates sequential entrance of its `StaggerItem` children.
 * Compose lists, grids, and feature rows so they cascade in rather than
 * appearing all at once.
 */
export function Stagger({
  children,
  gap = 0.08,
  delay = 0,
  as = "div",
  ...props
}: StaggerProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    const Plain = as as "div";
    return (
      <Plain {...(props as React.ComponentProps<"div">)}>{children}</Plain>
    );
  }

  // Cast to the `div` variant: the declared prop surface above *is* the div
  // surface, and the tags differ only in element-specific ref/event generics
  // we never rely on. The rendered tag is still `as` at runtime.
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={inViewport}
      variants={staggerContainer(gap, delay)}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface StaggerItemProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  "children"
> {
  children?: React.ReactNode;
  variants?: Variants;
  /** Element to render. Default `div`; use `span` inside a heading (a `div`
   * is invalid there) or `li` inside a `ul`. */
  as?: StaggerItemTag;
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
  as = "div",
  ...props
}: StaggerItemProps) {
  // See the cast note in `Stagger` above — same rationale.
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp variants={variants} {...props}>
      {children}
    </Comp>
  );
}
