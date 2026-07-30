# References · 3D

Reference material for the **WebGL layer** — scenes, materials, lighting, and
composition for the Three.js / React Three Fiber surfaces.

Implementation: `src/components/three/*` (renderer shell `SceneCanvas`, scene
`VerdiktCore`, lazy wrapper `HeroScene`).

## What goes here

- **Scene composition** — camera framing, object scale, negative space, and how
  the subject reads against the page background.
- **Material studies** — the premium look: metalness/roughness, distortion,
  transmission/refraction, emissive glow in the signature palette.
- **Lighting & environment** — key/fill/rim setups and HDRI/environment choices
  that produce the reflective sheen.
- **Performance notes** — poly budgets, DPR caps, instancing, and what must stay
  on a `demand` frameloop for reduced-motion / low-power devices.
- **Shader / post FX** — any custom shader or effect concepts (bloom, grain).

## Conventions

- State the **triangle budget** and target FPS for every scene concept.
- Note whether a reference needs an external HDRI/asset (and its license).
- Keep capture clips short; link to CodeSandbox/R3F examples where possible.

## Maps to the code

- Renderer defaults (DPR cap, frameloop) → `scene-canvas.tsx`
- Signature scene (distorted icosahedron, sparkles, environment) → `verdikt-core.tsx`
- WebGL brand hexes (mirror the OKLCH tokens) → `BRAND` in `verdikt-core.tsx`

## Not here

- Downloadable model files → `../models/`. Non-WebGL motion → `../animations/`.
