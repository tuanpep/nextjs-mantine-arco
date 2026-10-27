# DX Support

An interactive frontend for the Digital Transformation department's employee service portal. Uses Next.js App Router and the existing Mantine theme. The existing project workspace and production-support workflows remain available.

All accounts and records are fictional. Changes are held in browser memory and reset on reload. Some feature-local state also resets when leaving that feature. There is no backend, authentication, permission enforcement, live intake, notification delivery, monitoring, or access provisioning. The DX work queue simulates staff actions and is accessible to everyone in this demo. Never enter real employee, customer, credential, or confidential business data.

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the workspace Home overview. Browse `/projects` for the full-width project directory. Each project has an overview and Support and Ideas work-item collections.

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
`getTranslations` from `next-intl/server`. Add feature-specific namespaces as
screens are migrated, including validation and accessible labels. Use
`useFormatter` or server-side `getFormatter` for locale-aware numbers and dates.
The initial formatting time zone is `Asia/Ho_Chi_Minh`; change that explicitly if
the portal needs user-specific time zones. Do not translate user-entered content
or use translated labels as record IDs or routing conditions.

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
router.push("/projects");
```

Keep other navigation hooks such as `usePathname` and `useSearchParams` imported
from `next/navigation`. The bar indicates navigation activity, not a measured
download percentage or completion of every data request on the destination.

## Portal areas

Navigation is a flat list ordered by priority: Home, Get help, My service requests, Service catalog, Service status, Applications, Learning center, UAT & testing, Improvements, and DX work queue. Production support is reached through Get help or the application workspace. This is a usability order based on the stated use cases, not measured usage analytics or a permission boundary.

| Route                             | Purpose                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `/applications`                   | Application directory, with Beacon Portal as the available sample application |
| `/help`                           | Symptom-based routing to support, services, learning, UAT, or improvements    |
| `/projects/beacon-portal/support` | Production support, submission, replies, and retest follow-up                 |
| `/services`                       | Standard service catalog and service-request intake                           |
| `/requests`                       | Service requests and their progress                                           |
| `/operations`                     | Simulated DX service-request triage and fulfillment                           |
| `/learning`                       | Searchable user guides and onboarding tasks                                   |
| `/uat`                            | Release testing, scenario results, defects, and acceptance                    |
| `/improvements`                   | Application enhancements and transformation-demand intake                     |
| `/status`                         | Manually maintained demo incidents, workarounds, and maintenance              |

Production support and service requests are separate collections. UAT records represent pre-release testing, not production incidents. The legacy project Ideas screen remains a read-only sample; new improvement intake lives at `/improvements`.

## Production work still required

Before using this with employees, implement server-side persistence and validation, corporate SSO, server-enforced roles and record visibility, audit storage, attachment controls, retention policies, and accessible operational error recovery. Integrate identity provisioning, the engineering tracker, communication delivery, and monitoring only through approved systems. Approval is not proof that access has been provisioned. UAT acceptance is not a substitute for security, deployment, or operational readiness approval.

Service ownership, support hours, escalation routes, service targets, and business approval policies must be agreed with the responsible teams. This frontend does not establish those policies.

| Script              | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `npm run check`     | Format, lint, stylelint, types, and unit tests |
| `npm run test:e2e`  | Playwright                                     |
| `npm run storybook` | Component stories                              |
| `npm run analyze`   | Production bundle report                       |

Routes stay in `app/`. Feature code goes in `modules/<feature>/`. Helpers used by more than one feature go in `lib/`.
