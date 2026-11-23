# Placement (authority)

If another reference disagrees, this file wins.

## Decision tree

```text
New code?
├─ URL, layout, loading, error → app/
├─ Copy → messages/en.json + vi.json
├─ Interactive screen → modules/<feature>/components/ ("use client" on screen)
├─ Pure rules, parsers, fixtures → modules/<feature>/lib/
├─ Shared UI (plain props only) → modules/ui/components/<group>/
├─ Auth, apiFetch, action session → modules/account/
├─ Record session store → modules/portal/
├─ Workspace shell, breadcrumbs → modules/projects/
├─ Unit tests (colocated) → beside source (*.test.tsx / *.test.ts)
├─ Lib-only unit tests → __tests__/ at repo root
├─ Test wrappers → test-utils/
└─ Feature-agnostic, no modules import → lib/
```

Pick the innermost layer that does not import outward. Depth budget and anti-pattern index: [architecture](architecture.md).

## Import matrix

```text
app → modules, lib
record feature → own lib, portal, projects, ui, lib (not other record features)
portal → record feature lib/ only (state.ts, types, fixtures — not components)
account → lib/, modules/ui/ only (not record features, not app)
ui, lib → not record features, not app
```

Example: `modules/portal/` may import `createBugReport` from `modules/bug-reports/lib/state.ts`; it must not import `modules/help/components/`.

Inside feature: relative imports. Across layers: `@/`. No `index.ts` barrel files under `modules/` unless an on-disk folder already documents that barrel in its feature ref.

## Never add

`src/`, `pages/`, `packages/`, `common/`, `shared/`, root `components|hooks|actions`, `middleware.ts`, `[locale]`, second HTTP client, second QueryClient, Redux/Zustand.

URL `bugs` → module `bug-reports`. Params: `[projectId]`, `[bugId]`.

Record modules (when present): `bug-reports`, `help`, `feature-requests`, `feedback`, `guides`, `discussions`.

## Reject (fix immediately)

| Pattern | Fix |
| ------- | --- |
| Domain logic in `page.tsx` | Screen in `modules/` |
| Layout as sole auth gate | Page + action + route each check |
| Feature imports feature | Portal or type in `lib/` |
| Same write in action and route | One door ([data](data.md#write-door)) |
| Feature type in `modules/ui` props | UI in feature |
| One-widget “module” | Colocate in parent |
| `modules/*/lib/*/*/` nested dirs | Flat files in `lib/` ([architecture](architecture.md#depth-budget)) |
| `modules/*/hooks/` or `services/` trees | `lib/*.ts` or colocate ([layout](layout.md#when-a-feature-grows)) |
| Fat logic in `app/**/page.tsx` | Thin page + `modules/` screen |
| Shared UI with domain enums/types in props | Move UI into record feature |

Tests may import other features' **fixtures** only ([testing](testing.md)).
