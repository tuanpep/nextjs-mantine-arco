# Routes and features

`page.tsx` and `layout.tsx` stay Server Components. Put `"use client"` on the interactive module under `modules/`. Put `"use server"` as the first statement of a feature `actions.ts` when adding mutations.

Use a route group only to share one `layout.tsx` or `loading.tsx`. Do not add a second root layout. Do not let two groups resolve to the same URL. Prefer shallow groups; deep nested groups make layout inheritance hard to reason about ([Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)).

Name feature files in kebab-case and export components in PascalCase. Dynamic segments are `[id]`, `[...slug]`, or `[[...slug]]`. Import with the `@/` alias.

Do not use these names except for their Next.js role: `layout`, `template`, `page`, `loading`, `error`, `global-error`, `not-found`, `forbidden`, `unauthorized`, `route`, `default`, `icon`, `apple-icon`, `opengraph-image`, `twitter-image`, `sitemap`, `robots`, `manifest`. Use a parallel or intercepting route only for a real slot or modal; parallel slots need a sibling `default.tsx` in Next.js 16.

```text
modules/<feature>/
  components/
  actions.ts          # when the feature mutates
  lib/
    fixtures.ts       # demo / local data
    search-params.ts  # nuqs parsers for collections
    *.ts              # feature helpers (intake, priority, state, …)
```

| Kind                | Path                                                                             |
| ------------------- | -------------------------------------------------------------------------------- |
| Screen UI           | `modules/<feature>/components/`                                                  |
| Load / demo data    | feature `lib/` (`fixtures.ts`, loaders)                                          |
| Authenticated API   | `modules/account/lib/api-client.ts`                                              |
| Mutation            | feature `actions.ts` when introduced                                             |
| Schema              | feature `lib/schema.ts` when validating                                          |
| URL state           | feature `lib/search-params.ts`                                                   |
| Unit test           | `name.test.ts` beside the module                                                 |
| Theme               | `theme.ts` at repo root; icons from `@tabler/icons-react`                        |
| Render harness      | `test-utils/`                                                                    |
| Session / auth      | `modules/account/` (Keycloak, profile, permissions). Not a separate auth package |
| i18n                | `lib/i18n/` + `messages/{en,vi}.json`                                            |
| Shared form readout | `lib/form-details/`                                                              |
| Fonts               | `lib/fonts.ts`                                                                   |

Browser tests stay in `e2e/*.spec.ts`. One journey per spec.

## Scope rules

There is no `common/`, `shared/`, or root `components/` folder. Mantine is the UI kit. Shared code earns its place when a second caller needs it ([feature colocation](https://hultman.dev/blog/how-to-build-a-scalable-react-app-with-next-js-and-typescript)).

| Scope               | Folder                   |
| ------------------- | ------------------------ |
| One feature         | `modules/<feature>/`     |
| Shared UI           | `modules/ui/components/` |
| Cross-cutting logic | `lib/`                   |

Existing shared UI: `page-frame.tsx`, `page-header.tsx`. Shell navigation lives in `modules/projects/components/workspace-shell.tsx`. A shared collection toolbar receives each feature's parsers — create it when the second caller appears.

## Forms, URL state, copy

Collection query and sort live in that feature's `lib/search-params.ts` and in the URL. Set nuqs `shallow: false` when a change must rerender the Server Component. Scroll and focus restoration stay in that feature and clear when permission is lost. Form drafts stay in the form until submit.

Zod schemas accept nonblank plain text unless the product defines stricter rules. Prefer `lib/form-details` for repeated details fields/readouts. User-visible strings go through next-intl messages, not hard-coded English in new UI. An in-app notice sits next to the action that produced it.

## Env and providers

Secrets never use `NEXT_PUBLIC_`. Browser-required config (Keycloak URL/realm/client, API prefix) is validated in `app/env.ts` and may be `NEXT_PUBLIC_*`. Add new variables only there.

`app/providers.tsx` owns the one QueryClient (module singleton for the browser). Do not persist it. Permission loss clears restricted cache (titles, counts, identity). Auth wraps the tree via `AuthProvider`.

```tsx
// app/(workspace)/projects/[projectId]/support/page.tsx
// awaits params, then imports modules/support/components/…
```
