# Routes and record shape

[placement](placement.md) · [baseline](baseline.md) · stack: layout → page → module screen.

## Routes

- Route group `(workspace)` = shared chrome; not per feature. Second group only for a second shell.
- Page: Suspense + inner async child awaits `params`, one `modules/` screen. No `page-client.tsx`.

```tsx
export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<RecordPageSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
```

Invalid id before paint → `notFound()` in page when siblings do. `proxy.ts` optional; no `middleware.ts` ([runtime](runtime.md)).

## Errors

| Expected (validation, 404, forbidden) | Unexpected (bugs) |
| --------------------------------------- | ----------------- |
| Return values, `notFound()`, inline UI  | `error.tsx`, `global-error.tsx` |

Validation in actions: return errors, do not throw. Event-handler errors are not caught by error boundaries.

`not-found.tsx` / segment `error.tsx` in workspace when routes grow. Empty states: short copy + one action (root `AGENTS.md`).

## Record feature

```text
modules/<feature>/
  components/   *-list.tsx, *-detail.tsx, *-form.tsx
  lib/          state.ts, fixtures.ts, search-params.ts
  actions.ts    # server I/O only ([baseline](baseline.md#write-path))
```

Forms: [forms](forms.md). Lists: nuqs parsers → plain rows → shared list UI when it exists.

Loading UI: `*-skeleton.tsx` colocated in the feature `components/`, or `modules/ui/components/` when **two** features share it.

## When a feature grows

| Signal | Action |
| ------ | ------ |
| Second job in `lib/` | New file same folder |
| Hook: 1 vs 2 callers | Beside component → `lib/` (no `hooks/` folder) |
| Two screens one URL | `components/views/` |
| Network in logic | `actions.ts`; pure stays `state.ts` |
| UI prop needs feature type | Move UI into feature |

Kebab-case files; PascalCase export. Mantine + `pajamas.module.css`; CSS module only if Mantine cannot.
