# References · Colors

Reference material for the **color system** — the palette, the OKLCH token
model, and the semantic mappings that keep every surface coherent in light and
dark.

Implementation: the token source of truth is `src/styles/globals.css`
(`:root`, `.dark`, `@theme inline`).

## What goes here

- **Palette explorations** — swatches for the obsidian base, Verdikt Azure
  (`--signature`) and its violet companion (`--signature-2`), and neutrals.
- **Verdict semantics** — the `clear` / `caution` / `flagged` triad; contrast
  and how they read as badges, rings, and text.
- **Gradients** — signature gradient studies (hero wordmark, CTA band, brand
  mark).
- **Light ⇆ dark parity** — side-by-side proofs that a surface works in both.
- **Contrast audits** — WCAG AA checks for text/verdict colors on each surface.

## Conventions

- Author values in **OKLCH** (lightness first). We do not use raw hex in the app
  — a color is only "real" once it's a semantic token.
- Every proposed color must ship a **light and dark** value.
- Record contrast ratios for any text/background pair.

## Maps to the code

- Semantic tokens (background, primary, verdict-\*, signature-\*, chart-\*) →
  `src/styles/globals.css`
- Tailwind exposure → `@theme inline` block in the same file
- WebGL hex mirrors → `BRAND` in `src/components/three/vehicle-silhouette.tsx`

## Not here

- Type or spacing tokens (`../typography/`), glass/blur treatments
  (`../glassmorphism/`).
