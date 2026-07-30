# References · Dashboard

Reference material for the **authenticated app** — dashboard, reports, and the
data-dense surfaces where the product does its daily work.

Implementation: `src/app/(app)/**` +
`src/features/vehicle-intelligence/components/*`.

## What goes here

- **Layout systems** — sidebar + content shell, spacing rhythm, max-widths, and
  the mobile adaptation (drawer nav, stacked stats).
- **Stat tiles / KPI rows** — the dashboard summary cards; number treatment
  (tabular figures), iconography, density.
- **Report cards & lists** — the saved-verdict rows, including the compact
  verdict-score ring and the in-flight (no score yet) state.
- **Data visualization** — how a full report reads: the verdict header, the
  five dimension cards, valuation bands, and any charts.
- **States** — empty (no reports), loading, and error presentations.

## Conventions

- Show **real-looking data**, not lorem — plausible VINs, makes, scores, values.
- Include the empty state for every list; it is a first-run experience, not an
  afterthought.
- Annotate the responsive breakpoint behavior for each layout.

## Maps to the code

- Shell & sidebar → `src/app/(app)/layout.tsx`, `src/components/layout/app-sidebar.tsx`
- Stat tiles → `src/app/(app)/dashboard/page.tsx`
- Report card & full report → `report-card.tsx`, `verdict-report.tsx`, `dimension-card.tsx`
- Signature score ring → `src/components/shared/verdict-score.tsx`

## Not here

- Marketing/landing layouts (`../hero/`) or pure token studies
  (`../colors/`, `../typography/`).
