# References · Models

Source and staging area for **3D model assets** (GLB/GLTF) used by the WebGL
layer, plus the sourcing, licensing, and optimization notes that govern them.

Consumers: `src/components/three/*` (loaded via Drei's `useGLTF`). Runtime-served
models live in `public/models/`; this folder holds **source files, references,
and provenance**.

## What goes here

- **Model references & candidates** — vehicles, abstract forms, or the
  "intelligence core," with links to the source and its license.
- **Source/hi-res files** — the pre-optimization `.glb`/`.gltf` (+ textures).
- **Optimization notes** — draco/meshopt compression, texture resolution, and
  the target file size / triangle budget per model.
- **Provenance** — a `SOURCES.md` entry per asset: author, URL, license (must be
  redistributable), and any required attribution.

## Conventions

- **License first.** No model enters the repo without a clear, compatible
  license recorded in `SOURCES.md`. When in doubt, don't.
- Ship **optimized** runtime models only: Draco/meshopt compressed, textures
  ≤ 2K, target ≤ ~1–2 MB. Put the runtime copy in `public/models/`.
- Prefer **procedural geometry** (as `VehicleSilhouette` does today — an
  original, hand-authored profile extruded in three.js, zero license exposure)
  when a model isn't essential. It is lighter, themeable, and dependency-free.
- Name by subject + variant: `intelligence-core.glb`, `sedan-lowpoly.glb`.

## Maps to the code

- Current signature object is procedural (no model file) → `vehicle-silhouette.tsx`
- Loader path when a model is introduced → Drei `useGLTF("/models/<name>.glb")`
- Remote model hosts are allowlisted in `next.config.ts` image/remote patterns
  only for imagery — model files should be self-hosted in `public/`.

## Not here

- Materials/lighting studies (`../3d/`); rendered stills of models
  (`../hero/` or `../3d/`).
