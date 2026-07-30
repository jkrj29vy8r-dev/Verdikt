# References · Glassmorphism

Reference material for **frosted-surface treatments** — the layered, translucent
depth that signals premium chrome without sacrificing legibility.

Implementation: the `surface-glass` and `border-hairline` utilities in
`src/styles/globals.css`.

## What goes here

- **Frosted surfaces** — headers, floating nav, popovers/menus, and cards that
  sit over media or the 3D hero.
- **Blur & saturation studies** — the right `backdrop-filter` blur radius and
  saturation so content stays readable on busy backdrops.
- **Edge & elevation** — hairline borders, inner highlights, and shadow pairing
  that sell the "pane of glass" without muddiness.
- **Theme parity** — glass that reads on both light and dark backgrounds.
- **Legibility guards** — scrims/tints needed to keep text AA-contrast over
  glass.

## Conventions

- Every glass concept must include a **legibility proof** — text over the busiest
  intended background, in light and dark.
- Note the blur radius, background tint (via `color-mix`), and border in terms
  the utilities already express — extend the utility, don't one-off inline it.
- Respect performance: `backdrop-filter` is GPU-costly; flag heavy stacked uses.

## Maps to the code

- `.surface-glass` (blur + saturate + translucent card) → `globals.css`
- `.border-hairline` (theme-aware hairline) → `globals.css`
- In use → `src/components/layout/site-header.tsx`, `src/app/(app)/layout.tsx`

## Not here

- Solid color tokens (`../colors/`); non-glass elevation/shadows (document those
  with the component).
