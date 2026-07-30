# References · Typography

Reference material for the **type system** — the families, scale, and editorial
treatments that carry Verdikt's precise, premium voice.

Implementation: fonts wired in `src/app/layout.tsx` (Geist Sans + Geist Mono,
self-hosted); scale via Tailwind utilities and `globals.css`.

## What goes here

- **Specimens** — Geist Sans and Geist Mono across weights and optical sizes.
- **Scale studies** — the display → body → caption ramp, including the fluid
  mobile → desktop headline sizes and `text-balance`/`text-pretty` usage.
- **Numeric treatments** — **tabular figures** for VINs, mileage, valuations,
  and the verdict score (`.tabular` / `font-variant-numeric`).
- **Editorial layouts** — eyebrow + heading + supporting copy patterns
  (see `SectionHeading`).
- **Pairing** — where mono is used (VINs, refs, code) vs. sans.

## Conventions

- Reference the **token/family**, not a pixel size where a utility exists
  (`--font-sans`, `--font-mono`).
- Show line-length (measure) and leading for body copy blocks.
- Prove legibility on both themes and at 320px width.

## Maps to the code

- Font wiring & CSS variables → `src/app/layout.tsx`, `--font-sans`/`--font-mono`
  in `src/styles/globals.css`
- Tabular numerics → `.tabular` utility in `globals.css`
- Section heading pattern → `src/components/shared/section.tsx`

## Not here

- Color of text (`../colors/`) or icon glyphs (`../icons/`).
