# How this repo compares to large Next.js frontends

External references (read for ideas, not copy-paste):

| Repo             | Layout                                                                 | Link                                                                                    |
| ---------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Cal.com          | Turborepo: thin `apps/web` + `packages/features/*`, `@calcom/ui`, tRPC | [calcom/cal.com](https://github.com/calcom/cal.com)                                     |
| next-forge       | Multiple Next apps + `packages/*`, route groups `(authenticated)`      | [vercel/next-forge](https://github.com/vercel/next-forge)                               |
| Vercel Commerce  | Single app: `app/` + `components/` + `lib/<provider>/`                 | [vercel/commerce](https://github.com/vercel/commerce)                                   |
| PostHog products | Vertical slice per product (`frontend/` + `backend/`)                  | [products/README.md](https://github.com/PostHog/posthog/blob/master/products/README.md) |
| Nx guidance      | `apps/` + `libs/` grouped by domain                                    | [Nx folder structure](https://nx.dev/docs/kb/folder-structure)                          |

## Mapping: their folders → ours

| Common pattern at scale                  | This repository                                   | Notes                                                                  |
| ---------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| `apps/web/app/` thin routes              | `app/(workspace)/**/page.tsx`                     | Same job: URL + Suspense + one screen                                  |
| `(authenticated)` / `(app)` route groups | `(workspace)`                                     | Add another group only for a second shell (signed-out without sidebar) |
| `packages/features/<domain>`             | `modules/<feature>/`                              | Domain slice; we keep it in-repo, not a workspace package              |
| `packages/ui` / `components/`            | `modules/ui/components/`                          | Shared UI without feature types in props                               |
| `packages/lib`, `lib/` utils             | `lib/`                                            | Feature-agnostic only                                                  |
| Auth + `apiFetch` package                | `modules/account/`                                | Single HTTP client                                                     |
| tRPC / BFF in `packages/trpc`            | Feature `actions.ts` + `route.ts` when I/O exists | Prefer actions for the UI; routes for external clients                 |
| Prisma / DB package                      | Backend API via `NEXT_PUBLIC_API_PREFIX`          | FE does not own schema                                                 |
| `apps/web/proxy.ts`                      | Root `proxy.ts` when needed                       | Optional; last resort for redirects/headers                            |
| `env` package                            | `app/env.ts`                                      | All new env vars here                                                  |
| Monorepo `tooling/eslint-config`         | Root ESLint / Prettier / stylelint                | Fine at single-app scale                                               |

## What we already match

- **Thin App Router** — pages do not own lists, forms, or domain arrays ([layout](layout.md)).
- **Domain modules** — one folder per record type, same spirit as Cal.com `packages/features` without Turbo wiring.
- **Composition root** — `modules/portal/` aggregates record state (similar to a client session store + seed); Cal.com pushes that to server packages instead.
- **Shared design system in-repo** — `modules/ui/` + Mantine theme, like `@calcom/ui` but not published.
- **Cookie i18n, no `[locale]`** — unlike many templates that use middleware locale prefixes ([runtime](runtime.md), [i18n](i18n.md)).

## What we deliberately avoid (until a trigger fires)

| Do not add yet                        | Why large repos have it                        | Trigger to reconsider                                                    |
| ------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| `apps/*` + `packages/*` monorepo      | Second deployable (marketing, admin, API-only) | A second Next.js app must ship from the same repo                        |
| `packages/features` as npm workspaces | 70+ domains, multiple consumers                | Same domain code imported by two deployables                             |
| Root `components/` + `hooks/`         | Colocated marketing + app                      | Never for new code; migrate [legacy `components/`](layout.md)            |
| `pages/` router                       | Legacy Cal.com still has `apps/web/pages/`     | Do not start new Pages Router routes                                     |
| `src/` wrapper                        | Team preference / older templates              | Only if tooling mandate; not needed today                                |
| tRPC package                          | End-to-end types for huge API surface          | Stable internal API with many procedures and one web app                 |
| Feature `types/` or `dto/` folders    | DTO sprawl                                     | Type used by two features → move to `lib/` ([boundaries](boundaries.md)) |

Default stance: **stay a single Next app with `modules/`**. Monorepo cost (Turborepo, `workspace:*`, cross-package CI) pays off when deployables or consumers multiply, not when feature count grows inside one product.

## Adoption rules (borrow ideas safely)

1. **Match the layer, not the folder name** — Cal.com’s `packages/features/bookings` ≈ our `modules/bug-reports/`.
2. **Do not duplicate UI homes** — large apps use one of `components/`, `packages/ui`, or `modules/ui/`; we use **`modules/ui/`** only for new shared UI.
3. **Keep imports inward** — same as PostHog product isolation: record features do not import each other; `portal` is the only cross-feature composition ([layout](layout.md)).
4. **One write per door** — same as thin API handlers in Cal.com/next-forge: action **or** route, not both ([boundaries](boundaries.md)).
5. **Read external AGENTS/docs before unfamiliar Next APIs** — large repos ship `AGENTS.md` / bundled `node_modules/next/dist/docs/`; we use root `AGENTS.md` + [runtime](runtime.md).

## Evolution path (if the product outgrows single-app)

Do these in order; stop when the pain is gone.

```text
1. Split oversized feature lib/ files (layout.md “When a feature grows”)
2. Extract types shared by two features → lib/
3. Extract shared UI with feature-typed props → back into feature or generic props in modules/ui/
4. Add root proxy.ts only when redirect/header logic is real
5. Add feature actions.ts + apiFetch for live API (replace portal-only writes per domain)
6. If portal seed/imports become unmanageable → shrink portal to persistence wiring; keep domain rules in modules/<feature>/lib/
7. Only then: Turborepo apps/web + packages/<domain> (copy module → package, keep public imports stable)
```

Step 7 is the Cal.com / next-forge jump. Do not pre-build `packages/` before step 6 hurts.

## Route and auth comparison

| Pattern           | Example                                            | This repo                                                                                  |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Auth route groups | next-forge `(authenticated)` / `(unauthenticated)` | `(workspace)` for signed-in shell; extend with `(marketing)` if needed                     |
| Proxy for session | next-forge, Cal.com `proxy.ts`                     | Optional; not required for Keycloak + page gates today                                     |
| Page is auth gate | Common in SaaS templates                           | Page awaits params, passes ids; layout is not the auth check ([boundaries](boundaries.md)) |

## Further reading

- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Cal.com monorepo RFC](https://github.com/calcom/cal.com/issues/1581)
- [next-forge docs](https://www.next-forge.com/docs)
