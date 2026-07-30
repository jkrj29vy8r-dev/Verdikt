# References

Design source-of-truth for Verdikt. This folder holds **inspiration, specs, and
raw source assets** that inform what we build — not shipped code. It is the
bridge between design intent and the implementation in `src/`.

Think of it as the studio wall: reference imagery, motion clips, palettes, type
specimens, and 3D assets, each organized by the surface or system it informs.

## Structure

| Folder           | Informs                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `hero/`          | The landing hero — 3D backdrop, headline, live VIN demo                |
| `dashboard/`     | Authenticated app — layout, stat tiles, report cards, data viz         |
| `3d/`            | WebGL scenes, materials, lighting (`src/components/three`)             |
| `animations/`    | Motion language — easings, reveals, scroll choreography                |
| `colors/`        | Palette & OKLCH token system (`src/styles/globals.css`)                |
| `typography/`    | Type scale, Geist specimens, editorial treatments                      |
| `glassmorphism/` | Frosted-surface treatments (`surface-glass`, `border-hairline`)        |
| `loading/`       | Skeletons, spinners, Suspense & progress states                        |
| `icons/`         | Iconography — Lucide usage + the custom brand mark                     |
| `models/`        | 3D model assets (GLB/GLTF) and sourcing/optimization notes             |
| `inspiration/`   | External captures (mood board) + the analysis that extracts principles |

## How to use it

- **Adding a reference?** Drop it in the right folder and log its **source +
  attribution** (in that folder's README or a local `SOURCES.md`). We never
  ship third-party assets without a clear license.
- **Implementing?** Read the folder's README first — it points to the exact
  tokens/components the reference should translate into. References set the bar;
  `CLAUDE.md` and `docs/ARCHITECTURE.md` set the method.

## Conventions (apply everywhere below)

- **Naming:** `kebab-case`, descriptive, with source — e.g.
  `hero-depth-parallax-linear.png`, `verdict-ring-motion-dribbble.mp4`.
- **Formats:** stills → `.webp`/`.png`; motion → `.mp4`/`.gif`; specs →
  `.md`/`.pdf`; palettes → `.png` + values in the README; 3D → `.glb`/`.gltf`.
- **Keep it light.** Compress imagery; prefer links for anything large. This
  folder should not bloat the repo or the clone.
- **No secrets, no shipped code.** References only.
