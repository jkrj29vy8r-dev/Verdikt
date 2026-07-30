# References · Loading

Reference material for **loading and progress states** — the moments between
intent and result, which on a premium product should feel intentional, not like
a stall.

Implementation: `src/app/loading.tsx`, the `Skeleton` primitive, and Suspense
fallbacks (e.g. the 3D `SceneFallback`).

## What goes here

- **Skeletons** — content-shaped placeholders for cards, report bodies, and
  lists that match the real layout so there is no reflow on load.
- **Spinners / progress** — the route-level loader and inline pending states
  (e.g. the VIN "Analyzing" button state).
- **Suspense fallbacks** — the hero's gradient placeholder while WebGL hydrates.
- **Optimistic & streaming** — references for progressive reveal as server data
  streams in.
- **Perceived-performance tricks** — shimmer timing, minimum-visible durations,
  and graceful first-paint.

## Conventions

- A skeleton must **mirror the final layout's dimensions** — no layout shift when
  content arrives.
- Honor reduced-motion (shimmer/pulse must degrade).
- Show the state in context (what surrounds it), not in isolation.

## Maps to the code

- Route loader → `src/app/loading.tsx`
- Skeleton primitive → `src/components/ui/skeleton.tsx`
- 3D fallback → `SceneFallback` in `src/components/three/hero-scene.tsx`
- Pending action state → `vin-input.tsx` (`useTransition`)

## Not here

- General entrance motion (`../animations/`); error/empty states (document with
  the relevant surface, e.g. `../dashboard/`).
