# References · Icons

Reference material for **iconography** — the icon set, usage rules, and the
custom Verdikt brand mark.

Implementation: [Lucide](https://lucide.dev) via `lucide-react`; the brand mark
lives in `src/components/layout/logo.tsx` and `src/app/icon.svg`.

## What goes here

- **Icon selection** — candidate Lucide glyphs mapped to concepts (decode,
  history, risk, valuation, market, ownership, watchlist).
- **Brand mark studies** — the faceted azure diamond + verdict tick: sizing,
  clear-space, the icon-only vs. wordmark lockups, favicon rendering.
- **Sizing & stroke** — how icons pair with type (`size-4`/`size-5`) and stay
  optically balanced.
- **Custom glyphs** — any bespoke icon we need beyond Lucide, with construction
  notes on the same grid/stroke as Lucide (24px, 2px stroke).

## Conventions

- **Default to Lucide.** A custom icon needs a real reason — Lucide keeps the set
  coherent and tree-shakeable (`optimizePackageImports`).
- Custom SVGs: 24×24 viewBox, `2px` stroke, `currentColor`, round joins — so
  they sit next to Lucide without looking foreign.
- Icons are decorative unless labelled; provide `aria-label`/`sr-only` when an
  icon is the only content of a control.

## Maps to the code

- Icon library → `lucide-react` (see `package.json`)
- Nav icon mapping → `src/config/navigation.ts`
- Brand mark → `src/components/layout/logo.tsx`
- Favicon / app icon → `src/app/icon.svg`

## Not here

- Full 3D brand objects (`../3d/`, `../models/`); color tokens (`../colors/`).
