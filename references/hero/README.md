# References · Hero

Reference material for the landing **hero** — the first impression and the
product's single most important pixel real estate.

Implementation: `src/components/marketing/hero.tsx` +
`src/components/marketing/hero-demo.tsx`.

## What goes here

- **Composition studies** — how the 3D backdrop, headline, and VIN field share
  the frame; where the eye lands first.
- **Headline treatments** — the gradient wordmark (`.text-gradient-signature`),
  balance/wrap, size ramps from mobile → desktop.
- **VIN input concepts** — the "front door" field: idle, focus, validating,
  error, and the inline result reveal.
- **Backdrop depth** — layering, gradient scrims, and how the WebGL core sits
  behind content without hurting legibility.
- **Empty → result transition** — motion for the live, no-signup verdict demo.

## Conventions

- Provide **both** a mobile (≤ 430px) and desktop (≥ 1440px) frame per concept —
  we are Mobile First.
- Motion refs as short `.mp4` (≤ 6s), captured at 60fps where possible.
- Note the intended reduced-motion fallback for any animated concept.

## Maps to the code

- Hero shell & scrims → `hero.tsx`
- Interactive demo & result reveal → `hero-demo.tsx`
- 3D core behind the hero → `src/components/three/hero-scene.tsx`
- Headline gradient → `.text-gradient-signature` in `src/styles/globals.css`

## Not here

- The 3D scene itself (see `../3d/`), raw models (`../models/`), or generic
  color/type studies (`../colors/`, `../typography/`).
