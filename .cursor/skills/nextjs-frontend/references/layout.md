# Code organization

A request crosses three layers. The layout supplies chrome. The page awaits params and renders one screen. The feature module owns that screen and the pure rules behind it. `modules/ui/` is presentational chrome. `lib/` is cross-cutting and feature-agnostic.

Add a file when an existing file would mix two jobs. Add a folder only when the table at the end says it has earned its place.

## Layers

| Layer            | Owns                                                                                          | Must not own                                      |
| ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `app/`           | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `providers.tsx`, `env.ts` | Lists, forms, domain types, fetch helpers     |
| `modules/<feature>/components/` | Screens and widgets for that domain                                                | Another feature's types                           |
| `modules/<feature>/lib/` | Types, guards, transitions, nuqs parsers, fixtures                                    | JSX, `"use client"` on pure modules               |
| `modules/ui/components/` | Page chrome, lists, empty states, skeletons used by a second feature                 | Feature types, portal, routing rules              |
| `modules/portal/` | Session store that holds every record collection and the create/transition methods    | Route files, page chrome, one feature's filters   |
| `modules/projects/` | Shell, project catalog (`applications.ts`), breadcrumbs (`recordTrail`)              | A single record type's fields                     |
| `modules/account/` | Keycloak, profile, permissions, `apiFetch`, the one session lookup for actions       | Bug, help, or idea screens                        |
| `lib/`           | i18n, fonts, repeated detail fields (`form-details`)                                          | Anything that imports `modules/` or `app/`        |

Fixed modules:

- **account** — session and the only HTTP client.
- **portal** — in-memory records for this browser session. Features read and write through `usePortal()`. Filter parsers stay in the feature.
- **projects** — workspace shell and the project list. Screens resolve the project with `getApplication` and build breadcrumbs with `recordTrail`.
- **ui** — shared Mantine composition. Lists render `RecordCollection`. Pages use `PageFrame` and `PageHeader`. Suspense fallbacks come from `page-skeletons.tsx` (`CollectionPageSkeleton`, `DetailPageSkeleton`, `FormPageSkeleton`, `OverviewPageSkeleton`, `WorkspaceShellSkeleton`). `RecordCollection` takes plain rows. If a prop needs a feature type, that UI belongs in the feature.
- **Record features** — `bug-reports`, `help`, `feature-requests`, `feedback`, `guides`, `discussions`. One folder per record type.

There is no `common/`, `shared/`, or root `components/`. Do not add `src/app`, `pages/`, `packages/`, or a root `hooks/` or `actions/`.

## Imports

Direction is inward: routes compose features; features compose shared UI and their own `lib`; shared code stands alone.

```text
app  →  any module, lib
record feature  →  own lib, portal, projects, ui, lib
projects  →  account (shell only), portal, ui, own lib
portal  →  record lib (types, fixtures, pure transitions)
ui, lib, account  →  not features, not app
record feature  →  not another record feature
```

`portal` is the composition root. `portal-provider.tsx` and `portal/lib/seed.ts` import each record's `state` and `fixtures`. A portal screen may render one record widget when the flow spans records (`open-request-panel` uses bug upload). That is the only cross-feature widget import. A record screen never imports another record feature, and `ui` never imports a feature.

Inside a feature, import with relative paths (`../lib/state`, `./use-bug-copy`). Across layers, use `@/`. Do not add `index.ts` under `modules/`. `lib/form-details/index.ts` is the only barrel; leave it as the public entry for that folder.

Tests may import another feature's fixtures. Production modules may not. Colocate unit tests as `name.test.ts` or `name.test.tsx` beside the file. Browser journeys stay one spec each in `e2e/`.

## Routes

A folder under `app/` is a URL segment only when it has `page.tsx` or `route.ts`. A route group exists to share chrome. `(workspace)` is that group. Add another group only for a second shell, such as signed-out pages that must not mount the sidebar. Do not add a group per feature, a second root layout, or a group that resolves to the same URL.

The route segment is the URL word (`bugs`, `features`). The module folder is the domain name (`bug-reports`, `feature-requests`). Dynamic segments match the id they pass: `[projectId]`, `[bugId]`.

The layout supplies chrome. It may read the sidebar cookie and mount the shell. It is not the authorization check. See [boundaries](boundaries.md).

The page is the server gate for that URL. It awaits params inside Suspense, picks the skeleton, and renders one screen from `modules/`. It does not own the list, the form, or the record array. Put the screen in `modules/`, not in a `page-client.tsx` beside the route.

```tsx
export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<CollectionPageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
```

Pass ids and any server-known permission into the screen as props. The screen does not re-parse the URL. The project hub calls `notFound()` when `getApplication` misses. Record screens render `ProjectUnavailable` in the client component. Follow the screen you are extending. When an id must 404 or redirect before the client paints, do that in the page.

Request interception is `proxy.ts` beside `app/` (Node runtime). It may redirect from the cookie. It is not the check that protects a record. Do not create `middleware.ts`. See [boundaries](boundaries.md).

Do not use `layout`, `template`, `page`, `loading`, `error`, `global-error`, `not-found`, `forbidden`, `unauthorized`, `route`, `default`, `icon`, `apple-icon`, `opengraph-image`, `twitter-image`, `sitemap`, `robots`, or `manifest` except for their Next.js role. Add a parallel or intercepting route only for a real slot or modal; a parallel slot needs a sibling `default.tsx`.

## Record feature

Match the existing shape. Add a file from this list only when that job exists.

```text
modules/<feature>/
  components/
    <noun>-list.tsx       # filters, then RecordCollection
    <noun>-detail.tsx
    <noun>-form.tsx
    use-<noun>-copy.ts    # only when one screen needs many labels
  lib/
    state.ts              # types, guards, create/transition functions
    fixtures.ts
    search-params.ts      # nuqs parsers for that list
  actions.ts              # only once a mutation does I/O
```

`state.ts` stays free of React and I/O. `createX` returns the record or `null`. Portal calls those functions; the component calls `usePortal()`. Extra `lib` files (`intake.ts`, `attachments.ts`) are for a second job, not for length. Keep each pure helper in `state.ts` until it has a second job. One function per file is for I/O operations, not for guards.

A list keeps its parsers in `lib/search-params.ts`, reads them with `useQueryStates`, narrows rows with `forProject` and `includesQuery` from `modules/portal/lib/search`, and passes plain rows into `RecordCollection`. Extend `RecordCollection` when a second list needs the same control. Do not copy a list layout into the feature.

Forms keep the draft in the form until submit, then call the portal create method. Repeated detail fields use `lib/form-details`. User-visible strings go in both message files under that feature's namespace (`Bugs`, `Help`, `Features`, `Feedback`, `Guides`, `Discussions`). Shell copy uses `Workspace`. Shared list chrome uses `Portal`.

## When a feature grows

| Situation | Do this |
| --- | --- |
| `lib/` file mixes a second job (intake rules, attachments) | New file in that feature's `lib/`. Same folder. |
| A hook has one caller | Keep it beside that component (`use-bug-copy.ts`). |
| A second file in the feature uses the hook | Move it to the feature `lib/` (`use-profile.ts`). Still no `hooks/` folder. |
| One URL must render two screens (a list and a calendar) | `views/` for those route screens. Pieces stay in `components/`. |
| A widget's parts make the parent file hard to scan | One nested folder under `components/` (`book-upload/` once it has siblings). |
| A function starts calling the network or the database | Pure rules stay in `state.ts`. That operation goes in `actions.ts`. A second operation gets its own file next to it. |
| Several actions need the session | One helper in `modules/account`. Each action calls it. |
| Shared UI grows a prop that takes a feature type | Move that UI back into the feature. |
| A second app must use the domain without React | Only then a package. Do not add `packages/` before that. |

Do not add `hooks/`, `views/`, `services/`, `repositories/`, or `store/` to match a larger codebase. List, detail, and form are three routes, so they stay flat `components/`.

## Naming

Files and folders are kebab-case. The component export is PascalCase and matches the file (`bug-list.tsx` exports `BugList`). One exported component per file. Functions are camelCase.

Styles stay on Mantine props. The shared stylesheet is root `pajamas.module.css`, imported by the root layout. Add a CSS module only when a concrete interaction cannot be done with Mantine.

New env vars go in `app/env.ts` only. Secrets never use `NEXT_PUBLIC_`. `app/providers.tsx` owns the one QueryClient; do not persist it or create another.
