# Testing

Unit tests use **Vitest** + **Testing Library** (`jsdom`). E2E uses **Playwright** under `e2e/`.

## Unit

- Colocate `name.test.ts` or `name.test.tsx` beside the file under test.
- Shared schema or env checks may live in `__tests__/` at repo root when they are not tied to one module.
- Config: `vitest.config.ts`, setup: `vitest.setup.ts`. E2E paths are excluded from Vitest.
- Tests may import another feature's **fixtures**. Production modules may not.

Prefer testing behavior users see (labels, roles, empty states) over implementation details. Mock network at the `apiFetch` boundary when that code exists.

## E2E

- One spec per journey (`e2e/*.spec.ts`). Keep smoke flows short.
- `playwright.config.ts` sets `DX_LOCALE` in storage state and starts `npm run dev` on port **4202** (same as Keycloak redirect URIs).
- Auth bypass for local E2E is `isE2eAuthBypass()` in `app/env.ts` — never enable in production.

## Before merge

Run `npm run check` (includes `test:run`). Run `npm run test:e2e` when routes, i18n, or auth chrome change.
