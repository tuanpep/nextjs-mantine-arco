# Module review → ready-to-implement plan

Paste into an AI agent after filling the Context block.

---

```text
You are a product + engineering agent in this repo (dx-support-fe).

## Mission
Review module `<MODULE_NAME>` (`modules/<MODULE_NAME>/`), research external workflows/platforms that solve the same job, then produce a **ready-to-implement** improvement plan for this codebase.

Do **not** write code in this pass unless I say “implement”. Your deliverable must be specific enough that another agent can implement without re-researching.

## Context
- Module: `<MODULE_NAME>`
- Primary users: `<end users | support agents | app owners | mixed>`
- Hard constraints: `<e.g. Keycloak SSO, stay in Next.js+Mantine portal, no full ITSM replace, fixture/demo OK for now, must keep multi-app workspace>`
- Success metric for this pass: `<e.g. faster intake, clearer triage, less duplicate modules, better handoff>`
- Related modules to inspect: `modules/portal/`, `modules/projects/`, `modules/ui/`, sibling intake modules, and App Router pages that mount this module.

## Bias
- Prefer concrete UI/workflow changes inside existing modules over platform replacement.
- Max backlog items: 8.
- Every IMP item must name expected files.
- If an item cannot name files, mark it `research-spike` (not implement-now) and keep it out of PR1.

## Phase 1 — Current-state map (repo evidence only)
1. Job-to-be-done of the module (1 sentence).
2. User flows end-to-end: entry → create/list/search → detail → notes/status → return paths.
3. File map:
   - UI components
   - lib/state, queue, search-params, fixtures
   - routes/pages
   - shared deps (portal, projects shell, account, ui)
4. What is real vs fixture/session/demo-only (call out explicitly).
5. Gaps vs sibling modules (consistency, missing capabilities, duplicated patterns).

Cite concrete paths. Do not invent backend APIs.

## Phase 2 — External research (actionable extraction)
Research 4–6 real alternatives across relevant categories (DX portals, service desks, feedback boards, knowledge bases, discussion platforms, lightweight issue trackers).

For each alternative, extract **patterns we can steal**, not vendor pitch:
- Intake model
- Triage / queue model
- Status lifecycle
- Search/filter/sort
- Project/app scoping
- Empty states / progressive disclosure
- Handoff to external tools (deep links, sync, “source of truth”)

Ignore features that violate our constraints.

## Phase 3 — Decide improvement path
Choose exactly one primary path (and optionally one fallback):
- A) Keep custom module; adopt external UX/workflow patterns
- B) Integrate / deep-link an external platform as system of record
- C) Hybrid: intake + light triage here; fulfillment elsewhere

Decision must be justified by: user benefit, fit to current architecture, effort, risk.

## Phase 4 — Ready-to-implement package (required)
Produce implementation artifacts another agent can execute directly.

### 4.1 Target workflow (after change)
Write the intended happy path in 5–10 numbered steps.
Include status names, key screens, and what happens on empty/error.

### 4.2 Scope cut
- In scope (this iteration)
- Explicitly out of scope
- Non-goals

### 4.3 Change backlog (ordered)
For each item use this template:

```
ID: IMP-XX
Title:
Why (user outcome):
Type: ux | workflow | data-model | integration | cleanup
Effort: S | M | L
Depends on:
Touch files (expected):
- path/...
Acceptance criteria:
- [ ] ...
- [ ] ...
Verification:
- manual: ...
- test: add/update `...` (if applicable)
Notes / risks:
```

Order by: highest user value first, then dependency order.
Prefer a vertical slice that ships value in ≤1–2 days of focused work before larger redesigns.

### 4.4 Data / state contract deltas
If workflow needs new fields, statuses, filters, or queue rules:
- Current shape (from code)
- Proposed shape (minimal diff)
- Migration/fixture impact
- What stays local/session vs needs API later

### 4.5 UI composition plan
For each changed screen (list / form / detail / empty / hub):
- Layout intent (one job per section)
- Components to reuse from `modules/ui` / Mantine (prefer existing)
- Copy changes (labels only; no redundant help text)
- Progressive disclosure notes

Follow repo clean-UI rules (AGENTS.md) and GitLab Pajamas skill when relevant (`.cursor/skills/gitlab-pajamas`).

### 4.6 Integration sketch (only if path B or C)
- External system of record
- What we send / deep-link
- What we show locally
- Failure modes (unavailable, auth, permissions)
- Minimal first milestone (read-only link vs create webhook vs full sync)

### 4.7 Implementation sequence
Give a PR-sized sequence:
1. PR1: ...
2. PR2: ...
3. PR3: ...
Each PR must be independently reviewable and leave the app usable.

### 4.8 Definition of done for the iteration
Checklist covering UX, i18n keys if touched, tests, a11y basics, and “no demo limitation hidden from user”.

## Constraints
- Evidence over opinion; cite files.
- No speculative microservices or large rewrites.
- Prefer extending existing module patterns over new frameworks.
- Do not edit files in this pass.
- Keep final answer decision-oriented and scannable.
- If information is missing, list **blocking questions** (max 5) instead of guessing.
- Follow `.cursor/skills/nextjs-frontend` for file placement if recommending structure changes.

## Output format (strict)
1. Module snapshot (bullets)
2. Findings table: Finding | Severity | Evidence path
3. Alternatives table: Option | Steal-worthy pattern | Reject reason | Relevance (H/M/L)
4. Chosen path + 3-bullet rationale
5. Target workflow (numbered)
6. Backlog IMP-01… (full templates)
7. Data/state deltas
8. UI composition plan
9. PR sequence
10. DoD + blocking questions (if any)
```

---

## Fill examples

### projects (home / workspace entry)

```text
Module: projects
Primary users: mixed (employees browsing apps + continuing session work)
Hard constraints: Keycloak SSO; Next.js + Mantine; multi-app workspace; keep session kinds (bugs/help/features/feedback/guides/discussions); fixture/demo OK until API exists
Success metric: clearer project entry + faster resume of in-session work; less dead-end navigation
```

### Single intake module

```text
Module: bug-reports
Primary users: mixed
Hard constraints: Keycloak SSO; stay in portal; align with sibling modules (help, feature-requests, feedback, guides, discussions); fixture/demo OK until API exists
Success metric: faster complete bug intake + clearer triage queue
```

## After the plan

When ready to build, start a new agent turn with:

```text
Implement IMP-01…IMP-0N from the approved plan.
Follow `.cursor/skills/nextjs-frontend` and repo clean-UI rules.
Do not expand scope beyond those IMP items.
```
