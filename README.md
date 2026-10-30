# DX Support

An interactive frontend for a **project workspace MVP**: Support, Feedback, Ideas, and UAT campaigns inside one project context, with a header project switcher. Built with Next.js App Router and the existing Mantine theme.

Feature records are fictional and held in browser memory (they reset on reload). Sign-in uses Keycloak SSO. Copy `.env.example` to `.env.local` and replace the example URLs, realm, and client ID with your own configuration before starting the app. Feature tickets still use demo fixtures — there is no live intake, notification delivery, or access provisioning through this UI. Never enter real employee, customer, credential, or confidential business data into demo forms.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:4202. You will be redirected to Keycloak to sign in. After auth, the root path shows the project list (Home). Playwright sets `NEXT_PUBLIC_E2E_AUTH_BYPASS=1` so browser tests skip SSO.

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

The sidebar has a fixed order on the project directory and project pages:
Projects, Overview, Support, Feedback, Ideas, UAT, and Project settings. Project
names appear in the directory and separate selector, not as replacement menu items.
The selector stays in the desktop header and at the top of the mobile drawer.
Without a valid project context, project destinations ask for a project and then
open the chosen section. Cancel keeps the current page; no project is chosen by default.

Everyday navigation stays inside a project. The header switcher changes project while
keeping the current section (Support, Feedback, Ideas, UAT, or Settings). Settings shows
read-only project identity and project-scoped demo responsibility references. Review
old/new values before applying; cancel or discard restores the last applied value.
Applied references survive client navigation but reset on reload. They never assign
new or active work, grant access, notify anyone, or establish duty. Archive stays blocked.

The project registry lives in `modules/projects/lib/applications.ts`. Product design for
the standardization work lives in `docs/product-design/dx-support-standardization/`.
Implementation progress and remaining work are recorded in `docs/agent-progress.md`.

| Route                              | Purpose                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| `/`                                | Home — choose a project                                       |
| `/projects/beacon-portal`          | Project overview and section shortcuts                        |
| `/projects/beacon-portal/support`  | Project support list, intake, detail, and replies             |
| `/projects/beacon-portal/feedback` | Project feedback list and share/review stubs                  |
| `/projects/beacon-portal/ideas`    | Project ideas list (no votes or roadmap)                      |
| `/projects/beacon-portal/uat`      | UAT campaigns and scenario results (not release acceptance)   |
| `/projects/beacon-portal/settings` | Read-only identity and reviewed, session-only demo references |

Support, Feedback, Ideas, and UAT do not share status words. UAT progress is evidence only; it is not release approval.

Settings prompts before discarding unsaved references through the project switcher,
workspace links, or the Overview breadcrumb. Reload/close uses the browser's unsaved
changes warning where supported. Drafts are held per project in memory, not durable
storage. Setup summaries use applied references and do not establish operational readiness.

Verify the foundation with `npm run test:run -- modules/projects` and
`npm run test:e2e -- e2e/project-settings.spec.ts e2e/workspace.spec.ts`.
Browser tests need the environment variables in `.env.example` and the installed
Playwright Chromium browser, available through `npx playwright install chromium`.

## Production work still required

Before using this with employees, implement server-side persistence and validation, corporate SSO, server-enforced roles and record visibility, audit storage, attachment controls, retention policies, and accessible operational error recovery. Integrate identity provisioning, the engineering tracker, communication delivery, and monitoring only through approved systems.

Service ownership, support hours, escalation routes, service targets, and business approval policies must be agreed with the responsible teams. This frontend does not establish those policies.

| Script             | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `npm run check`    | Format, lint, stylelint, types, and unit tests |
| `npm run test:e2e` | Playwright                                     |
| `npm run analyze`  | Production bundle report                       |

Routes stay in `app/`. Feature code goes in `modules/<feature>/`. Helpers used by more than one feature go in `lib/`.
