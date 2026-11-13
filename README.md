# Next.js frontend template

Foundation: **Next.js 16**, **Mantine** + **GitLab Pajamas** (`theme.ts`, `pajamas.module.css`), **TanStack Query**, **next-intl** (Vietnamese default, English). **App / modules** layout and placement: `.cursor/skills/app-modules/SKILL.md` (Cursor skill `@app-modules`).

```bash
npm install
npm run dev
```

http://localhost:4202

## i18n

- Config: `lib/i18n/` (`config.ts`, `request.ts`, `actions.ts`)
- Messages: `messages/vi.json`, `messages/en.json` (keep keys aligned)
- Cookie: `DX_LOCALE` (HTTP-only, one year)
- Vietnamese default; URLs have no locale prefix

## Data fetching

- `app/providers.tsx` wraps the app in `QueryClientProvider`
- `lib/query/get-query-client.ts` — server-safe client factory (one browser singleton)

## Theming

- `theme.ts` — Mantine theme + Pajamas component overrides
- `pajamas.module.css` — GitLab design tokens
- `lib/fonts.ts` — GitLab Sans / Mono via `@gitlab/fonts`

## Extend

| Add    | Where                                            |
| ------ | ------------------------------------------------ |
| Routes | `app/` — thin pages, screens in `modules/`       |
| UI     | `modules/<feature>/components/` or `modules/ui/` |
| Copy   | `messages/*.json` namespaces                     |

| Script             | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `npm run check`    | Format, lint, stylelint, types, unit tests |
| `npm run test:e2e` | Playwright (i18n smoke)                    |
