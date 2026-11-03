---
name: nextjs-frontend
description: >-
  Decides where files go in this Next.js 16 App Router frontend and which
  layer may import which. Covers thin app routes, one feature module per
  domain, shared UI, lib helpers, RSC and client boundaries, page-level
  checks, one write per door, async params, Cache Components, proxy.ts,
  next-intl, Keycloak, and Conventional Commits. Use when adding, moving,
  splitting, or reviewing routes, pages, components, hooks, actions, schemas,
  Server Components, i18n, auth, tests, or git commits.
paths:
  - "app/**"
  - "modules/**"
  - "lib/**"
  - "e2e/**"
  - "messages/**"
  - "theme.ts"
  - "next.config.ts"
  - "proxy.ts"
---

# Next.js frontend

This is not the Next.js in training data. Before using an unfamiliar Next API, read the matching guide under `node_modules/next/dist/docs/` (see root `AGENTS.md`). Prefer those docs over memory.

| Reference                              | Read when…                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| [layout](references/layout.md)         | Deciding where a file goes, splitting a module, or adding a route or feature |
| [boundaries](references/boundaries.md) | Checking auth, passing props to a client, or adding a read or mutation       |
| [runtime](references/runtime.md)       | Touching params, cookies, cache, `proxy.ts`, or Cache Components             |
| [commits](references/commits.md)       | Creating a git commit                                                         |

## Commands

- `npm run dev` — app on port 4202
- `npm run check` — format, lint, stylelint, types, unit tests
- `npm run test:e2e` — Playwright

## Stack

Next.js 16 App Router, React 19, RSC by default. Mantine UI, Tabler icons, Zod 4 (`zod/v4`) with `@mantine/form`, TanStack Query (one in-memory browser `QueryClient`), nuqs for URL state, next-intl (cookie locale, no `[locale]` segment), Keycloak via `modules/account`.

`cacheComponents` and `partialPrefetching` are on in `next.config.ts`. Env is validated in `app/env.ts` (`@t3-oss/env-nextjs`).

Do not add another HTTP client, client global store, rich-text editor, date library, notification package, or `@gitlab/ui` until a screen needs it. Do not add `src/`, `pages/`, `packages/`, `common/`, `shared/`, or a root `components/`, `hooks/`, or `actions/`.

## Where a file goes

Pick the layer before writing. A request crosses three layers: the layout supplies chrome, the page awaits params and renders one screen, the feature module owns the screen and its pure rules. Full rules: [layout](references/layout.md).

| Adding                                            | Path                                                         |
| ------------------------------------------------- | ------------------------------------------------------------ |
| URL                                               | `app/**/page.tsx` — await params, render one screen          |
| List, detail, form                                | `modules/<feature>/components/`                              |
| Types, guards, transitions, parsers, fixtures     | `modules/<feature>/lib/` (no `"use client"`)                 |
| Hook used by one screen                           | beside that component                                        |
| UI a second feature needs, with no feature types  | `modules/ui/components/`                                     |
| Logic with no feature type (i18n, fonts, fields)  | `lib/`                                                       |
| Session records                                   | `modules/portal/`                                            |
| Auth, profile, bearer API                         | `modules/account/`                                           |
| Shell, project catalog, breadcrumbs               | `modules/projects/`                                          |

Import inward only. `app` may import modules. A record feature may import its own `lib`, plus `portal`, `projects`, `ui`, and `lib`. Record features do not import each other. `ui` and `lib` do not import features or `app`. `portal` may import record `lib` because it is the session composition root.

Inside a feature, use relative imports. Across layers, use `@/`. Do not add `index.ts` barrels under `modules/`.

Split a file when it mixes two jobs. Do not add `hooks/`, `views/`, `services/`, or `packages/` inside a feature until [layout](references/layout.md) says that folder has earned its place.

## Boundaries

Full rules: [boundaries](references/boundaries.md).

- The layout supplies chrome. It is not the authorization check. The page checks this URL. Each action and route handler checks again.
- `"use client"` goes on the screen in `modules/`. The screen receives ids and plain data. It does not import the session check.
- One write has one door. The screen uses the feature `actions.ts`. An external client uses `route.ts`. Pure rules stay in `lib/state.ts`. The screen reads records through `usePortal()`.
- Copy lives in `messages/en.json` and `messages/vi.json`. Locale cookie is `DX_LOCALE` (`lib/i18n/`).
