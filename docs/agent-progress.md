# Standardization implementation progress

Updated: 2026-10-30

## Project Overview implementation

Extended the existing project-hub component with four Mantine-default stats cards,
four labelled quick-action links and up to five project-scoped Support requester
handoffs. Support cards use the shared session provider and update after replies.
The new Support needs-action query view matches the Overview attention card and
has its own collection tab. Empty attention lists explain that no Support reply
is required; unknown projects do not expose cards or intake actions.

Feedback uses the same fixed sample list as its collection. The card counts both
Not reviewed and Needs clarification, labelled Phản hồi cần xem xét, matching the
linked needs-review view. UAT state is screen-local, so the Overview explicitly
shows unavailable shared progress instead of fabricating a current result.
No state provider migration, backend metrics or new custom CSS was introduced.

Verification: 43 focused Overview/Support tests passed, including three Overview
component tests and a new needs-action filter test. TypeScript, focused ESLint,
formatting and whitespace checks passed. React Doctor remained 72/100 with the
same existing project-settings warning. Added two Playwright Overview scenarios
for session reply/return/filter behavior and mobile project isolation, but did
not run them against the real-SSO server. Browser layout and interaction remain
unverified. No production build, participant evaluation or commit was performed.

## Context-aware sidebar redesign

Latest simplification supersedes the visual treatment below: removed the sidebar
CSS module and restored Mantine default NavLinks at 232px width. Inside a valid
project, the sidebar contains only its module destinations and settings, with a
plain project-name label instead of the context card and section headings.
Projects appears only at root/no-project routes. The DX Portal header link returns
to root with the existing unsaved-change guard. Mobile retains its project
switcher. Five shell tests, focused ESLint and TypeScript passed after this change.
Browser assertions were updated but remain unexecuted due to the SSO constraint.

The latest user request supersedes the fixed-menu behavior described below.
Home and invalid/no-project routes now show only the root Projects destination.
A valid project reveals its context card, Overview, Support, Feedback, Ideas,
UAT and settings, with no repeated destinations. Removed the obsolete module
chooser modal. The desktop header still permits project selection; the mobile
project switcher appears only inside a valid project. Section-preserving project
switching and settings unsaved-change guards remain in place.

The existing workspace shell now uses a local CSS module for 44px navigation
targets, visible focus, violet active treatment, a project context card and
separated settings. Sidebar width is 264px. Navigation tests were updated for
root-only and contextual menus. Five shell component tests, focused ESLint,
Stylelint, TypeScript and whitespace checks passed. Browser tests were updated
but not run against the existing real-SSO server; visual/mobile runtime behavior
remains unverified.

## Support requester flow follow-up

Following the sitemap and Support wireframes, extended the existing Support detail
and intake components. The main column now shows the next actor/action before
history, with a keyboard-focus shortcut to an explicit reply or retest form.
Resolved requests show read-only discussion and require opening a separate reopen
form. Cancel leaves the request resolved and retains the unsent reason on that
page. Reply/retest/comment state effects remain owned by the existing Support
state functions. Confirmation now includes the submitted title, project, local ID,
demo-only next step and a return-to-collection link. Intake and detail explain
session reset and no live delivery. New copy follows the existing Vietnamese UI.

Verification for this follow-up: all 39 Support tests passed, including two added
component tests for cancel/reopen retention and focus navigation. TypeScript,
focused ESLint and diff whitespace checks passed. React Doctor scanned 52 changed
files and reported 72/100 with one warning in the pre-existing project-settings
component, outside this slice. There is no same-run before score, so no score
regression claim is made.

Three focused Playwright tests were attempted but timed out because the existing
server on port 4202 redirected to real SSO instead of the test bypass. No server
was stopped, no auth setting was changed and no identical retry was attempted.
Browser coverage for create/revisit, reply focus and mobile reopen/cancel remains
unverified. No production build, real sign-in or participant evaluation ran.

## Scope and authorization

The user requested code implementation following
`docs/product-design/dx-support-standardization/`. Work started with the demo
configuration foundation in the existing `modules/projects` module. This request
authorizes local code changes, not production use, live permissions, shared catalog
administration, or resolution of the design's ownership and policy questions.

The product-design package remains a proposed Shape/evaluation document. Its C1–C9
participant/authority cases have not run. Software checks below are separate evidence.
The supplied design documents were not changed.

## Implemented first slice

- Read-only project identifier, name, description and registry owner reference.
- Four module-specific fictional responsibility references, with baseline, applied
  value and applied source shown separately from the draft.
- Review of project scope and old/new values before explicit apply.
- Back-to-edit preserves text. Cancel/discard restores the last applied value.
- Workspace-layout provider retains applied references during client navigation,
  isolates values and drafts by project, and resets when the app reloads.
- Project switching, workspace links and the Overview breadcrumb ask before
  discarding unsaved references. Reload/close registers a browser unload warning.
  Browser history is not intercepted; in-memory drafts remain available on return.
- Setup context uses applied references. Missing references are separate from
  unresolved operational readiness. Archive remains disabled.
- No changes to work assignment, records, access, identity integration, notifications,
  workflow rules, module enablement or durable storage.

New behavior lives in `modules/projects/lib/project-settings.ts`,
`modules/projects/components/project-settings-provider.tsx` and the existing settings
screen. The existing workspace shell guards its own navigation. The shared
`PageHeader` accepts an optional breadcrumb navigation handler. Routes remain thin.

## Verification

- Existing project test baseline: 5 tests passed before edits.
- `npm run test:run`: 77 tests passed across 18 files, including six new settings
  component tests.
- `npm run typecheck`, `npm run lint`, `npm run stylelint`: passed.
- Prettier checks for changed code and `git diff --check`: passed.
- Settings and workspace Playwright suites: 7 Chromium tests passed. These cover
  same-session revisit, cross-project isolation, reload reset, unsaved-discard
  recovery, keyboard dialog focus/Escape, section-preserving navigation and blocked
  archive. An existing ambiguous UAT test locator was narrowed to its scenario region.
- React Doctor changed-scope scan: 81/100, unchanged between the two scans, no
  reported issues. The tool reported six scanned files; this is not full-codebase
  or exhaustive new-file coverage.

The first browser attempt stopped because environment variables were absent. Tests
then used `.env.example` values in the test process only with the existing Playwright
auth bypass. Playwright's required Chromium version was installed locally after the
next attempt reported a missing executable. No `.env.local` was created and no SSO
connection was used. No production build, real sign-in or participant evaluation ran.

## Remaining work

1. Vietnamese feature-screen coverage is now implemented as described below.
   Add narrower-screen and assistive-technology verification for the settings journey.
2. Implement the bounded Support discussion/activity/outcome distinction and explicit
   requester/handler actions without inventing legacy timestamps, identity or audiences.
   Keep resolved discussion read-only until explicit reopening. U10/U11 remain open.
3. Complete Feedback and Ideas review/confirm/create/revisit in their existing homes
   with project-scoped in-memory records. Preserve dispositions/positions and avoid
   delivery promises. Live expansion remains dependent on the documented evaluations.
4. Refine Overview intent guidance and UAT evidence explanation without a universal
   status model, campaign builder, Support conversion or release approval.

Keep the registry read-only. Do not add tenancy, membership, role enforcement,
catalog CRUD, archive, private notes, real attachments, notifications or live
integrations based on fictional references. Product/service/security owners and
participant evaluation remain external dependencies, not completed tasks.

## Fixed navigation follow-up

The user accepted a fixed sidebar proposal after the foundation slice. The existing
`workspace-shell.tsx` now defines one ordered menu: Projects, Overview, Support,
Feedback, Ideas, UAT, Project settings. Workspace, Project work and Configuration
group labels do not change with project context. Individual project names no
longer replace the module menu on the directory page.

The project selector stays in the desktop header and the mobile drawer. Without a
valid route project, the selector says Choose project and project-specific menu
actions open a chooser retaining the intended section. Cancel/Escape preserves the
page and restores focus. No fallback project or cross-project record is selected.
Switching projects opens the section root, not the previous project's record.
Existing unsaved-settings checks remain in effect. A canceled mobile navigation
keeps the drawer open. New navigation labels and chooser text exist in vi/en.

The locale selector is disabled before hydration, matching other interactive shell
controls, so an early selection cannot be silently lost. Its keyboard browser test
waits for readiness before focusing.

Follow-up verification: 80 unit/component tests passed, typecheck and ESLint passed,
and the navigation, settings, workspace, vi/en and progress suites passed all 17
Chromium tests with one worker. React Doctor remained 81/100 with no reported
changed-scope issues. Parallel exploratory runs exposed keyboard-test focus races;
the new chooser test uses the locator's keyboard action and locale/progress tests
wait for hydrated controls. A full browser-suite attempt also found an existing
ambiguous `getByRole("textbox")` in `e2e/support.spec.ts:40`, matching both handler
triage and requester reply. That unrelated test was not changed and the full suite
is not claimed green. No production build or real SSO sign-in was tested.

After the original foundation verification, `.env.local` was created at the user's
request using their SSO/backend configuration. It is Git-ignored and keeps the auth
bypass disabled. Browser automation temporarily stopped the real-SSO dev server
and used Playwright's process-only bypass; the real-SSO server is restarted afterward.

## Vietnamese interface migration

The user requested Vietnamese throughout the application. Updated the existing
Projects, Support, Feedback, Ideas and UAT modules, shared loading/error/empty
states, form readouts and document description. Demo content and validation messages
are Vietnamese. Status, priority, severity and result labels use Vietnamese display
maps while internal enum values, IDs, URLs and proper names remain unchanged.
Navigation and feature screens consistently use Phản hồi and Kiểm thử nghiệm thu.
The existing vi/en shell selector remains available, but feature screens now use
Vietnamese copy. This does not claim complete English feature-screen translations.
The external Keycloak sign-in page is outside this repository and was not translated.

Verification: 91 unit/component tests across 21 files and all 20 Chromium browser
tests passed. ESLint, TypeScript and diff whitespace checks passed. Browser checks
used the existing process-only authentication bypass without editing `.env.local`.
No production build, real sign-in or external identity-provider changes were made.
The dev-server log also showed a theme-toggle hydration mismatch during earlier
browser runs. It was not investigated or changed as part of the language migration.
