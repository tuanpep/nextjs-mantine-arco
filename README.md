# nextjs-mantine-arco

Foundation: **Next.js 16**, **Mantine**, **TanStack Query**, **next-intl** (Vietnamese default, English). **App / modules** layout and placement: `.cursor/skills/app-modules/SKILL.md` (Cursor skill `@app-modules`).

```bash
npm install
npm run dev
```

Open the [Component Book](http://localhost:4202) to browse the index or search the sidebar. Each component has its own page with a live preview, for example [`/components/data-table`](http://localhost:4202/components/data-table).

## Arco theme

The app uses Mantine components with an Arco Design React theme. No Arco runtime is installed.

- `modules/ui/theme/arco-theme.ts` owns the global palettes, typography, spacing, radii, and light/dark semantic tokens.
- `modules/ui/theme/arco-components.ts` and `arco-extra-components.ts` register shared overrides. Keep feature-specific styles with the feature.
- Use `Select` or `MultiSelect` for an Arco-style popup. `NativeSelect` uses the browser's menu, which the theme cannot style.
- Use Mantine props as usual: `filled` for primary, `default` for secondary, `outline` for outlined, `subtle` for text buttons, and `dashed` for dashed buttons. For buttons and text inputs, Mantine `xs` / `sm` / `md` / `lg` map to Arco's 24 / 28 / 32 / 36px sizes.
- Components without a dedicated override inherit shared tokens and retain Mantine's structure and behavior. Optional Mantine packages are not themed individually.

References: [Arco global tokens](https://github.com/arco-design/arco-design/blob/main/components/style/theme/global.less), [Arco component specs](https://arco.design/react/components/button), and [Mantine Styles API](https://mantine.dev/styles/styles-api/).

### Components built on Mantine

Import reusable UI from `modules/ui/components/<group>/`: `display`, `feedback`, `inputs`, `navigation`, or `overlays`. Keep component tests and styles next to their component. To add a Component Book page, register its name and category in `modules/ui/component-book/component-catalog.ts` and add the matching preview.

| Components                                                                        | What they provide                                                                                                      |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Mentions`, `Transfer`                                                            | Controlled `@` suggestions and a searchable two-list selector                                                          |
| `Popconfirm`, `Trigger`, `ResizeBox`                                              | Confirmation and click popovers, plus horizontal pointer and keyboard resizing                                         |
| `BackTop`, `Comment`, `PageHeader`, `Result`, `Statistic`, `Message`, `Watermark` | Scroll-to-top, content and status layouts, inline feedback, and a decorative watermark                                 |
| `Upload`                                                                          | File selection, progress, cancellation, and retry through a caller-supplied transport; the preview does not send files |
| `DataTable`                                                                       | Client-side sorting, filtering, selection, and pagination; no virtualization or expandable rows                        |

These use the app theme and have their own props; they are not drop-in replacements for Arco's APIs.

## i18n

- Config: `lib/i18n/` (`config.ts`, `request.ts`, `actions.ts`)
- Messages: `messages/vi.json`, `messages/en.json` (keep keys aligned)
- Cookie: `DX_LOCALE` (HTTP-only, one year)
- Vietnamese default; URLs have no locale prefix

## Data fetching

- `app/providers.tsx` wraps the app in `QueryClientProvider`
- `lib/query/get-query-client.ts` — server-safe client factory (one browser singleton)

## Extend

| Add    | Where                                            |
| ------ | ------------------------------------------------ |
| Routes | `app/` — thin pages, screens in `modules/`       |
| UI     | `modules/<feature>/components/` or `modules/ui/` |
| Copy   | `messages/*.json` namespaces                     |

| Script             | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `npm run check`    | Format, lint, stylelint, types, unit tests |
| `npm run test:e2e` | Playwright (component previews and i18n)   |
