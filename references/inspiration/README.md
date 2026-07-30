# References · Inspiration (external sources)

Raw design captures collected as **mood board / inspiration only**. Nothing here
is a target to reproduce. We extract _principles_, not pixels, and translate them
through Verdikt's own identity (see "Verdikt divergence" below).

> **Rule:** Before building any UI, read this folder, extract the relevant
> principle, then express it with Verdikt tokens and metaphors. **Never clone a
> source.** If an implementation could be mistaken for one of these captures, it
> is wrong — start over.

## Provenance

Third-party UI, captured for internal reference. Not licensed for redistribution
or reuse; do not ship any asset here or publish it externally.

| File                                          | Source                                  | What it shows                                                                            |
| --------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `screens/01-mercedes-benz-test-drive-listing` | mercedes-benz.ro (mobile)               | Model listing, product card, filter/sort, price + CTA                                    |
| `screens/02-mercedes-benz-mobile-menu`        | mercedes-benz.ro (mobile)               | Full-screen nav overlay, editorial "Meniu"                                               |
| `screens/03-ridelux-landing-flow`             | Dribbble — "RideLux" (MQoS UI/UX)       | Full landing flow, two-phone mockup                                                      |
| `screens/04-ridelux-trust-value-bento`        | Dribbble — "RideLux"                    | Bento value cards, image + solid-accent mix                                              |
| `screens/05-ridelux-home-hero-how-it-works`   | Dribbble — "RideLux"                    | Hero + glass search bar, 4-step "How It Works"                                           |
| `screens/06-ridelux-popular-cars-service`     | Dribbble — "RideLux"                    | Product cards, aerial-car radial service diagram                                         |
| `screens/07-ridelux-latest-blogs-footer`      | Dribbble — "RideLux"                    | Content cards with arrow buttons, dark footer                                            |
| `screens/08-rydex-marketplace-app`            | Dribbble — "Rydex" (Excellent Webworld) | Car marketplace app: onboarding, detail tabs, ratings                                    |
| `screens/09-logistics-dashboard`              | Dribbble — logistics (The Ash Design)   | Stat tiles, tracking cards, status pills, timeline, map                                  |
| `screens/10-logistics-dashboard-detail-panel` | Dribbble — logistics (The Ash Design)   | Tabbed detail (Order/Customer/Driver/Vehicle), spec rows, 87% load bar, route + timeline |
| `screens/11-logistics-dashboard-flatlay`      | Dribbble — logistics (The Ash Design)   | Flat-lay: tracking cards, "Paid" status pill, stat tiles                                 |
| `motion/recording-1…6`                        | Mobile browsing session (2026-07-30)    | Scroll, reveal timing, and transition feel                                               |

_Videos are heavy (~65 MB total) and can't be code-analyzed here; they're for
human review of motion feel. If repo weight matters, migrate them to Git LFS or
keep them out and link externally._

## What each source teaches (principles, not pixels)

**Mercedes-Benz — restraint & editorial hierarchy.** Near-monochrome canvas, one
accent reserved for the primary action, enormous whitespace, a single elegant
display voice over calm sans body, soft-gray rounded product cards, small pill
badges. Lesson: _premium is what you leave out._

**RideLux — cinematic depth & guided flow.** A photographic hero with a
**glass search bar floating over it**; a **4-step "How It Works"** row; **bento**
benefit cards mixing imagery with solid-accent tiles; product cards with one
decisive action; a radial "hub-and-spoke" diagram around a central vehicle.
Lesson: _sell the outcome with depth and a clear, staged journey._

**Rydex — the product's own vocabulary.** Onboarding feature pills including
**"AI-Powered Price Valuation"** and **"Verify Seller & Buyers"**; a detail view
with **Overview / Variants / Details / Reviews** tabs and **rating tiles**
(4.9 Exterior · 4.5 Comfort · 4.8 Performance); a "360" badge. Lesson: _scored
attributes and a tabbed detail read as trustworthy intelligence._

**Logistics dashboard — data you can act on.** **Stat tiles** with quiet colored
icons, **tracking cards** with progress bars and **status pills** (In transit /
Processing / Received), a **right-hand detail panel** with a **map**, a
**movement timeline**, a **tabbed detail** (Order / Customer / Driver /
Vehicle) with spec rows and an 87% load bar, and a "Paid" status pill; a left
icon rail. Lesson: _dense data stays calm through tiles, pills, and a
consistent, tabbed detail panel._

## How principles map to Verdikt surfaces

| Principle (source)                       | Verdikt surface / component                                 |
| ---------------------------------------- | ----------------------------------------------------------- |
| Glass search over hero (RideLux)         | `VinInput` floating over the 3D `HeroScene`                 |
| 4-step "How It Works" (RideLux)          | Verdict pipeline: **decode → analyze → score → verdict**    |
| Bento benefit cards (RideLux)            | Landing feature grid → the **five intelligence dimensions** |
| Rating tiles / scored attributes (Rydex) | `VerdictScore` ring + `DimensionCard` (0–100 per dimension) |
| Tabbed detail + "360" (Rydex)            | Report detail tabs; a future 3D vehicle viewer              |
| Stat tiles (logistics)                   | Dashboard KPIs (verdicts run, avg score, cleared)           |
| Status pills (logistics)                 | `Badge` verdict variants: `clear` / `caution` / `flagged`   |
| Detail panel + timeline (logistics)      | Report detail: valuation band + history/ownership timeline  |
| Editorial restraint (Mercedes)           | Whitespace, one signature CTA, calm hierarchy everywhere    |

## Verdikt divergence — how we stay unmistakably ours

These are the guardrails that keep "inspired" from becoming "copied":

- **Color.** References trend **red/coral** (RideLux, Rydex) or Mercedes-blue or
  light dashboards. Verdikt is **dark-obsidian with an azure→violet signature**
  (`--signature`, `--signature-2`). We never adopt their red or their blue.
- **Type.** Mercedes uses a serif; RideLux/Rydex use bold grotesques. Verdikt
  stays on **Geist** — we borrow Mercedes' _restraint_, not its typeface.
- **The metaphor.** Every reference sells _browsing / booking / renting /
  shipping_. Verdikt sells **judgment** — the whole product resolves to a
  **verdict score**. That reframes every borrowed pattern around one number no
  reference has.
- **Signature elements no source has.** The **3D intelligence core** and the
  **verdict ring** (`clear`/`caution`/`flagged`) are ours. When in doubt, lean on
  these — they are the identity anchors.
- **Motion.** Compose our tokens (`outExpo`, `blurIn`, `Stagger`) — not a
  reference's timing. Depth via our WebGL/glass, not stock hero photos.

See `CLAUDE.md` → "Design references workflow" and `../README.md` for conventions.
