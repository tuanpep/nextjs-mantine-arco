<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Next.js frontend template

These instructions apply to every coding agent. Tool-specific rule files do not replace this document. Leave the Next.js block above intact.

## Stack

Next.js App Router and React Server Components. Mantine for UI, Tabler for icons, Zod 4 (`zod/v4`) with `@mantine/form`, TanStack Query for the in-memory browser cache, and nuqs for URL state. HTTP from Server Components uses `fetch`. Server Actions mutate data. Do not add another HTTP client, a client store, an i18n library, a rich-text editor, a date library, or a notification package until a screen needs it.

## Layout

`app/` is only routes and layouts. Feature code lives outside it. This matches the Next.js option to store project files outside `app`, and the layout used by large App Router codebases.

```text
app/
  layout.tsx                         # single <html> and <body>
  providers.tsx                      # one QueryClient and NuqsAdapter
  env.ts                             # only env schema
  (shell)/feature/page.tsx           # route group omitted from the URL
modules/<feature>/
  components/
  actions.ts
  lib/load.ts
  lib/schema.ts
  lib/search-params.ts
  lib/fixtures.ts
modules/ui/components/               # UI used by a second feature
lib/                                 # logic used by a second feature, no screen
theme.ts
e2e/
test-utils/
```

A folder under `app/` becomes a URL segment only when it contains `page.tsx` or `route.ts`. A `page.tsx` or `layout.tsx` imports its screen from `modules/`. Do not put feature components, actions, or schemas in `app/`.

Use a route group `(name)` to share one `layout.tsx` or `loading.tsx` without changing the URL. Do not add a second root layout. Do not let two groups resolve to the same URL.

Keep `page.tsx` and `layout.tsx` as Server Components. Put `"use client"` on the interactive module under `modules/`. Put `"use server"` as the first statement of `modules/<feature>/actions.ts`.

Name feature files in kebab-case and export components in PascalCase. Dynamic segments are `[id]`, `[...slug]`, or `[[...slug]]`. Import with the `@/` alias. A route group is a real folder and is omitted from the URL.

Do not add `src/app`, `pages/`, or a `packages/` split. Do not create `middleware.ts`. Request interception is `proxy.ts` beside `app/`. Do not use these names except for their Next.js role: `layout`, `template`, `page`, `loading`, `error`, `global-error`, `not-found`, `forbidden`, `unauthorized`, `route`, `default`, `icon`, `apple-icon`, `opengraph-image`, `twitter-image`, `sitemap`, `robots`, `manifest`. Use a parallel or intercepting route only for a real slot or modal.

## Modules

| Kind | Path |
| --- | --- |
| Screen UI | `modules/<feature>/components/` |
| Load | `modules/<feature>/lib/load.ts` |
| Mutation | `modules/<feature>/actions.ts` |
| Schema | `modules/<feature>/lib/schema.ts` |
| URL state | `modules/<feature>/lib/search-params.ts` |
| Fixture | `modules/<feature>/lib/fixtures.ts` |
| Env | `app/env.ts` |
| Theme | `theme.ts` |
| Browser cache | `app/providers.tsx` |
| Unit test | `name.test.ts` beside the module |
| Browser test | `e2e/*.spec.ts` |
| Story | `modules/<feature>/components/*.stories.tsx` |

Collection query and sort live in that feature's `lib/search-params.ts` and in the URL. Set nuqs `shallow: false` when a change must rerender the Server Component. Scroll and focus restoration stay in that feature. Form drafts stay in the form until submit. The QueryClient is not persisted.

Zod schemas accept nonblank plain text. Do not invent length limits, priority, or file fields. Copy stays in the component. An in-app notice sits next to the action that produced it.

```ts
// app/(workspace)/projects/[projectId]/support/page.tsx imports the screen.
// modules/support/components/support-form.tsx owns the form.
```

## Shared code

There is no `common/`, `shared/`, or root `components/` folder. Mantine is the UI kit.

| Scope | Folder |
| --- | --- |
| One feature | `modules/<feature>/components` and `modules/<feature>/lib` |
| Shared UI | `modules/ui/components` |
| Cross-cutting logic | `lib/` |

Shell navigation lives in the feature that owns that shell. Layouts import it. A shared collection toolbar receives each feature's parsers. It does not hard-code one route's query. Create a shared file when the second caller appears.

Secrets are never `NEXT_PUBLIC_`. Add environment variables only in `app/env.ts`.
