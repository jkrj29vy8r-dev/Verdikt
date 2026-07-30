<div align="center">

# Verdikt

**The verdict on any vehicle.**

A premium, AI-powered vehicle intelligence platform. Decode any VIN into a
definitive verdict — history, valuation, risk, and market position — synthesized
in seconds.

Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Framer Motion ·
GSAP · Three.js / R3F · Supabase · Vercel

</div>

---

## Quick start

**Prerequisites:** Node ≥ 20.11, [pnpm](https://pnpm.io) ≥ 9, and the
[Supabase CLI](https://supabase.com/docs/guides/cli) for local data.

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local        # then fill in the values

# 3. Start Supabase locally (Postgres + Auth) and apply the schema
supabase start
supabase db reset                 # runs supabase/migrations
pnpm db:types                     # regenerate typed schema (optional)

# 4. Run the app
pnpm dev                          # http://localhost:3000
```

The landing page offers a **live, no-signup verdict** — enter any valid VIN and
a full report renders inline. Saving reports, the dashboard, and the watchlist
require an account.

> Try a valid sample VIN: `1HGCM82633A004352`

---

## Scripts

| Command          | Description                                     |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | Start the dev server (Turbopack)                |
| `pnpm build`     | Production build                                |
| `pnpm start`     | Serve the production build                      |
| `pnpm typecheck` | `tsc --noEmit` across the project               |
| `pnpm lint`      | ESLint (Next core-web-vitals + TypeScript)      |
| `pnpm format`    | Prettier write                                  |
| `pnpm check`     | typecheck + lint + format check (the CI gate)   |
| `pnpm db:types`  | Regenerate `src/lib/supabase/database.types.ts` |
| `pnpm db:reset`  | Reset the local database and replay migrations  |

---

## Project structure

A quick orientation — see **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** for
the full rationale, layering rules, and conventions.

```
src/
├── app/          # Routing only — route groups: (marketing) (auth) (app)
├── components/   # Presentational: ui · motion · three · shared · layout · marketing
├── features/     # Vertical slices: vehicle-intelligence · auth
├── lib/          # Integrations & utilities: supabase · motion · gsap · utils
├── config/       # Typed constants: env · site · navigation
├── hooks/ stores/ types/ styles/
supabase/         # migrations + config.toml
```

**Design highlights**

- **Feature modules** are self-contained vertical slices (types → schema →
  service → actions → hooks → components) with a client-safe public surface.
- **Server/client boundary is structural:** secrets and data access are
  `server-only`; feature barrels never re-export server code.
- **Design tokens in OKLCH** drive light/dark theming via Tailwind v4 `@theme`;
  the `verdict` semantic colors match the database enum exactly.
- **Explainable AI:** the verdict score is a deterministic, weighted composite;
  the generative layer authors prose, not the number a buyer trusts.

---

## Deployment

**Vercel + Supabase**, zero custom infrastructure.

1. Create a Supabase project and push migrations: `supabase db push`.
2. Import the repo into Vercel.
3. Set the environment variables from `.env.example` in the Vercel project
   (Production + Preview). `config/env.ts` validates them at build time, so a
   missing value fails the build with a readable error rather than at runtime.
4. Add your production URL to Supabase Auth's redirect allowlist
   (`<url>/auth/callback`).

The `middleware.ts` session refresh runs on the edge; authenticated routes are
server-rendered on demand, and the marketing page is static.

---

## License

Proprietary — © Verdikt. All rights reserved.
