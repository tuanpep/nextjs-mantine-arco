# Baseline (facts)

**Update when the repo tree changes.**

**Active stage:** `Starter` — workspace paths and record modules are not on disk yet.

**Flip to `Workspace`** in the same PR that adds `app/(workspace)/` and at least one of `modules/portal/`, `modules/projects/`, `modules/account/`, or a `modules/<record>/` feature.

## Present now

`app/` (layout, page, providers, env) · `lib/i18n`, `lib/query` · `modules/ui/components/<group>/`, `modules/ui/component-book/`, `modules/ui/theme/` · `messages` (`App`, `ComponentBook`) · `test-utils/render.tsx` · root `__tests__/` for lib-only units · port **4202** · `cacheComponents` + `partialPrefetching`

## Absent until needed

| Path                | When                          |
| ------------------- | ----------------------------- |
| `app/(workspace)/`  | Signed-in shell               |
| `modules/account/`  | Auth, `apiFetch`              |
| `modules/portal/`   | `usePortal()` records         |
| `modules/projects/` | Catalog, breadcrumbs          |
| `modules/<record>/` | Record routes                 |
| `proxy.ts`          | Redirects/headers last resort |

Normative rules: [placement](placement.md) even if folder missing.

## Write path

| Stage              | Record writes                                       |
| ------------------ | --------------------------------------------------- |
| Starter            | `lib/i18n/actions.ts` only                          |
| Workspace + portal | Portal methods; `actions.ts` when persisting to API |

## Scaffold order (workspace)

`(workspace)` layout → `account`? → `projects`? → `portal`? → first record + routes → `en`/`vi` namespaces.

## Maintain

Same PR as new `portal/` or `(workspace)/`: update **Active stage** above. Bump Next: bundled upgrade doc + `npm run check` + e2e. New dependency: must not violate [SKILL.md](../SKILL.md) bans. Which ref to edit: [maintain](maintain.md). Portal/auth contracts: [portal](portal.md), [account](account.md).
