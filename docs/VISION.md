# Verdikt — Product Vision

> Verdikt is **not** another VIN checker. It is an **AI vehicle intelligence
> platform**: a VIN goes in, and a definitive, explainable **verdict** comes out.

The user does not want data — they want a decision. Verdikt's job is to turn the
fragmented, intimidating world of vehicle data into one confident answer:
**should I buy this car, or walk away?**

---

## What the user receives

Seven outputs, delivered from a single VIN. Each is a first-class part of the
domain model (`src/features/vehicle-intelligence`), not a bolt-on.

| #   | Output                         | What it answers                                 | Where it lives                                                        |
| --- | ------------------------------ | ----------------------------------------------- | --------------------------------------------------------------------- |
| 1   | **Vehicle history**            | What has this car been through?                 | `IntelligenceDimension` (`history`) + signals                         |
| 2   | **AI analysis**                | What does it all mean, in plain language?       | `VehicleVerdict.summary` (LLM narrative seam over deterministic core) |
| 3   | **Vehicle score**              | One number, 0–100.                              | `VehicleVerdict.score` → the signature `VerdictScore` ring            |
| 4   | **Repair predictions**         | What's likely to break, when, and for how much? | `RepairForecast` (`RepairPrediction[]` + 12-month estimate)           |
| 5   | **Maintenance estimation**     | What routine upkeep should I budget for?        | `MaintenanceSchedule` (`MaintenanceItem[]` + annual estimate)         |
| 6   | **Price estimation**           | Is it fairly priced?                            | `VehicleValuation` (estimate + confidence band)                       |
| 7   | **Buy / Avoid recommendation** | The decision, stated outright.                  | `VehicleVerdict.recommendation` — **buy / consider / avoid**          |

**Explainability is the moat.** The score and the recommendation are a
deterministic, weighted composite (`synthesis.ts` + `constants.ts`) — the number
a buyer trusts is reproducible and auditable. The _language_ around it is
AI-authored. We are AI-powered where it delights, deterministic where it counts.

---

## The experience: Apple × Tesla

Two references, one feeling: **inevitable, precise, and expensive.**

**From Apple — restraint & inevitability.**

- Say one thing per screen. The verdict is the hero; everything else supports it.
- One signature accent, generous whitespace, typographic hierarchy over chrome.
- Motion is meaningful, never decorative. Details are the product.
- It should feel obvious in hindsight — as if it could not have been another way.

**From Tesla — confident, futuristic minimalism.**

- Dark by default. The product (the vehicle, the intelligence) glows against it.
- Depth and dimensionality: the 3D intelligence core, glass surfaces, real motion.
- The interface recedes; the intelligence takes center stage.
- Technology you feel but don't fiddle with — it just knows.

How that maps to what we've built:

- **Verdict-first** — the `VerdictScore` ring and the `buy/consider/avoid` call
  lead every report.
- **Obsidian + azure→violet signature** — dark theme is the canvas; the
  signature gradient is the single confident accent.
- **3D & glass** — the `VerdiktCore` scene and `surface-glass` chrome supply the
  Tesla-grade depth.
- **Premium motion** — composed from shared tokens (`Reveal`, `Stagger`,
  `blurIn`), reduced-motion honored.

This bar is enforced, not aspirational — see the "No generic UI" and
"Premium animations" rules in `CLAUDE.md`, and the design method in
`docs/ARCHITECTURE.md`.

---

## Status & next

**Modeled now:** all seven outputs exist in the domain model and are produced by
the reference engine; the report surfaces the score, recommendation, price,
repair, and upkeep figures.

**Next, to fully realize the vision:**

- A dedicated, Apple×Tesla-grade **report experience** with distinct sections
  for repair predictions and the maintenance schedule (built from
  `references/` — inspired, never copied).
- Denormalize `recommendation` to a `vehicle_reports` column so lists can filter
  "buy" vehicles (a migration + type regen).
- Wire the LLM narrative pass (`services/intelligence.ts`) for outputs 2.
