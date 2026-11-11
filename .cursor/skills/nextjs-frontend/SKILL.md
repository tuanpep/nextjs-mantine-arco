---
name: nextjs-frontend
description: >-
  Decides where files go in this Next.js 16 App Router frontend and which
  layer may import which. Covers thin app routes, one feature module per
  domain, shared UI, lib helpers, RSC and client boundaries, page-level
  checks, one write per door, async params, Cache Components, proxy.ts,
  next-intl, Keycloak, and Conventional Commits. Use when adding, moving,
  splitting, or reviewing routes, pages, components, hooks, actions, schemas,
  Server Components, i18n, auth, tests, git commits, monorepo layout, or
  whether to add packages/ or apps/.
paths:
  - "app/**"
  - "modules/**"
  - "lib/**"
  - "components/**"
  - "e2e/**"
  - "messages/**"
  - "vitest.config.ts"
  - "playwright.config.ts"
  - "theme.ts"
  - "next.config.ts"
  - "proxy.ts"
---

# Next.js frontend

This is not the Next.js in training data. Before using an unfamiliar Next API, start at `node_modules/next/dist/docs/index.md` (see root `AGENTS.md`). Prefer those docs over memory.

| Reference                              | Read when…                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| [layout](references/layout.md)         | Deciding where a file goes, splitting a module, or adding a route or feature |
| [boundaries](references/boundaries.md) | Checking auth, passing props to a client, or adding a read or mutation       |
| [runtime](references/runtime.md)       | Touching params, cookies, cache, `proxy.ts`, or Cache Components             |
| [i18n](references/i18n.md)             | Adding or changing user-visible copy or locale behavior                      |
| [testing](references/testing.md)       | Unit tests, Playwright, or CI test gates                                     |
| [ecosystem](references/ecosystem.md)   | Comparing to Cal.com / next-forge / commerce, or scaling past one Next app   |
| [commits](references/commits.md)       | Creating a git commit                                                        |

**Related:** [gitlab-pajamas](../gitlab-pajamas/SKILL.md) for shell, sidebar, tabs, drawers, and Pajamas layout review.

## Commands

- `npm run dev` — http://localhost:4202 (Keycloak redirect URIs use this port)
- `npm run check` — format, lint, stylelint, types, unit tests
- `npm run test:e2e` — Playwright

## Stack

Next.js 16 App Router, React 19, RSC by default. Mantine UI, Tabler icons, Zod 4 (`zod/v4`) with `@mantine/form`, TanStack Query via `lib/query/get-query-client.ts` (one in-memory browser `QueryClient` in `app/providers.tsx`), nuqs for URL state, next-intl (cookie locale, no `[locale]` segment), Keycloak via `modules/account`.

`cacheComponents` and `partialPrefetching` are on in `next.config.ts`. Env is validated in `app/env.ts` (`@t3-oss/env-nextjs`).

Do not add another HTTP client, client global store, rich-text editor, date library, notification package, or `@gitlab/ui` until a screen needs it. Do not add `src/`, `pages/`, `packages/`, `common/`, `shared/`, or new root `components/`, `hooks/`, or `actions/`. Legacy `components/` is documented in [layout](references/layout.md). This repo is a **single-app** layout (`modules/` ≈ Cal.com `packages/features`); do not introduce `apps/*` without reading [ecosystem](references/ecosystem.md).

## New record feature (checklist)

1. `modules/<feature>/` — list, detail, form, `lib/state.ts`, parsers, fixtures ([layout](references/layout.md)).
2. Register types and portal create/transition methods in `modules/portal/`.
3. Thin `app/(workspace)/.../page.tsx` routes with Suspense + the right skeleton.
4. Copy in both `messages/*.json` namespaces ([i18n](references/i18n.md)).
5. `npm run check`; if shell or nav changed, read [gitlab-pajamas](../gitlab-pajamas/SKILL.md).

## Where a file goes

Pick the layer before writing. A request crosses three layers: the layout supplies chrome, the page awaits params and renders one screen, the feature module owns the screen and its pure rules. Full rules: [layout](references/layout.md).

| Adding                                           | Path                                                |
| ------------------------------------------------ | --------------------------------------------------- |
| URL                                              | `app/**/page.tsx` — await params, render one screen |
| List, detail, form                               | `modules/<feature>/components/`                     |
| Types, guards, transitions, parsers, fixtures    | `modules/<feature>/lib/` (no `"use client"`)        |
| Hook used by one screen                          | beside that component                               |
| UI a second feature needs, with no feature types | `modules/ui/components/`                            |
| Logic with no feature type (i18n, fonts, fields) | `lib/`                                              |
| Session records                                  | `modules/portal/`                                   |
| Auth, profile, bearer API                        | `modules/account/`                                  |
| Shell, project catalog, breadcrumbs              | `modules/projects/`                                 |

Import inward only. `app` may import modules. A record feature may import its own `lib`, plus `portal`, `projects`, `ui`, and `lib`. Record features do not import each other. `ui` and `lib` do not import features or `app`. `portal` may import record `lib` because it is the session composition root.

Inside a feature, use relative imports. Across layers, use `@/`. Do not add `index.ts` barrels under `modules/`.

Split a file when it mixes two jobs. Do not add `hooks/`, `views/`, `services/`, or `packages/` inside a feature until [layout](references/layout.md) says that folder has earned its place.

## Boundaries

Full rules: [boundaries](references/boundaries.md).

- The layout supplies chrome. It is not the authorization check. The page checks this URL. Each action and route handler checks again.
- `"use client"` goes on the screen in `modules/`. The screen receives ids and plain data. It does not import the session check.
- Today most writes go through `usePortal()` (in-memory session). When a mutation does server I/O, one door per write: feature `actions.ts` or `route.ts`, not both. Pure rules stay in `lib/state.ts`.
- Copy lives in `messages/en.json` and `messages/vi.json`. Locale cookie is `DX_LOCALE` (`lib/i18n/`). Details: [i18n](references/i18n.md).
