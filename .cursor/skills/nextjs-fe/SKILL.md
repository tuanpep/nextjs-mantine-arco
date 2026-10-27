---
name: nextjs-fe
description: >-
  Places Next.js 16 App Router code in app routes, modules features, and lib
  helpers; keeps RSC/client boundaries, async params, next-intl, Keycloak, and
  Conventional Commits. Use when creating or editing routes, features,
  components, schemas, i18n, auth, tests, proxy, or git commits in this frontend.
paths:
  - "app/**"
  - "modules/**"
  - "lib/**"
  - "e2e/**"
  - "messages/**"
  - "theme.ts"
  - "next.config.ts"
  - "proxy.ts"
compatibility: Requires Next.js 16 App Router in this repo; npm scripts.
---

# Next.js frontend

This is not the Next.js in training data. Before using an unfamiliar Next API, read the matching guide under `node_modules/next/dist/docs/` (see root `AGENTS.md`). Prefer those docs over memory.

| Reference                        | Read when…                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------- |
| [layout](references/layout.md)   | Adding, moving, or naming files under `app/`, `modules/`, or `lib/`              |
| [runtime](references/runtime.md) | Touching params, cookies, cache, `proxy.ts`, Server Actions, or Cache Components |
| [commits](references/commits.md) | Creating a git commit                                                            |

## Commands

- `npm run dev` — app on port 4202
- `npm run check` — format, lint, stylelint, types, unit tests
- `npm run test:e2e` — Playwright

## Stack

Next.js 16 App Router, React 19, RSC by default. Mantine UI, Tabler icons, Zod 4 (`zod/v4`) with `@mantine/form`, TanStack Query (one in-memory browser `QueryClient`), nuqs for URL state, next-intl (cookie locale, no `[locale]` segment), Keycloak via `modules/account`.

`cacheComponents` and `partialPrefetching` are on in `next.config.ts`. Env is validated in `app/env.ts` (`@t3-oss/env-nextjs`).

Do not add another HTTP client, client global store, rich-text editor, date library, notification package, or `@gitlab/ui` until a screen needs it. Do not add `src/app`, `pages/`, or `packages/`.

## Layout

`app/` = routes and layouts only. Feature code = `modules/<feature>/`. Shared UI used by a second feature = `modules/ui/components/`. Cross-cutting logic = `lib/`.

A folder under `app/` is a URL segment only when it has `page.tsx` or `route.ts`. Pages stay thin and import screens from `modules/`. Route group `(name)` shares layout and is omitted from the URL. Keep one root layout.

Request interception is `proxy.ts` beside `app/` (Node runtime). Do not create `middleware.ts`.

## Data and UI boundaries

- Pages/layouts: Server Components; `await params` / `await searchParams`.
- Interactive UI: `"use client"` in `modules/`, not on the page.
- Mutations: Server Actions (`"use server"` first line). Prefer a feature `actions.ts` when adding mutations.
- Authenticated browser API calls: `modules/account/lib/api-client.ts` (`apiFetch`), not a new client.
- Copy: `messages/en.json` + `messages/vi.json` via next-intl. Locale cookie is `DX_LOCALE` (`lib/i18n/`).
