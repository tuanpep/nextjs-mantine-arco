---
name: nextjs-fe
description: Places Next.js App Router code in app routes, modules features, and lib helpers, and writes Conventional Commits. Use when creating or editing routes, features, components, schemas, tests, or git commits in the Next.js frontend.
---

# Next.js frontend

Read [references/layout.md](references/layout.md) before adding or moving files.
Read [references/commits.md](references/commits.md) only when creating a commit.

## Commands

- `npm run dev` starts the app.
- `npm run check` runs format, lint, stylelint, types, and unit tests.
- `npm run test:e2e` runs Playwright.

## Stack

Next.js App Router and React Server Components. Mantine for UI, Tabler for icons, Zod 4 (`zod/v4`) with `@mantine/form`, TanStack Query for one in-memory browser cache, and nuqs for URL state. Server Components read with `fetch`. Server Actions mutate. Do not add another HTTP client, a client store, an i18n library, a rich-text editor, a date library, or a notification package until a screen needs it.

## Layout

`app/` is routes and layouts. Feature code lives in `modules/<feature>/`. UI used by a second feature lives in `modules/ui/components/`. Logic used by a second feature lives in `lib/`.

A folder under `app/` is a URL segment only when it contains `page.tsx` or `route.ts`. Pages import screens from `modules/`. A route group `(name)` shares one layout and is omitted from the URL. Keep one root layout.

Do not add `src/app`, `pages/`, or `packages/`. Do not create `middleware.ts`. Request interception is `proxy.ts` beside `app/`.
