import type { Variants, Transition } from "motion/react";

import { duration, easing } from "./tokens";

/**
 * Framer Motion presets — a curated library of reusable variants.
 *
 * Components consume these instead of defining inline animation objects, which
 * keeps motion consistent and lets us tune the product's feel centrally.
 */

const baseTransition: Transition = {
  duration: duration.base,
  ease: easing.outExpo,
};

/** Fade + rise. The workhorse entrance for cards, sections, list items. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

/** Fade only — for content where vertical motion would feel busy. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

/** Scale + fade — for modals, popovers, focal reveals. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.fast, ease: easing.outExpo },
  },
};

/** Blur-in — a premium, cinematic reveal for hero headlines. */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: duration.slow, ease: easing.outExpo },
  },
};

/**
 * Stagger container. Pair with any item variant above; children animate in
 * sequence. Tune `staggerChildren` per surface via `staggerContainer(gap)`.
 */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/** Standard viewport config for scroll-triggered reveals. */
export const inViewport = {
  once: true,
  amount: 0.3,
} as const;
