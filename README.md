# DX Portal

Project workspace for Bug Reports, Help, Feature Requests, Feedback, Guides, and Discussions. Built with Next.js App Router and the Mantine theme.

Feature records are fictional and held in browser memory. They reset on reload. Sign-in uses Keycloak SSO. Copy `.env.example` to `.env.local` and replace the example URLs, realm, and client ID before starting. There is no live intake, notification delivery, or access provisioning. Do not enter real employee, customer, credential, or confidential data.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:4202. You will be redirected to Keycloak to sign in. After auth, the root path shows the project list. Playwright sets `NEXT_PUBLIC_E2E_AUTH_BYPASS=1` so browser tests skip SSO.

## Languages

The workspace shell and feature screens support Vietnamese and English through `next-intl`. Vietnamese is the default. The header language selector stores a validated `DX_LOCALE` HTTP-only cookie for one year. Missing or unsupported values fall back to Vietnamese. URLs do not gain language prefixes. Changing languages uses a Server Action and updates the document language without a full page reload. The cookie is not an authentication mechanism.

Shared locale configuration lives in `lib/i18n/`. Message catalogs live in `messages/vi.json` and `messages/en.json`. Keep their keys aligned.

## Navigation progress

`app/providers.tsx` mounts `nextjs-toploader`. Existing `next/link` links work without changes. The bar uses the theme loader color, is 2px tall, hides the spinner, and skips hash-only links.

For programmatic navigation in client components, import the wrapper hook so `push` and `replace` also start the progress bar:

```tsx
import { useRouter } from "nextjs-toploader/app";

const router = useRouter();
router.push("/projects/beacon-portal/support/bugs");
```

Keep `usePathname` and `useSearchParams` imported from `next/navigation`.

## Project workspace

The sidebar inside a project is Overview, Support (Bug Reports, Help), Ideas (Feature Requests, Feedback), Guides, and Discussions. Project names stay in the directory and the header switcher. The switcher keeps the current section and returns from a record to that section's list. Without a valid project, the sidebar shows only Projects.

Support and Ideas do not share status words. Guides are articles. Discussions are project threads and are not attached to other records.

The project registry lives in `modules/projects/lib/applications.ts`. Module boundaries live in `docs/product-design/portal-modules.md`.

| Route                                    | Purpose                     |
| ---------------------------------------- | --------------------------- |
| `/`                                      | Home — choose a project     |
| `/projects/beacon-portal`                | Overview and section counts |
| `/projects/beacon-portal/support/bugs`   | Bug reports                 |
| `/projects/beacon-portal/support/help`   | Help requests               |
| `/projects/beacon-portal/ideas/features` | Feature requests            |
| `/projects/beacon-portal/ideas/feedback` | Feedback                    |
| `/projects/beacon-portal/guides`         | Guides                      |
| `/projects/beacon-portal/discussions`    | Discussions                 |

## Production work still required

Before using this with employees, implement server-side persistence and validation, server-enforced roles and record visibility, audit storage, attachment controls, and retention policies. Service ownership and support hours must be agreed with the responsible teams. This frontend does not establish those policies.

| Script             | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `npm run check`    | Format, lint, stylelint, types, and unit tests |
| `npm run test:e2e` | Playwright                                     |
| `npm run analyze`  | Production bundle report                       |

Routes stay in `app/`. Feature code goes in `modules/<feature>/`. Helpers used by more than one feature go in `lib/`.
