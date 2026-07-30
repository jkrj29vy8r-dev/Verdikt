/**
 * Motion tokens — the temporal half of the design system.
 *
 * These values are the single source of truth for animation across the three
 * motion engines we use:
 *   • CSS transitions/animations  (mirrored in `globals.css` @theme)
 *   • Framer Motion               (import `easing` / `duration` here)
 *   • GSAP                        (import `gsapEase` here)
 *
 * Keeping them in one typed module means a designer can retune the product's
 * "feel" in one place and have it propagate everywhere.
 */

/** Durations in seconds (Framer Motion / GSAP native unit). */
export const duration = {
  instant: 0.12,
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
  slower: 0.9,
  cinematic: 1.4,
} as const;

/** Cubic-bézier control points, shared with the CSS `--ease-*` tokens. */
export const easing = {
  /** Decisive entrances — the house default. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Balanced, symmetric transitions. */
  inOutQuart: [0.76, 0, 0.24, 1],
  /** Playful overshoot for tactile affordances. */
  outBack: [0.34, 1.56, 0.64, 1],
} as const;

/** GSAP consumes eases as strings; expose ready-made names. */
export const gsapEase = {
  outExpo: "expo.out",
  inOutQuart: "quart.inOut",
  outBack: "back.out(1.7)",
} as const;

/** Canonical spring for interactive, physical elements. */
export const spring = {
  soft: { type: "spring", stiffness: 220, damping: 30, mass: 1 },
  snappy: { type: "spring", stiffness: 420, damping: 34, mass: 0.9 },
  gentle: { type: "spring", stiffness: 120, damping: 24, mass: 1.1 },
} as const;

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
