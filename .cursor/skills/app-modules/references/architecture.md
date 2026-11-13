# Architecture (depth + anti-patterns)

Normative rules: [placement](placement.md). This ref explains **why** and gives measurable budgets.

## Two axes

| Axis | Healthy |
| ---- | ------- |
| **Folder depth** under `modules/` | ~3–4 path segments to a file (`modules/bugs/components/bug-list.tsx`) |
| **Coupling depth** | Page → one screen → `lib` / `actions`; no record ↔ record imports |

`app/` may be deeper because URLs mirror folders — keep `page.tsx` thin ([layout](layout.md)).

## Depth budget

```text
OK
  modules/<feature>/components/<screen>.tsx
  modules/<feature>/lib/<concern>.ts          # flat: state, schema, search-params, fixtures
  modules/<feature>/components/views/<x>.tsx  # only: two screens, one URL
  app/(workspace)/.../page.tsx                # composition only

Reject
  modules/<feature>/lib/<a>/<b>/<file>.ts    # nested lib trees
  modules/<feature>/hooks/ at repo root       # use lib/ or colocate
  modules/<feature>/services/api/...
  root utils/ | common/ | shared/             # see placement Never add
```

When `lib/` grows: new **file** in the same folder ([layout](layout.md#when-a-feature-grows)); then shared type in `lib/` after two features need it; then consider split module ([slicing](slicing.md)) — not deeper folders.

## Dependency flow

```text
app → modules, lib
modules/ui | lib | account → never record features, never app
record feature → portal | projects | ui | lib (not sibling record UI/lib)
portal → record lib/ only
```

Sideways record imports and shared importing features are the usual scalability failures. Details: [placement](placement.md#import-matrix).

## Anti-pattern index

| Smell | Fix | Ref |
| ----- | --- | --- |
| Junk drawer `shared` / `utils` / root `components` | Domain in `modules/`; generic in `lib/` | [placement](placement.md) |
| Layer-first repo (`hooks/`, `services/` at root) | Feature `lib/` or colocate | [placement](placement.md) |
| Micro-module (one modal = one feature) | Colocate or meet [slicing](slicing.md) gates | [slicing](slicing.md) |
| Feature imports feature | Portal hub or `lib/` types | [portal](portal.md), [data](data.md) |
| God screen (fetch + store + form + nav + analytics) | Split by **reason to change**, not JSX size | [layout](layout.md), [ui](ui.md) |
| Boolean prop explosion on shared UI | Feature-owned UI or plain props in `modules/ui` | [ui](ui.md) |
| Barrel `index.ts` under `modules/` | Direct imports; RSC-safe graphs | [placement](placement.md) |
| Server Action as `queryFn` | `apiFetch` / route URL | [data](data.md) |
| Second global client store | portal + nuqs + Query + local state only | [data](data.md) |
| Premature `packages/` | Single app until [ecosystem](ecosystem.md) trigger | [ecosystem](ecosystem.md) |

## Cohesion rules

- Group by **user job / record type**, not by file type ([slicing](slicing.md)).
- Promote to `modules/ui` or `lib/` only after **two** unrelated features need the same thing ([ui](ui.md), [boundaries](boundaries.md)).
- Prefer **flat** feature folders over ornamental nesting; URL depth lives in `app/`, not in `lib/validators/email/`.

## Scale

Default: one Next app + `modules/`. Evolution steps: [ecosystem](ecosystem.md). Future automated import law (eslint-boundaries, dependency-cruiser) should mirror [placement](placement.md) — optional, not in starter.
