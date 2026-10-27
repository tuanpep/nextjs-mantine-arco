# DX Support

An interactive frontend for a **project workspace MVP**: Support, Feedback, Ideas, and UAT campaigns inside one project context, with a header project switcher. Built with Next.js App Router and the existing Mantine theme.

Feature records are fictional and held in browser memory (they reset on reload). Sign-in uses corporate Keycloak SSO; copy `.env.example` to `.env.local` for local values. Feature tickets still use demo fixtures — there is no live intake, notification delivery, or access provisioning through this UI. Never enter real employee, customer, credential, or confidential business data into demo forms.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:4202. You will be redirected to Keycloak to sign in. After auth, the root path redirects to `/projects/beacon-portal/support`. Playwright sets `NEXT_PUBLIC_E2E_AUTH_BYPASS=1` so browser tests skip SSO.

## Languages

The shared workspace header, sidebar, accessibility labels, and demo footer support
Vietnamese and English through `next-intl`. Vietnamese is the default. Feature
screens, metadata, forms, and sample records still use English in this first pass.
The header language selector stores a validated `DX_LOCALE` HTTP-only cookie for
one year. Missing or unsupported values fall back to Vietnamese. URLs do not gain
language prefixes, so shared links use the recipient's saved language preference.
Changing languages uses a Server Action and updates the server-rendered document
language without a full page reload. The cookie is not an authentication mechanism.

Shared locale configuration and request loading live in `lib/i18n/`. Message
catalogs live in `messages/vi.json` and `messages/en.json`. Keep their keys aligned.
Client components use `useTranslations("Workspace")`; server components can use
`getTranslations` from `next-intl/server`.

Verify with `npm run test:run -- lib/i18n/config.test.ts` and
`npm run test:e2e -- e2e/i18n.spec.ts`. Existing feature browser tests explicitly
start in English; localization tests cover the Vietnamese default and switching.

## Navigation progress

`app/providers.tsx` mounts `nextjs-toploader`, which uses NProgress for the global
navigation bar. Existing `next/link` links work without changes. The bar uses the
custom theme's gray loader color, is 2px tall without a glow, hides the spinner,
and skips hash-only links.

For programmatic navigation in client components, import the wrapper hook so
`push` and `replace` also start the progress bar:

```tsx
import { useRouter } from "nextjs-toploader/app";

const router = useRouter();
router.push("/projects/beacon-portal/support");
```

Keep other navigation hooks such as `usePathname` and `useSearchParams` imported
from `next/navigation`.

## Project workspace

Everyday navigation stays inside a project. The header switcher changes project while
keeping the current section (Support, Feedback, Ideas, UAT, or Settings). Settings is a
manager demo stub: naming people is not an access grant, and archive stays blocked.

The project registry lives in `modules/projects/lib/applications.ts`. Product design for
this MVP lives in `docs/product-design/project-workspace-mvp/`.

| Route                              | Purpose                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| `/`                                | Redirects to Beacon Portal Support                          |
| `/projects/beacon-portal/support`  | Project support list, intake, detail, and replies           |
| `/projects/beacon-portal/feedback` | Project feedback list and share/review stubs                |
| `/projects/beacon-portal/ideas`    | Project ideas list (no votes or roadmap)                    |
| `/projects/beacon-portal/uat`      | UAT campaigns and scenario results (not release acceptance) |
| `/projects/beacon-portal/settings` | Manager setup stub                                          |

Support, Feedback, Ideas, and UAT do not share status words. UAT progress is evidence only; it is not release approval.

## Production work still required

Before using this with employees, implement server-side persistence and validation, corporate SSO, server-enforced roles and record visibility, audit storage, attachment controls, retention policies, and accessible operational error recovery. Integrate identity provisioning, the engineering tracker, communication delivery, and monitoring only through approved systems.

Service ownership, support hours, escalation routes, service targets, and business approval policies must be agreed with the responsible teams. This frontend does not establish those policies.

| Script              | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `npm run check`     | Format, lint, stylelint, types, and unit tests |
| `npm run test:e2e`  | Playwright                                     |
| `npm run analyze`   | Production bundle report                       |

Routes stay in `app/`. Feature code goes in `modules/<feature>/`. Helpers used by more than one feature go in `lib/`.
