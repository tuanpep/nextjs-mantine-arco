# Next.js frontend template

App Router frontend with Mantine, Zod, TanStack Query, nuqs, Vitest, Playwright, and Storybook. Layout and commit guidance is in `.cursor/skills/nextjs-fe/` and is read when that work starts.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | Purpose |
| --- | --- |
| `npm run check` | Format, lint, stylelint, types, and unit tests |
| `npm run test:e2e` | Playwright |
| `npm run storybook` | Component stories |
| `npm run analyze` | Production bundle report |

Routes stay in `app/`. Feature code goes in `modules/<feature>/`. Helpers used by more than one feature go in `lib/`.
