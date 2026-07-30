# References · Animations

Reference material for Verdikt's **motion language** — the timing, easing, and
choreography that make the product feel alive without feeling busy.

Implementation: motion tokens `src/lib/motion/*`; reusable wrappers
`src/components/motion/*` (`Reveal`, `Stagger`, `Magnetic`, `Parallax`).

## What goes here

- **Easing & timing studies** — references for our signature curves
  (`outExpo`, `inOutQuart`, `outBack`) and duration ramps.
- **Entrance patterns** — fade/rise, blur-in, scale-in; when each is used.
- **Scroll choreography** — GSAP ScrollTrigger parallax/scrub concepts and
  section reveal cascades.
- **Micro-interactions** — magnetic buttons, hover/press feedback, the verdict
  ring draw-on.
- **Orchestration** — stagger rhythms for grids/lists.

## Conventions

- Capture motion as `.mp4`/`.gif`; **annotate duration + easing** for each clip
  so it maps to a token, not a guess.
- Every reference must specify its **reduced-motion** behavior — motion is
  enhancement, never a dependency.
- Prefer referencing the token name (`duration.slow`, `easing.outExpo`) over raw
  numbers.

## Maps to the code

- Tokens (durations, easings, springs) → `src/lib/motion/tokens.ts`
- Framer variants (fadeInUp, blurIn, stagger) → `src/lib/motion/presets.ts`
- Reusable components → `src/components/motion/*`
- GSAP setup & scoped hook → `src/lib/gsap/index.ts`, `src/hooks/use-gsap.ts`

## Not here

- 3D scene animation belongs with `../3d/`; loading/progress motion with
  `../loading/`.
