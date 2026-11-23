# Testing

[placement](placement.md) · gates: [review](review.md)

## Where tests live

| Kind | Location |
| ---- | -------- |
| Screen / component | Colocated `*.test.tsx` next to the source under `modules/` |
| `lib/` modules (no component) | Root `__tests__/*.test.ts` (e.g. parsers, schemas) |
| E2E | `e2e/*.spec.ts` |
| RTL + Mantine + Query wrapper | `@/test-utils/render` |

Add `NextIntlClientProvider` in the test when the component calls `useTranslations`.

Vitest: `vitest.config.ts`, `vitest.setup.ts` — `e2e/` excluded. Playwright: port **4202**, `DX_LOCALE` in config.

## Conventions

Behavior over implementation; `getByRole` when possible. Mock at `apiFetch` when `modules/account/` exists. Cross-feature imports in tests: **fixtures only** — not production components from another record module.

`npm run check` runs format, eslint, stylelint, typecheck, and `vitest run`.
