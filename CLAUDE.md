# Verdikt — Engineering Constitution

> Read this first, every session. It is the contract for all work in this repo.
> Rules here override defaults. When a change would violate a rule, stop and
> reconsider the approach — do not ship the violation.

## Mission

Build the world's most premium vehicle intelligence platform. A user enters a
VIN and receives a definitive **verdict**. Everything we ship should feel
inevitable, precise, and expensive — the Apple of vehicle data.

---

## The Rules — and how we honor them _here_

Each principle is bound to a concrete pattern in this codebase. "Follow the
rule" means "use the pattern."

| Principle                          | How we do it in this repo                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Enterprise quality**             | `pnpm check` (typecheck + lint + format) is the gate — it must pass before any commit. `tsc` is strict with `noUncheckedIndexedAccess`.                 |
| **Clean architecture**             | Dependencies point downward only: `app ▶ features ▶ components ▶ lib ▶ config/types`. Never invert. See `docs/ARCHITECTURE.md`.                         |
| **Reusable components**            | Behavior lives once. Primitives in `components/ui`; composed reuse in `components/shared`; feature-specific UI in `features/*/components`.              |
| **Mobile First**                   | Author base styles for mobile; add `md:`/`lg:` to _enhance_ upward — never the reverse. Test at 375px before 1440px.                                    |
| **Accessibility First**            | Semantic HTML, labelled controls, visible focus (`focus-visible:ring`), `role`/`aria-*` on custom widgets, skip link, `prefers-reduced-motion` honored. |
| **Performance First**              | Server Components by default; `"use client"` only when needed. Heavy/3D code is `next/dynamic({ ssr:false })`. Cap image/DPR. Watch First-Load JS.      |
| **Dark Mode**                      | Dark is the default theme. Every surface is authored for both via OKLCH tokens in `globals.css` — never a one-off color.                                |
| **Glassmorphism**                  | Use the `surface-glass` and `border-hairline` utilities for elevated/floating chrome. Frosted, not flat, for overlays, headers, and cards on media.     |
| **Premium animations**             | Compose `components/motion` (`Reveal`, `Stagger`, `Magnetic`, `Parallax`) with tokens from `lib/motion`. Never hand-roll durations/easings inline.      |
| **3D First**                       | Signature surfaces get depth. Mount through `three/SceneCanvas`; scenes are pure content; lazy-load with a graceful fallback.                           |
| **No generic UI**                  | No unstyled defaults, no stock component dumps. Everything routes through the design system and the `signature` brand treatments.                       |
| **Every component documented**     | Every exported component/hook/service opens with a JSDoc block: what it is, why it exists, and any non-obvious constraint.                              |
| **Every feature production ready** | A feature is done only when it meets the Definition of Done below — not when it renders.                                                                |

---

## Definition of Done

A change is production-ready when **all** hold:

- [ ] `pnpm check` passes (types, lint, format) and `pnpm build` succeeds.
- [ ] Responsive from 320px up; verified mobile-first.
- [ ] Keyboard-navigable; focus visible; screen-reader labels present.
- [ ] Works in light **and** dark; only semantic tokens used (no raw hex/oklch).
- [ ] Reduced-motion path degrades gracefully.
- [ ] Every new export is documented.
- [ ] No new dependency without justification (see Never).
- [ ] Server-only code stays server-only (not re-exported from a client-safe barrel).

---

## Never

- **Never duplicate code.** Extract to `components/shared`, `lib/utils`, a hook,
  or a feature service. If you copy-paste, you owe a refactor.
- **Never add a random library.** Prefer the platform and what's already here
  (see `package.json`). A new dependency needs a real reason, a maintained
  source, and bundle-size awareness. When in doubt, don't.
- **Never use poor naming.** Names describe purpose, not mechanism. Components
  `PascalCase`, hooks `useX`, files `kebab-case`, booleans read as assertions.
- **Never ship ugly or generic UI.** If it looks like a default Tailwind/shadcn
  screenshot, it isn't done. Spacing, hierarchy, and motion are the product.

---

## Conventions (non-negotiable mechanics)

- **Styling:** every `className` goes through `cn()`. Colors come from semantic
  tokens only (`bg-background`, `text-verdict-clear`) — never raw values.
- **Imports:** `@/*` alias; `import type` for types (`verbatimModuleSyntax`).
- **Errors:** return `Result<T, E>` for expected failures; throw only for bugs.
- **Data:** reads in Server Components via a feature service/repository; writes
  via `"use server"` actions that authenticate → validate (Zod) → revalidate.
- **Feature barrels** (`features/*/index.ts`) export client-safe surface only;
  server-only modules are imported by path.
- **Config as data:** navigation, scoring, pricing live as typed constants in
  `config/` or a feature's `constants.ts`, not hardcoded in JSX.

---

## Quick map

```
app/         routing only (route groups: (marketing) (auth) (app))
components/  ui · motion · three · shared · layout · marketing · providers
features/    vertical slices (vehicle-intelligence, auth)
lib/         supabase · motion · gsap · utils
config/      env · site · navigation      styles/  globals.css (tokens)
```

Design rationale and layering rules: **`docs/ARCHITECTURE.md`**.
