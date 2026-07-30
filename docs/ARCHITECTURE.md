# Verdikt — Architecture

> The verdict on any vehicle. This document is the map of the codebase: what
> every folder is for, how the layers depend on one another, and the conventions
> that keep the system coherent as it scales.

Verdikt is a premium, AI-powered vehicle intelligence platform. A user enters a
VIN and receives a definitive **verdict** — a weighted synthesis of title
history, risk, valuation, market position, and ownership — rendered in seconds.

---

## 1. Principles

The architecture optimizes for four things, in order:

1. **Clarity of intent.** Every folder has one job; you can predict where a file
   lives before you open the tree. Names describe purpose, not mechanism.
2. **A ruthless server/client boundary.** Server-only code (secrets, service
   role, data access) is _structurally_ prevented from reaching the browser.
3. **Reusability by composition.** Small, unopinionated primitives compose into
   product components. Nothing is copy-pasted; behavior lives in one place.
4. **Explainability.** The "AI" verdict is a deterministic, weighted composite —
   the number a buyer trusts is reproducible and auditable; only the prose is
   generative.

---

## 2. Technology

| Concern         | Choice                                               | Why                                                              |
| --------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Framework       | **Next.js 15** (App Router)                          | Server Components, streaming, server actions, first-class Vercel |
| UI runtime      | **React 19**                                         | `useTransition`, `use`, stable concurrent features               |
| Language        | **TypeScript** (strict + `noUncheckedIndexedAccess`) | Correctness at the boundary; types derived from the DB           |
| Styling         | **Tailwind CSS v4** + **shadcn/ui**                  | Token-driven design system; owned, unopinionated primitives      |
| UI motion       | **Framer Motion** (`motion`)                         | Declarative variants, viewport reveals, springs                  |
| Scroll/timeline | **GSAP** + ScrollTrigger                             | Scrubbed, timeline-based scroll choreography                     |
| 3D              | **Three.js** + **React Three Fiber** + **Drei**      | Declarative WebGL for the signature hero                         |
| Data & auth     | **Supabase** (Postgres, Auth, RLS)                   | Row-Level-Security-first data layer, SSR-friendly auth           |
| Hosting         | **Vercel**                                           | Edge middleware, ISR, zero-config Next.js                        |

---

## 3. Directory map

```
verdikt/
├── src/
│   ├── app/                      # Next.js App Router — routing ONLY (thin)
│   │   ├── (marketing)/          #   Route group · public site  → /
│   │   ├── (auth)/               #   Route group · login/signup/callback
│   │   ├── (app)/                #   Route group · authenticated product
│   │   ├── layout.tsx            #   Root: fonts, providers, metadata
│   │   ├── error.tsx · loading.tsx · not-found.tsx
│   │   └── robots.ts · sitemap.ts · icon.svg
│   │
│   ├── components/               # Presentational, cross-feature components
│   │   ├── ui/                   #   shadcn primitives (owned in-repo)
│   │   ├── motion/               #   Framer/GSAP wrappers (Reveal, Stagger…)
│   │   ├── three/                #   R3F renderer shell + scenes
│   │   ├── shared/               #   Composed product components (Container…)
│   │   ├── layout/               #   App/site chrome (header, sidebar…)
│   │   ├── marketing/            #   Landing-page sections
│   │   └── providers/            #   The single client provider boundary
│   │
│   ├── features/                 # Vertical slices — the heart of the app
│   │   ├── vehicle-intelligence/ #   VIN → verdict, end to end
│   │   └── auth/                 #   Sessions, sign-in/up, guards
│   │
│   ├── lib/                      # Framework-agnostic integration & utilities
│   │   ├── supabase/             #   client · server · admin · middleware · types
│   │   ├── motion/               #   Motion design tokens & presets
│   │   ├── gsap/                 #   GSAP plugin registration
│   │   └── utils/                #   cn(), formatters
│   │
│   ├── config/                   # Typed constants: env, site, navigation
│   ├── hooks/                    # Shared React hooks
│   ├── stores/                   # Global UI state (Zustand)
│   ├── types/                    # Cross-cutting TypeScript types
│   └── styles/                   # globals.css — the design-token source of truth
│
├── supabase/                     # migrations/ + config.toml
├── docs/                         # This file
└── middleware.ts                 # Auth session refresh + route protection
```

### What each layer may import

Dependencies point **downward** only. A higher layer may import from a lower
one; never the reverse.

```
app ─▶ features ─▶ components ─▶ lib ─▶ config/types
                    (shared)      (motion, supabase, utils)
```

- **`app/`** is thin: routing, layouts, and composition. Pages fetch via a
  feature service or render a feature component — they contain no business logic.
- **`features/`** own business logic and may use `components`, `lib`, `config`.
- **`components/`** are presentational. `components/shared` and below **must not**
  import from `features/` (that would invert the dependency). This is why the
  signature `VerdictScore` lives in `shared` and takes primitive props, while the
  mapping from domain → props lives in the feature.
- **`lib/`, `config/`, `types/`** are leaves — no imports from above.

---

## 4. The feature module pattern

A feature is a **self-contained vertical slice**. `vehicle-intelligence` is the
reference implementation:

```
features/vehicle-intelligence/
├── types.ts          # Domain model (enums derived from the DB types)
├── schema.ts         # Zod validation + VIN check-digit algorithm
├── constants.ts      # Scoring weights, thresholds (config-as-data)
├── synthesis.ts      # PURE engine: deterministic scoring (unit-testable)
├── services/         # SERVER-ONLY I/O
│   ├── vin-decoder.ts        #   provider abstraction (swap vendors here)
│   ├── intelligence.ts       #   orchestrator (decode → synthesize → LLM seam)
│   └── reports.repository.ts #   the ONLY module that touches the reports table
├── actions.ts        # "use server" — the feature's write API (Result-typed)
├── hooks/            # Client hooks (useVinInput)
├── components/       # Feature UI (VinInput, VerdictReport, ReportCard…)
└── index.ts          # Public surface — CLIENT-SAFE exports only
```

Rules that make this scale:

- **`index.ts` exposes only what is safe to import from client code** — types,
  schema, actions, components, hooks. Server-only modules (`services/*`,
  `synthesis`) are imported by path from server code, so they are kept out of
  client bundles _by construction_, not by convention.
- **Pure core, impure edges.** `synthesis.ts` is deterministic and side-effect
  free (a seeded PRNG makes a VIN map to a stable report), so scoring is testable
  and explainable. The services wrap it with the messy parts: provider calls,
  the database, and the LLM narrative pass.
- **One repository per table.** All `vehicle_reports` access flows through
  `reports.repository.ts`. SQL/PostgREST concerns never leak into UI or actions.

To add a feature (e.g. `watchlist`): create the same folders, expose a
client-safe `index.ts`, and wire routes in `app/(app)/`. The `watchlist_items`
table, RLS, and types already exist for exactly this.

---

## 5. Data flow & the server/client boundary

```
        ┌─────────────── Browser ───────────────┐
Request │  Client Components  ·  Server Actions   │
   │    └───────────┬────────────────┬───────────┘
   ▼                │ (RPC)          │ ("use server")
middleware.ts       ▼                ▼
(refresh session,  Client         actions.ts ──▶ requireUser()
 protect routes)   fetch                     └─▶ services/* ──▶ Supabase
                     ▲                                   │  (RLS-scoped)
                     └────────── Server Components ───────┘
                                (await data at request time)
```

- **Reads** happen in Server Components: pages `await` a repository function and
  render. No client data-fetching, no loading spinner on first paint. RLS scopes
  every query to the authenticated user automatically.
- **Writes** happen through **Server Actions** (`actions.ts`). Each action:
  authenticates → validates at the trust boundary with Zod → does work →
  `revalidatePath` → returns a typed `Result<T, E>` so the UI renders inline
  errors instead of throwing.
- **Auth** is enforced in two places on purpose: `middleware.ts` gives the fast
  redirect (UX), and `requireUser()` in the `(app)` layout is the authoritative
  gate (correctness) so every nested page can assume a user.
- **Three Supabase clients, three trust levels:**
  `client.ts` (browser, anon key) · `server.ts` (per-request, cookie-bound) ·
  `admin.ts` (service role, `import "server-only"`, bypasses RLS — trusted jobs
  only). Env is validated at boot by `config/env.ts`; server secrets throw if
  ever read in the browser.

---

## 6. Design system

`src/styles/globals.css` is the single source of truth for the visual language.

- **Semantic tokens in OKLCH** for perceptual uniformity, defined for light and
  dark and exposed to Tailwind via `@theme inline`. Application code references
  only semantic utilities (`bg-background`, `text-primary`,
  `text-verdict-clear`) — never raw color values.
- **Verdict semantics** (`clear` / `caution` / `flagged`) are first-class tokens
  and match the `verdict_status` DB enum exactly, so domain data drives color
  with no translation.
- **Radius, shadows, and easings** derive from single knobs, so the product's
  "feel" is tunable centrally.
- **shadcn/ui primitives** (`components/ui`) are owned in-repo and unopinionated;
  the brand-specific `signature` button variant and verdict badges extend them.

## 7. Motion & 3D

- **Motion tokens** (`lib/motion/tokens.ts`) are the temporal half of the design
  system, shared across CSS, Framer Motion, and GSAP so timing is consistent.
- **Reusable wrappers** (`components/motion`) — `Reveal`, `Stagger`/`StaggerItem`,
  `Magnetic`, `Parallax` — mean product code animates declaratively and never
  hand-rolls an animation config. All honor `prefers-reduced-motion`.
- **3D** mounts through one shell: `SceneCanvas` configures the renderer once
  (capped DPR, demand frameloop under reduced-motion). Scenes (`VerdiktCore`)
  are pure content. `HeroScene` lazy-loads WebGL client-side (`ssr: false`) with
  a gradient fallback, keeping three.js off the critical path.

> **RSC gotcha, encoded in the code:** compound components (`Stagger.Item`) do
> **not** survive the server→client boundary — a Server Component importing a
> Client Component receives a client _reference_, so attached statics read as
> `undefined`. Every such child is therefore a separate named export.

---

## 8. Conventions

- **Imports:** `@/*` path alias; type-only imports use `import type`
  (`verbatimModuleSyntax`).
- **Barrels** expose a module's public surface — except where they would cross
  the server/client boundary (the Supabase clients are intentionally _not_
  barreled together).
- **`Result<T, E>`** over throwing for expected failures; throw only for
  programmer error.
- **Config as data:** navigation, scoring weights, and pricing are declared as
  typed data, so structure is auditable in one glance and components stay
  presentational.
- **Quality gate:** `pnpm check` (typecheck + lint + format) must pass. The
  production build type-checks the full graph including RSC boundaries.
