# Routes and features

`page.tsx` and `layout.tsx` stay Server Components. Put `"use client"` on the interactive module under `modules/`. Put `"use server"` as the first statement of that feature's `actions.ts`.

Use a route group only to share one `layout.tsx` or `loading.tsx`. Do not add a second root layout. Do not let two groups resolve to the same URL.

Name feature files in kebab-case and export components in PascalCase. Dynamic segments are `[id]`, `[...slug]`, or `[[...slug]]`. Import with the `@/` alias.

Do not use these names except for their Next.js role: `layout`, `template`, `page`, `loading`, `error`, `global-error`, `not-found`, `forbidden`, `unauthorized`, `route`, `default`, `icon`, `apple-icon`, `opengraph-image`, `twitter-image`, `sitemap`, `robots`, `manifest`. Use a parallel or intercepting route only for a real slot or modal.

```text
modules/<feature>/
  components/
  actions.ts
  lib/load.ts
  lib/schema.ts
  lib/search-params.ts
  lib/fixtures.ts
```

| Kind | Path |
| --- | --- |
| Screen UI | `components/` |
| Load | `lib/load.ts`, via `fetch` or a fixture |
| Mutation | `actions.ts`. Confirmed, pending, and unknown stay distinct results |
| Schema | `lib/schema.ts` |
| URL state | `lib/search-params.ts` |
| Fixture | `lib/fixtures.ts` |
| Unit test | `name.test.ts` beside the module |
| Story | `components/*.stories.tsx` |
| Theme | `theme.ts` at the frontend root. Icons come from `@tabler/icons-react` |
| Render harness | `test-utils/` |
| Session fixture | `modules/account/lib/session.ts`. This is not an auth package |

Browser tests stay in `e2e/*.spec.ts`. One journey per spec.

Collection query and sort live in that feature's `lib/search-params.ts` and in the URL. Set nuqs `shallow: false` when a change must rerender the Server Component. Scroll and focus restoration stay in that feature and clear when permission is lost. Form drafts stay in the form until submit.

Zod schemas accept nonblank plain text. Do not invent length limits, priority, or file fields. Copy stays in the component. An in-app notice sits next to the action that produced it.

There is no `common/`, `shared/`, or root `components/` folder. Mantine is the UI kit.

| Scope | Folder |
| --- | --- |
| One feature | `modules/<feature>/` |
| Shared UI | `modules/ui/components/` |
| Cross-cutting logic | `lib/` |

Shell navigation lives in the feature that owns that shell. A shared collection toolbar receives each feature's parsers. Create a shared file when the second caller appears.

Secrets are never `NEXT_PUBLIC_`. Add environment variables only in `app/env.ts`. `app/providers.tsx` owns the one QueryClient. Do not persist it. Permission loss clears that cache, including titles and counts.

Create these shared files when a second caller needs them:

| File | Role |
| --- | --- |
| `modules/ui/components/access-denied.tsx` | Denied destination, with no hidden title, count, or metadata |
| `modules/ui/components/in-app-notice.tsx` | Confirmed, pending, and unknown outcomes |
| `modules/ui/components/collection-toolbar.tsx` | Query and sort. It receives each feature's parsers |
| `lib/plain-text.ts` | Nonblank plain-text check |
| `lib/action-result.ts` | The three outcome states |
| `lib/clear-restricted-cache.ts` | Drops restricted titles and counts after permission loss |

```tsx
// app/(workspace)/projects/[projectId]/support/page.tsx
// imports modules/support/components/support-form.tsx
```
