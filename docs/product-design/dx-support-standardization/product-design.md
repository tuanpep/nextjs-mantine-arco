# DX Support workspace foundation and module redesign

Standard: product-design/1.3
Phase: shape
Profile: evaluation
Level: design-documents
Updated: 2026-10-30
Next gate: test solutions
Decision owner: unknown
Approval: proposed

## Recommendation

Proposed: organize project work into purpose-based Support, Feedback, Ideas and UAT modules with a common interaction structure. Keep domain-specific lifecycles. Support requesters remain the first evaluation priority; the broader map responds to the latest redesign request. Shape is authorized, not investment, implementation or launch. Decision owner remains unknown.

The proposed, reversible first-study purpose is comprehension and reported current context, not human acceptance or comparative superiority. C1/C3 can investigate comprehension and reported value, but cannot isolate taxonomy effects from clearer labels or completed recording. U5's improvement hypothesis stays untested; comparative commitment needs equivalent alternative task evidence and actual context.

Evaluate a minimal configuration foundation before expanding module features. Workspace currently means navigation across projects, not a proven organization or tenant. Requester-first/demo-first remains unchanged. Product ownership of defaults is proposed; the accountable person and security authority are unknown.

First clarify reusable references and ownership, then evaluate limited settings, then module expansion. This proposes no live catalog management. Not every dropdown should be editable.

Clarify task roles and handoffs alongside that foundation. The actor/use-case model below is a conceptual Shape proposal, not staffing, access design or authorization to build.

Predictable structure wins over identical states. Apply “Behave predictably and recoverably”: the same action means the same thing unless the task requires a difference. The cost is less visual and label uniformity. “See the whole service, then do less” bounds scope rather than demanding feature parity, roadmap or integrations. No formal ISO conformance is claimed. Reverse the recommendation if actual cases or evaluation show modules are indistinguishable or existing channels work better; narrow to language/help changes instead of defending the taxonomy.

## Problem and outcome

The user first requested research/refinement/standardization, choosing "Support requester" and "Both, demo first". The latest request, "re design the modules, features in each modules to more clear and consistance", opens Shape. These preferences do not validate demand. No incident, baseline or accountable owner was supplied.

Support currently follows Describe → Review → Done → View request → reply, retest or reopen. Feedback/Ideas confirmation does not establish a newly findable record in the inspected source. Actual user friction remains unknown. Proposed user outcome: correct project/intent selection, a findable same-session submission and understandable next action. Proposed service outcome: fewer avoidable clarification loops. No baseline, target or benefit is measured or guaranteed.

A Vietnamese-preferring requester returning to an older request, uncertain who acts next and possibly needing keyboard or assistive support, remains a proposed recruitment case, not an observed persona.

## Evidence and unknowns

Evidence date: 2026-10-30. Repository target and clean baseline at commit `b390577` are Given by the primary. Method: delegated static route/model/documentation/test-definition inspection, with author checks of README, provider and test locations. That earlier snapshot included no verified external research. Later external document guidance is recorded in E27. No deployment, backend, runtime or participant validation was verified. Authored tests were not executed.

| ID / label | Evidence and source |
| --- | --- |
| E1 Given | User request and interview preferences above, supplied by primary. Target is assumed to be this repository; no incident, metrics or owner supplied. |
| E2 Observed static source | `README.md:3-5,76-80`: project-workspace MVP, fictional resettable records, Keycloak SSO, no live intake/notifications/access provisioning, sensitive-data prohibition and unresolved operational policies. SSO is not evidence of feature permissions. |
| E3 Observed static source | `README.md:15-29`; `lib/i18n/config.ts:1-12`: vi/en shell, default vi; feature English documented and present in selected source. Complete desired language coverage is unknown. |
| E4 Observed static source | `modules/projects/lib/applications.ts:1-26`: two demo projects. `README.md:57-62` describes section-preserving switching and references absent `docs/product-design/project-workspace-mvp/`. Given baseline has no tracked docs; absence does not establish deletion. Do not reconstruct that design. |
| E5 Observed static source | `modules/support/components/support-collection.tsx:50-70,85-109`; `support-form.tsx:179-265,331-376` in the same directory; `modules/support/lib/intake-fields.ts:28-92,112-199`: project-scoped entry, review/confirmation, type-specific required information and simulated attachments. |
| E6 Observed static source | `modules/support/components/support-details.tsx:51-176,300-332,376-429`; `modules/support/lib/support-state.ts:86-118`: unavailable mismatched requests, next actor, replies/retests/reopening, current and superseded outcomes. `modules/support/components/support-provider.tsx:27-55` keeps fixture-backed React state, not durable records. |
| E7 Observed static source | `modules/feedback/lib/fixtures.ts:1-13`; `modules/feedback/components/feedback-details.tsx:94-133`: Not reviewed/Acknowledged/Needs clarification/Noted dispositions and local review notice. `modules/uat/model.ts:1-20,77-149`; `modules/uat/components/uat-screen.tsx:108-110`: scenario Not run/Pass/Fail/Blocked differs from defect Open/Retesting/Resolved; not release approval. |
| E8 Observed static source | `app/(workspace)/projects/[projectId]/ideas/page.tsx:28-35` activates `IdeasScreen`; `modules/projects/components/ideas-screen.tsx:52-65,150-164` has local-state voting, contradicting `README.md:70` "no votes". No durable vote or identity guarantee follows. |
| E9 Observed static source | `modules/projects/components/project-settings.tsx:135-143,162-172,215-219`: named people confer no access/duty; archive disabled. `modules/support/components/support-flow.test.tsx:23-174` authors scope, confirmation, intake, reply, retest and history scenarios; `e2e/i18n.spec.ts:3-83` authors locale scenarios. Definitions are not passing results. |
| E10 Inferred | E5–E7 suggest next-action comprehension is worth investigating. No requester evidence validates its priority. |
| E11 Given | Latest redesign request quoted above authorizes Shape through design documents, not build. Prior requester-first/demo-first preferences remain. |
| E12 Observed static source | Focused inspection: `modules/feedback/components/feedback-collection.tsx:29-42,115-130`, `feedback-form.tsx:21-32,64-70`, `feedback-details.tsx:38-42,114-130` show collection/search/views/detail, notice-only creation and local disposition. `modules/projects/components/ideas-screen.tsx:27-63,80-110,148-158`, `ideas-form.tsx:24-38,72-73` show fixture-backed search/views/votes, title/problem/outcome and optional suggestion/sponsor, and demo confirmation without list insertion. Inspected Ideas route inventory has collection/new only; no detail route or comments were found in that inventory/screen/form. `project-hub.tsx:27-51` has primary bug entry and question/feedback/ideas/UAT shortcuts; `workspace-shell.tsx:151-166` exposes four modules; `project-settings.tsx:49-69` names handlers/reviewers/coordinator, not authority. `modules/uat/components/uat-screen.tsx:41-66,159-222,251-260,317-350` shows one locally seeded campaign, scenario results, defect entry and retest; no Support conversion was found in the inspected UI. These are bounded source observations, not runtime verification. |
| E13 Inferred | E12 suggests incomplete observable demo outcomes for creation/revisit, not evidence that users are confused. |
| E14 Given | Latest request, "thinking about the project workspace, configuration foundation", authorizes bounded conceptual Shape refinement, not Specify or build. |
| E15 Observed static source | Same snapshot: `modules/projects/lib/applications.ts:1-7,11-26,42-48,65-71` defines two projects with id/name/initials/owner/description and section-preserving switching. Under `modules/projects/components/`, `workspace-shell.tsx:53-56,126-140,261-306,345-444,447-452` provides shared navigation, project context and language control/error; `home-screen.tsx:23-56` and `project-hub.tsx:56-65,74-82` present registry context and unavailable IDs. `project-settings.tsx:44-54,91-104` shows disabled name/registry owner; `106-144,214-219` has local responsibility fields and notice-only save, no duty/access; `64-70,146-160` derives missing references from blank names; `162-172` disables archive. E3 and `README.md:20-24` describe locale cookie behavior, not project configuration persistence. No runtime/tests ran. |
| E16 Inferred | Registry owner and editable local references may be mistaken for shared authority; configuration scopes may be confused. This is a risk hypothesis, not observed user pain. |
| E17 Given | Latest request, "thinking the master data, settings", continues conceptual foundation refinement within Shape, not generic CRUD implementation. |
| E18 Observed static source | Primary-supplied focused inventory: `modules/projects/lib/applications.ts:1-26` contains two hardcoded projects, not proof of service/global/tenant scope; author rechecked that range. `modules/support/lib/request-catalog.ts:1-22,53-61` defines four types and a Broken fallback for unknown/missing type; `intake-fields.ts:28-92,107-200,309-345` in that directory makes visibility/requiredness type-dependent. `priority.ts:1-20,45-69` defines impact/urgency/priority and a demo matrix needing production-owner confirmation. `modules/feedback/lib/fixtures.ts:1-13,15-49` separates typed dispositions from sample records; `modules/uat/model.ts:1-20,22-62,112-143` separates scenario/defect values and guards from a seeded campaign. `modules/projects/components/project-settings.tsx:49-53,64-70` supplies names/blank-reference gaps, not an identity directory. No runtime, tests or backend verification. |
| E19 Inferred | An editable list alone cannot safely represent behavioral rules. E18 supports investigating that distinction, not a claim of user pain. |
| E20 Given | User request, "thinking to define actors, use cases for all actors", authorizes actor/use-case refinement of the existing Shape proposal, not Specify or build. |
| E21 Observed static source | Primary-supplied focused research: `modules/support/lib/support-state.ts:16-21,68-118` models sender reply/retest/reopen/CSAT; `modules/support/components/support-handler-triage.tsx:50-101,115-125` renders needs-info, duplicate, engineering reference, workaround and misroute actions, sometimes assigning Demo DX operator first. `support-state.ts:142-168` in the same lib directory has broader route/assign/set-priority/update/clarify/retest/resolve vocabulary, not proof all actions render. `modules/feedback/components/feedback-details.tsx:94-133` has disposition/reason acknowledgement, not commitment or contributor response. `modules/projects/components/ideas-screen.tsx:36-65,77-103,146-165` has local votes/suggest, no reviewer controls there. `modules/uat/components/uat-screen.tsx:108-127,202-224,249-303,345-378` has result, defect, retest and resolution after linked Pass; Demo coordinator is not a separate actor gate or release approver. No new runtime or authorization-enforcement inspection. |
| E22 Inferred | Task-role distinctions may clarify handoffs; actual staffing and separation of duties are unconfirmed. |
| E23 Given | Latest user request, "thinking about the discussion feature in a request/ticket/issue", continues Shape discussion refinement, not build authorization. |
| E24 Observed static source | Primary-supplied bounded inspection: `modules/support/lib/fixtures.ts:53-64` defines conversation entries with author/text only. `modules/support/components/support-details.tsx:335-373` renders a flat author/text array without shown time, thread or event kind; `300-332` separates outcomes; `73-116,376-427` supplies status-dependent Add update comment, Send reply when Waiting for sender, Confirm retest when Waiting for retest, and Reopen when Resolved. `modules/support/lib/support-state.ts:68-118` trims/validates text; comments leave status/responsibility unchanged, while reply/retest/reopen return Handling with next handler and reopening supersedes outcomes. `171-189,230-292` also puts handler operational text in conversation; `295-315,437-469` handles information/retest waits; `192-227` records resolution outcome plus message. `modules/support/components/support-handler-triage.tsx:50-113,115-217` requires disposition notes. Details `247-269` shows intake attachments only; fixture `53-64` and state `16-21,142-156` show no message/action attachments. No timestamps, editing, private notes, mentions or subscriptions appear in this inspected model/UI, not a repository-wide absence finding. Fixture sender labels at `6-7` and demo operator text in state `268-290` are strings, not authenticated authors. No runtime, tests or permission-enforcement inspection. |
| E25 Inferred | Mixed conversation and workflow text may obscure what was said versus what officially changed. E24 does not establish observed user confusion. |
| E26 Observed document audit | 2026-10-30, static read-only audit of this brief and Test Plan in this conversation, supplied by the primary. F1: C7's assignment-default task mismatched the initial reference-only boundary. F2: C1/C3 comprehension and reported-context methods could not establish U5 comparative improvement. F3: claimed Support coverage exceeded C2's follow-up-only procedure, omitting intake/review/confirmation. Static scoped recheck confirmed F1–F3 addressed and found R1 sequence ambiguity between the early comprehension pilot and later foundation rounds. Author correction applied. Parent static consistency check confirmed the corrected sequence agrees with the Evaluation plan and retained gates. No runtime or participant proof, R1 reviewer approval or whole-package approval. |
| E27 Observed external guidance | Primary-supplied document research, retrieved 2026-10-30, from the five linked primary sources below. Guidance implications only, not validation of DX demand, taxonomy, policy, enforcement or conformance. |

E27 sources: [GOV.UK learning user needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs) informs evidence-based needs; [GOV.UK alpha](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works) informs investigation of riskiest assumptions; [W3C error identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) informs error text; [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) distinguishes authentication from authorization; [GOV.UK Data ownership model](https://www.gov.uk/government/publications/data-ownership-in-government/data-ownership-model) informs accountable reference lifecycle decisions. These are guideline implications, not evidence of local implementation or accepted operational rules.

Content baseline: English document wording is proposed from the request language. E3 owns observed languages. Consistent vi/en labels, help, errors and outcomes across each in-scope journey are a proposed target, not approved translation coverage; U3 remains open.

| ID | Consequence and blocking boundary | Resolution, owner and review trigger |
| --- | --- | --- |
| U1 Unknown | Actual requester case/pain; E1/E10 hypothesis untested. Shape is authorized despite this gap; blocks validated priority, not safe exploration. | Seek deidentified recent intake/follow-up account and current channel. Owner unknown; proposed requester plus service lead. Review before redesign commitment. |
| U2 Unknown | Permissions, responsible service owner, hours, escalation, retention and real-data policies; E2/E9. Unresolved dependency blocks live readiness and sensitive-data exposure, not demo analysis. Likelihood unknown. | Obtain attributed policy from accountable owners, currently unknown. Make no real-data/provisioning promises; keep demo-only if unresolved. U11 applies this authority/content-handling dependency to discussion without replacing this definition. Review before live scope/testing. |
| U3 Unknown | Target locale/access needs and support expectations; E3. Blocks a guaranteed inclusive live experience. | Investigate actual users, access needs and comprehension. Owner unknown; proposed product/research owner. Review before inclusive-experience claims or live scope. No conformance claim. |
| U4 Observed discrepancy; intended truth Unknown | E8 voting contradicts README. Proposed secondary local demo toggle is not an accepted product-truth decision. | Owner unknown; proposed product owner accepts intent, then separately authorizes source/README reconciliation. Review before capability claims. Nothing outside documents is corrected. |
| U5 Untested assumption | Purpose-based modules plus common patterns improve classification/findability, E11–E13. Changes redesign selection; blocks confident commitment, not safe exploration. | Owner unknown; proposed product lead. [C1/C3](test-plan.md#test-cases) investigate comprehension and reported value/current context only. They cannot isolate taxonomy effects from clearer labels or completed recording, or establish improvement over alternatives. The original improvement hypothesis remains untested. Qualitative weaken/reverse criteria inform narrowing or reassessment, not automatic superiority or demand. Comparative commitment remains blocked without equivalent alternative task evidence and actual context; review before design investment. |
| U6 Untested assumption | Navigation across projects is sufficient workspace scope. Blocks tenant/organization feature design, not minimal safe foundation evaluation. | Owner unknown; proposed product lead. Compare actual multi-project administrator/account context in C6 before introducing tenancy, workspace creation or membership. |
| U7 Unknown | Who edits/approves identity/defaults; catalog ownership, authoritative source, scope and usage impact; historical rename/retirement effects on pending work, defaults and existing records. Related policies remain in U2. Blocks live/shared changes and destructive controls, disabling/archive/membership/custom rules, not fictional evaluation. Likelihood unknown. | Owners unknown; proposed product/service/security owners. Obtain attributed authority and change-effect decisions through C5/C6/C7 before such controls. Fallback is read-only references/demo-only settings, no sharing or policy configuration; safety is not resolved. |
| U8 Untested assumption | Actual need to maintain catalogs rather than use a static registry or approved existing directory. Blocks investment in master administration, not safe conceptual exploration. | Owner unknown; proposed product owner. Use C7's neutral real maintenance account before CRUD/retirement controls. If adequate, keep read-only references/reuse the existing directory; without comparable evidence, need stays unverified. |
| U9 Untested assumption | Actor split matches the actual operating model, E20–E22. Blocks validated staffing/access design, not conceptual evaluation. Likelihood unknown. | Owner unknown; proposed product/service leads. Seek recent task/handoff accounts through C8 and authority evidence through C5. Review before role-based capabilities or live use. If unsupported, combine task facets without new accounts; no low-risk claim. U2 owns visibility/action authority and U7 owns configuration authority. |
| U10 Untested assumption | Distinguishing discussion, activity and outcome, with flat context, helps follow-up; E23–E25. Blocks a validated discussion approach, not fictional evaluation. | Owner unknown; proposed product/service lead. Use C9 before discussion commitment; narrow to labels or existing channels if sufficient, reconsider threading only with evidence. |
| U11 Unresolved dependency | Discussion eligibility/audience, internal audience, edit/delete, retention/redaction, notification and evidence-handling authority remain unknown under U2. Blocks internal notes, live collaboration, real attachments and moderation promises. Likelihood unknown. | Owners unknown; proposed service/security/privacy authorities ACT-12/13. C5 seeks attributed decisions; C9 tests comprehension, not safety. Fallback is a fictional participant-visible demo thread, no sensitive data or live messages, not a safety finding. If sensitive disclosure occurs, stop, avoid capture and require approved handling without inventing a support channel. Review before real collaboration or visibility controls; no default timeframe. |

## Needs and requirements

All needs are inferred/provisional, not validated requirements.

| ID | Need | Source |
| --- | --- | --- |
| N1 | Recognize correct project context and appropriate intake type. | E4–E5 |
| N2 | Understand required information and what confirmation means. | E5 |
| N3 | Understand next actor/action; distinguish reply, retest, resolution and reopening. | E6–E7, E10 |
| N4 | Understand persistence/evidence-handling limits and access needs. | E2–E3, E5–E6, U3 |
| N5 | Classify task intent consistently across modules. Proposed. | E11–E12 |
| N6 | Find and revisit one's submission in the same demo session. Provisional, not proven demand. | E12–E13 |
| N7 | Recognize project identity and configuration scope before editing. Provisional. | E14–E16 |
| N8 | Understand missing setup versus what is saved/effective. Provisional. | E14–E16 |
| N9 | Distinguish responsibility reference, actual permission and personal preference. Provisional. | E14–E16 |
| N10 | Understand and reuse the correct reference without confusing reference changes, behavior changes and individual work. Provisional. | E17–E19 |
| N11 | Know which task role owns an action or handoff, without confusing duty with authority. Provisional. | E20–E22 |
| N12 | Understand what was said versus what officially changed, and how to respond in context. Provisional. | E23–E25 |
| N13 | Know audience, attribution and local saved-state limits before posting. Provisional. | E23–E25 |

Binding for this demo under `README.md:5,59,74`: no real/confidential data, no provisioning promise, and UAT is not release approval. No exception is supplied. Distinct lifecycle terms are a documented baseline to preserve pending owner decision, not externally binding legal policy. E1 priorities remain preferences, not operational rules.

Working vocabulary only: project registry means demo project context; Support request means the support record; requester maps to current "Sender" wording and technical `nextActor` value `Sender`. A named handler is an individual, not proof of responsible-team authority. Feedback disposition differs from support status. Ideas position/vote is local. UAT scenario result is evidence, not release approval. Sources E4–E9 own these current meanings; no exhaustive domain model is proposed.

## Options

| Option | Benefit and cost | Proposed judgment |
| --- | --- | --- |
| Current product/no build | No development; retains present confirmation/findability gaps and uneven flows. | Credible baseline if actual cases favor existing channels. |
| Terminology, help and process/docs only | Less development; clarifies boundaries without changing record behavior. Does not make new Feedback/Ideas records findable. | Prefer if evaluation finds language is the actual problem. |
| Purpose-based modules, shared patterns | Consistent wayfinding/action meaning while preserving resolution, disposition and scenario evidence. Requires completing some journeys. | Recommended balance, pending U1/U5. |
| One queue, type and status model | Simpler common search; harder to express UAT evidence without misrepresenting completion. | Not recommended unless tasks prove indistinguishable. |

Demand is unvalidated and cost estimates are unknown. This comparison is not an investment case.

For discussion, compare the current mixed flat text/no build, small category labels plus clearer current outcome, meaningful flat discussion with distinct activity/outcome history, and fully threaded collaboration. Recommend flat context first, pending C9, without choosing a physical layout. Threads, mentions and internal notes add cost and unresolved privacy questions without demonstrated need. Investigate recent confusion before commitment; simple labels or an existing channel may suffice.

For configuration, compare static registry/docs-only, minimum scoped configuration and full workspace administration/customization. Recommend the minimum: reuse existing references/directories and governed fixed choices before limited settings. Configurable-everything adds ownership and change-impact burden without verified demand. Static references may suffice. Custom permissions/workflows/tenancy need evidence; reopen the affected premise if actual organization needs demand tenant scope rather than silently extending this proposal.

## Product experience

For the proposed sitemap, screen hierarchy, end-to-end user journeys, handoffs and recovery paths, see [Sitemap, user journeys and UI flows](ux-flows.md). This companion elaborates the Shape proposal for evaluation; module/lifecycle boundaries and authority dependencies remain owned here. It is not evidence of working functionality or approval to build.

All following changes are proposed, not runtime claims. This table owns the module boundaries and feature map.

| Module | Job | Included core features | Excluded/deferred | Meaningful completion and next actor |
| --- | --- | --- | --- | --- |
| Support | Get help, an answer, a fix or requested access. | Project queue/search; Open/Closed and explicit needs-requester-action view; new Broken/Question/Access/Other request; type-specific information, review/confirm; findable list/detail, progress/history, reply, retest and reopen. Separate handler triage context from requester actions. Discussion proposal is owned by [Ticket discussion and history](#ticket-discussion-and-history). | SLA/live escalation, full engineering tracker and identity integration. Access requests never grant accounts. | Request is locally findable; current resolution and superseded outcomes remain explicit. Show requester/handler next action separately from status. Retest is not resolution. |
| Feedback | Share observed experience without requiring personal issue resolution. | List/search/disposition views; observation/context, review/confirm; same-session findable record/detail/history; reviewer disposition, reason and next-step explanation. Bounded clarification in the same record is proposed. | Votes, live chat, automatic Support resolution and delivery commitment. | Record can be revisited; Not reviewed/Acknowledged/Needs clarification/Noted remain dispositions, not promises of change. Reviewer context is demo-only pending U2. |
| Ideas | Suggest a beneficial change. | List/search/existing views; problem/outcome, optional suggestion/sponsor; review/confirm and same-session findable detail; position/reason/next-review explanation. Secondary, explicitly local demo vote toggle only. | Comments/collaboration, roadmap, sponsor provisioning, notifications; no promised review dates, unique-user voting, ranking or priority guarantees. | Recorded idea and existing fixture position semantics can be explained; no formal approval invented. Position/reviewer context is not a delivery commitment. |
| UAT | Execute a defined campaign and retain scenario evidence. | Existing seeded campaign context; scenario instructions, Not run/Pass/Fail/Blocked; evidence note/defect link to that scenario, defect log, retest and resolution when scenario is Pass; explain progress source and local-reset boundary. | Campaign builder/scheduling, automatic Support ticket and release acceptance. | Scenario evidence and defect Open/Retesting/Resolved stay distinct. Fail/Blocked is not Support resolution; coordinator label grants no authority. |

Global Home selects a project; current switching preserves the selected section. Project Overview is navigation/context, not a fifth intake module. Propose balanced intent-based entries with Support primary for this requester-first evaluation and an opportunity to change a mistaken entry before submission. Settings is a separate manager setup task. Names are demo context, never membership or access grants; archive remains blocked.

Support's proposed Other label maps provisionally to technical `general`; Broken/Question/Access retain their current meanings. Prefer requester to current Sender in user-facing language without claiming a runtime rename. Preserve lifecycle vocabulary instead of forcing a shared status enum.

### Ticket discussion and history

Propose discussion inside a Support request's history, not standalone global chat. "Request" remains the user-facing Support term; ticket and issue are conversational synonyms, not new record types or a universal cross-module issue. This first scope is Support only. Feedback clarification keeps its existing proposal; UAT result notes have a different purpose. Nothing automatically rolls out to Ideas or external engineering systems.

The aim is to answer "What was said, what changed, and what should I do next?" E24 shows a flat conversation containing both human text and operational explanations, with outcomes separately shown. E25 is a hypothesis about comprehension, not a user finding. The proposal separates meanings, not canonical record sources or a technical event schema:

- Discussion contains human questions, answers and context. It does not itself change the request's workflow.
- Activity explains an explicit action, its effect or meaningful before/after change, with actor attribution and time only when actually known.
- Official outcome shows the current or superseded result from the owning Support workflow/history. That workflow remains authoritative; discussion does not redefine it.

A readable chronological narrative or separated presentation may work. No tabs or screen layout are prescribed. Make order intelligible and identify each entry's category and attribution source. Distinguish an actual person, system text and demo label. Do not turn fixture ordering into authoritative time, invent legacy timestamps or imply verified identity from an author string. Unknown author/time stays unknown. Where real dates exist, give understandable locale/timezone context. This is not a durable audit claim.

| First scope | Proposed behavior and boundary |
| --- | --- |
| Read request context | Read history, the relevant question, latest outcome and next action within the permitted request. Participant-visible means permitted request participants, not the internet, all employees or everyone in a project. U2/U11 eligibility remains unresolved. No global/cross-project room, audience selector or internal-note switch. Fictional demo labels do not authenticate anyone. |
| Add context on active requests | Eligible ACT-02 requester or ACT-03 handler can propose a nonblank plain-text message after reviewing audience, project and request context. No rich-text expansion. Requester update comments are observed; a general handler participant reply is proposed, not established by current triage notes. Ordinary messages leave status, owner, next actor and outcome unchanged, regardless of keywords or message count. No urgency, SLA or delivery implication. |
| Respond to a workflow question | Waiting for sender requires explicit UC-06 reply to return the next action to the handler, not an ordinary comment. Retest uses UC-07's actual Support Pass/Fail/Unable selection, not a conclusion inferred from prose. Request-info and other handoffs remain explicit actions with explanation and relevant message context. |
| Return after resolution | Initially read resolved discussion without adding messages until explicit UC-08 reopening with its required reason. Do not hide reopening or automatically reopen on a message. Handler changes to resolved work also require an explicit workflow action and established authority, not a discussion bypass. |
| Keep context simple | Start with one flat conversation. Add an explicit in-message quote/context reference only if evaluation shows a need, within the permitted record and fictional material. No nested threads or capability to copy restricted internal text is implied. |
| Submit and recover | Reject blank/whitespace-only text; preserve unsent text after known validation failure. Claim local confirmation only once visible in the same request/session, never durable storage, delivery or reading. For uncertain submission, inspect one's visible local history before retry when the outcome is determinable. Otherwise state uncertainty, not failure or "nothing saved"; do not encourage blind duplicate posting or promise deduplication. Leaving the request/project requires intentional unsaved discard, never text carried into another record. In-memory reset limits remain explicit. |

ACT-02 and ACT-03 remain the primary roles; this adds no actor. ACT-01 does not automatically gain request access. ACT-14 remains an external collaborator, with no access, delivery or notification from a mentioned name or engineering reference. Responsibility references never grant eligibility.

Defer internal/private notes until an audience model is explicitly agreed and enforced in a separately authorized implementation. A disabled switch would not prove protection. Also defer mentions, watchers/subscriptions, notifications, read receipts, presence/realtime, discussion uploads, reactions, nested threads, moderation and full-text search. A future notification never grants participant permission. Real attachments depend on U11 rather than the intake attachment illustration.

Initially propose no user edit/delete of posted messages. Correct context with a new message so readers can follow the correction. This user-facing append-only proposal is neither immutable storage nor a legal/audit promise. It cannot solve sensitive-data deletion or redaction; retention/redaction authority remains unresolved and blocks dependent live scope. Do not invent an administrator redaction use case.

"Protect before enable" favors deferring hidden audiences and delivery/privacy promises over convenient assumptions. The harms to avoid are accidental disclosure and false belief that a message changed official status. Keep slower explicit workflow actions and owner review. "Behave predictably" favors consistent comment meanings over one convenient all-action send box. "See the whole service, then do less" excludes a new chat service. None of these choices establishes safety or formal standards conformance. C9 may narrow or reverse this proposal before feature commitment.

### Actors and use cases

This subsection owns the bounded actor/use-case model. Actors are task roles, not job titles or grants. One person may hold several facets without separate accounts. The demo surfaces actions without enforced role separation. Every real use case needs separately established permitted project/record scope and eligible-action authority under U2, neither validated here. Participation never implies access to every project. Use fictional data only; demo names are references, not duty assignments.

Coverage is complete for the 15 named current/proposed actors below, not validated coverage of a real organization. External authority work is outside product features. No super admin, membership management, approval engine or extra console is implied.

| ID | Actor | Goal and scope | Evidence status and boundary |
| --- | --- | --- | --- |
| ACT-01 | Workspace participant | Find a permitted project, choose a task, set personal locale, handle unavailable paths. | Common facet; observed shell E3/E15, not record permissions. |
| ACT-02 | Support requester | Submit and follow up own/contextually permitted requests; reply, retest, reopen. | Current demo E5/E6; no provisioning rights. |
| ACT-03 | Support handler | Triage, progress work and explain outcomes. | Selected rendered actions/model E21; broader routing/assignment/resolution not all verified UI. Demo assignment is not authority. |
| ACT-04 | Feedback contributor | Submit observation/context; revisit and answer clarification. | Submission observed; complete revisit/response proposed, absent inspected detail E12/E21. No Support SLA. |
| ACT-05 | Feedback reviewer | Explain disposition/reason and request clarification. | Current local notice E21; durable review not established. |
| ACT-06 | Ideas contributor/supporter | Propose problem/outcome and express interest; revisit. | Same actor's task facets. Local votes observed; revisit proposed. No unique-voter or roadmap guarantee. |
| ACT-07 | Ideas reviewer | Explain position, reason and next review step. | Proposed; no reviewer controls in inspected screen E21, no roadmap authority. |
| ACT-08 | UAT tester | Execute seeded defined scenarios, record results/notes/defects and retest. | Current local UI E21; no live campaign enrollment. |
| ACT-09 | UAT coordinator | Interpret campaign evidence, review retest/resolution after Pass and explain pending ownership. | Proposed task distinction over seeded flow; no separate coordinator gate, campaign builder or release acceptance. |
| ACT-10 | Project configuration maintainer | Understand setup; review harmless local reference change/cancel/scope effect. | Proposed; current save notice-only E15. Appointment unknown U7; no access administration. |
| ACT-11 | Reference-data custodian | Assess source, rename/retirement and usage impact. | Conditional external future governance U7/U8. Initial registry read-only; may be existing directory steward, not a new app account. |
| ACT-12 | Product/service decision authority | Decide service ownership, vocabulary, priority/capacity, change effect and product intent. | External human role proposed; actual owner unknown U2/U4/U7. No product approval feature. |
| ACT-13 | Identity/security/privacy authority | Decide identity, visibility and data-handling matters in approved systems. | External human authority proposed, unknown U2; no product access-granting/security-admin role. |
| ACT-14 | Engineering collaborator | Investigate/fix technical issues and return evidence through an existing channel. | External handoff proposed; engineering reference observed E21 is not integration, assignment or notification. May overlap handler. |
| ACT-15 | Identity provider | Supply the described SSO sign-in outcome. | External system Keycloak E2; not workspace authorization. No technical contract/auth changes. |

The catalog names goals and triggers for evaluation, not contractual requirements. Status separates static demo evidence, model vocabulary, proposals and external decisions. Mixed rows state the gap. All scope prerequisites above apply to each row. No tracker or notification bot is an implemented actor.

| ID | Primary; supporting actors | Goal and trigger | Expected outcome, exception and status |
| --- | --- | --- | --- |
| UC-01 | ACT-01; ACT-15 | Enter portal with configured identity. | Described SSO E2, not executed. Authenticated shell or explicit failure/no fallback identity is the evaluation target; no permission implied. |
| UC-02 | ACT-01 | Find/select/switch project section. | Registry switching observed E15; unknown/inaccessible stays unavailable without disclosure. Unsaved-switch recovery proposed; U2 unresolved. |
| UC-03 | ACT-01 | Change personal vi/en language. | Observed shell E3/E15, no session tested. Explicit failure, not project-wide mutation; full coverage unresolved U3. |
| UC-04 | ACT-02 | Submit project/type details after review. | Observed demo E5: confirm locally findable request; back-to-edit before confirmation. Required-detail gaps prevent completion; reset/no live intake or actual upload. |
| UC-05 | ACT-02 | Inspect progress/outcome/next action. | Observed demo E6; unknown/mismatched record unavailable. Proposed category/history reading follows [Ticket discussion and history](#ticket-discussion-and-history); scope unresolved, not universal visibility. |
| UC-06 | ACT-02; ACT-03 | Reply with requested information. | Observed demo E6: next handler action, not resolution; blank reply validation. Explicit typed reply, not generic discussion, as distinguished in Ticket discussion and history. |
| UC-07 | ACT-02; ACT-03 | Retest a Support outcome. | Observed demo E6: Pass/Fail/Unable with applicable notes; no automatic resolution or UAT acceptance. Ticket discussion and history distinguishes the explicit result from prose. |
| UC-08 | ACT-02; ACT-03 | Reopen resolved request with reason. | Observed demo E6: prior outcome/history retained, not silently wiped; missing reason prevents completion. Ticket discussion and history keeps reopening explicit, not triggered by a comment. |
| UC-09 | ACT-03; ACT-02/ACT-14 | Triage incoming Support work. | Observed demo E21: needs-info, duplicate, workaround, misroute or engineering reference has its own outcome; not every action resolves or creates a shared channel. Ticket discussion and history distinguishes action explanation from ordinary discussion. |
| UC-10 | ACT-03 | Establish ownership/priority, progress and resolve. | Model only plus proposed target E21, not complete verified UI. Current/superseded official outcomes retained in model; missing duty authority U2 excludes live action, no SLA. |
| UC-11 | ACT-04 | Submit observation, confirm and revisit. | Mixed E12: form confirmation observed, no inserted record. Complete same-session revisit proposed; notice alone is insufficient and promises no change. |
| UC-12 | ACT-05; ACT-04 | Review disposition/reason or seek clarification. | Mixed E21: local notice observed; meaningful saved/revisited review proposed. No automatic Support conversion or commitment. |
| UC-13 | ACT-04; ACT-05 | Answer Feedback clarification. | Proposed, absent inspected response UI. Continue same-record review, not declare a resolved Support issue. |
| UC-14 | ACT-06 | Propose problem/outcome and revisit idea. | Mixed E12: optional suggestion/sponsor and notice observed, no created record/detail. Completed path proposed; notice is not recording. |
| UC-15 | ACT-06 | Toggle interest in an existing idea. | Observed local demo E8/E21; no identity, ranking or approval guarantee. Product intent unresolved U4. |
| UC-16 | ACT-07; ACT-06 | Explain idea position/reason/next review. | Proposed, no inspected reviewer controls. Uncertain next step stays explicit; no promised review date/delivery. |
| UC-17 | ACT-08; ACT-09 | Open defined campaign/scenario and record result/note. | Observed seeded demo E21; resettable evidence, not approval. Missing evidence is not a Pass. |
| UC-18 | ACT-08; ACT-09 | Record scenario-linked defect on Fail/Blocked. | Observed demo E21: linked defect/note, no automatic Support ticket. Scenario and defect outcomes stay distinct. |
| UC-19 | ACT-08; ACT-09 | Retest a UAT scenario. | Observed local UI E21: Not run/Pass/Fail/Blocked, not Support Unable. Defect stays unresolved until permitted resolution. |
| UC-20 | ACT-09; ACT-08 | Inspect campaign/defect evidence and resolve after linked Pass. | Mixed E21: actions rendered without separate actor gate; coordinator ownership proposed. No Pass means no resolution; never release acceptance. |
| UC-21 | ACT-10 | Inspect project identity/setup gaps/references. | Observed demo E15: nonempty names are not readiness; no identity or permission edit. |
| UC-22 | ACT-10 | Review/apply/cancel harmless responsibility reference. | Proposed same-session change and unsaved-exit recovery; current save notice-only. No duty, automatic assignment of new or active work, access or notifications. |
| UC-23 | ACT-11; ACT-10/ACT-12 | Assess catalog source/rename/retirement usage and history effects. | Conditional external governance, initial references read-only. Unresolved U7/U8 leaves delete/merge/archive unavailable, work preserved. |
| UC-24 | ACT-12; ACT-03/ACT-05/ACT-07/ACT-09/ACT-10 | Decide service duties, vocabulary/priority, vote intent and change effect. | External decision proposed, outside app. Seek attribution under U2/U4/U7, not claim an existing approval. |
| UC-25 | ACT-13; ACT-12 | Assess identity/visibility/data/access policy. | External decision through approved systems U2. Unresolved policy stays unresolved; product neither provisions nor grants access. |
| UC-26 | ACT-14; ACT-03 | Investigate technical issue and return fix evidence. | External manual handoff proposed; reference field is not delivery/integration. Unavailable channel stays unresolved; returned evidence does not auto-resolve Support. |
| UC-27 | ACT-02; ACT-03 | Add contextual update to active request when information arises. | Requester comment observed E24; common discussion semantics proposed in Ticket discussion and history. Eligible scope required; blank rejected, uncertain/local saved limits explicit, no implicit lifecycle change. |
| UC-28 | ACT-03; ACT-02 | Post participant-visible response when answering in context. | General handler reply proposed; only selected triage explanations observed E24. U2/U11 audience gate applies; ordinary response is not request-info or another workflow action. |
| UC-29 | ACT-02/ACT-03 | Interpret and correct discussion context when reviewing history. | Proposed category/outcome reading and new-message correction, no silent edit. Optional permitted-record reference, no invented author/time. Resolved history stays read-only until UC-08; see Ticket discussion and history. |

Selective planned coverage links, not an SRS matrix or all-functionality evaluation: C1 covers classification for N1/N5. C2 covers Support intake/review/confirmation and selected follow-up for N1–N4, UC-04–08. C8/C9 cover selected UC-09/10 outcome and handoff meanings only where represented, not comprehensive handler UI evaluation; full handler action validation is outside the first study. UC-01–03 address N1/N4/N9 through C4/C6; UC-11–16 address N5/N6 through C1/C3; UC-17–20 address N3–N5 through C1/C8; UC-21–23 address N7–N10 through C6/C7. UC-24–26 and all handoffs address N3/N9/N11 through C5/C8. Each actor appears in the catalog; that establishes document coverage only. C8 tests whether to merge, exclude or defer unsupported facets before role-based capabilities.

The catalog now extends through UC-29 with the same 15 actors. UC-05–09/27–29 address N3/N12/N13 through C9; U11 authority questions also require C5. No general permission for all participants to comment is implied.

### Workspace and configuration foundation

This subsection owns configuration scope, separate from the module map above. All contents are proposed for evaluation.

| Scope/job | Initial contents | Boundaries |
| --- | --- | --- |
| Workspace navigation | Project directory/find/select, explicit current project, section-preserving switch only to a valid destination. | Unknown/inaccessible destinations stay unavailable without hidden names or fallback data. No organization/workspace CRUD, membership, billing, global activity/status, permission UI or mixed project data. |
| Project identity and setup | Read-only registry and demo responsibility references, classified in Master data and settings below. Project settings is setup, not intake. | U7 blocks live identity/lifecycle controls; archive stays blocked. Project language default is deferred. |
| Module-specific defaults | One project-settings home with module headings; see Master data and settings for references versus governed rules. | No status/requiredness designer. All four modules remain available in the demo; availability explanation is read-only. |
| Personal preferences | App-wide locale, E3; see Master data and settings. | No extra display/filter controls proposed without evidence. |

Project identity is separate from module behavior. Future optional module activation needs evidence and decisions about direct links, existing records and pending-work ownership before offering a switch. Hiding a module is never security or an implied data-access default. Credentials, integrations and authentication stay outside editable project settings, as do security, retention and SLA policies.

Before changing a harmless demo responsibility reference, establish the current project and source. Distinguish registry baseline, unsaved local edit and confirmed same-session demo value. Evaluate review of old/new value, scope and effect, with apply/cancel and optional unsaved reset. Demo save should claim only the local state actually reflected, not durable configuration or runtime enforcement. This is proposed behavior; current save is notice-only.

Use a common fixed product baseline plus explicit project demo references and personal locale, not an inheritance stack. If later overrides are justified, explain default, source, effective value and reset effect. Cancel/discard returns to the recorded local value; no rollback after apply is promised. Evaluate unsaved-exit choices on wrong-project navigation, without carrying names into another project. Preserving unsaved edits on validation errors is a recovery proposal, not verified protection.

Existing records retain their recorded context under the proposed boundaries below; historical label presentation remains unresolved. Setup summaries should name missing references separately from "not operationally verified". A nonempty name is not readiness, a project lifecycle or a ready badge. Scope review/cancel and fictional evaluation address wrong-project/wrong-value risks conceptually, not as proven safeguards.

### Master data and settings

Master data holds reusable business reference identity. Settings select defaults or behavior, sometimes referencing master data. Fixed governed product rules constrain meaning and outcomes. Personal preferences affect the individual experience. Work records capture module activity. These definitions own the distinction regardless of navigation placement.

| Area and classification | Initial scope | Later boundary |
| --- | --- | --- |
| Project registry: master data | Stable project identifier, name, description and owner reference for the two existing projects; read-only directory search/view/select. | Controlled create/rename/deactivate only after U7 authority is resolved, not a new general admin module. |
| People/teams: potential reference data | Explicitly demo free-text names and registry owner references. No actual identity/team directory exists in the inspected capability. | Person and team are distinct possible references, not current catalogs. Read-only approved-directory lookup only after source, authority and visibility decisions. No user/team/membership/project-access authoring here. |
| Module taxonomies: governed product vocabulary | Retain Support Broken/Question/Access/General, type-dependent requiredness and calculated priority; Feedback dispositions; UAT scenario results and defect statuses/guards. Ideas positions remain fixture meanings, not a formal pipeline. | No status CRUD or invented category/environment/tag catalogs. Even label renaming may change meaning and needs effect review. Demo priority rules need production-owner confirmation. |
| Project settings: defaults/behavior | One owner-config concept for per-module demo responsibility selections/references, not duplicate master lists. Evaluate meaningful local save as above; current save remains notice-only. | Assignment defaults for new work require explicit future agreement. Displayed responsibility is not executable routing. Free-text edits never automatically assign new work, assign/reassign active work, grant access, notify, reroute or establish duty. |
| Personal preferences | Current app-wide, per-person locale, not a project default or authentication. | No additional preferences assumed. |
| Work records | Support requests, Feedback, Ideas and UAT campaigns/scenarios/defects remain work, even when fixtures. | Their create flows belong to modules, not master administration. |

Every future managed catalog needs a human owner, permitted scope, authoritative source, stable meaning, change effect and retirement decision. This governance proposal does not require an admin navigation destination. View known references first; do not build a workspace admin console or project duplicates of shared lists while tenant/global catalog scope is unknown. Reuse an adequate business directory rather than rebuilding it.

For initial reference changes, show source and effective value, then an old/new summary identifying project scope and reference-only effects, with no automatic assignment of new or active work. This is not an approval system and creates no live duty. Separately, future assignment-default or rename proposals need effect review for future versus active work. A rename retaining conceptual identity is a proposal, not migrated behavior; historical label display remains U7, with no silent rewriting of outcomes.

Future retirement could stop new selection only after checking pending work and defaults. Existing references should remain readable only to already permitted users, without broader disclosure. No automatic reassignment or movement of work follows disable/retire. Until the owner resolves effects, leave destructive controls unavailable rather than auto-retiring or migrating. Hard delete, merge and archive have no authorization here.

Module enablement, editable SLA, permissions, retention, custom rules, notifications and integrations remain deferred or blocked by existing authority gaps. Predictability and seeing the whole service justify doing less first, not making every choice configurable. Actual maintenance need remains unverified in U8.

### Shared interaction structure

Keep project context and breadcrumbs predictable. Use list/detail where a record needs detail, with consistent search/filter scope meanings. State, next actor and next action remain separate. New → review → confirm; back-to-edit is available before confirmation and should preserve entered text within that flow. This is a proposal to evaluate, not existing behavior in every module or an undo/cancel claim after creation. Selected evidence stays fake, not an upload promise.

After confirmation, describe only what is actually locally findable. An ID or notice alone must not imply a recorded outcome. Explain demo reset limits before entry/confirmation and set reload expectations; no draft, browser or durable-storage guarantee. Warn about unsaved edits where loss is a real risk. Evaluate explicit discard/preserve behavior before changing project during entry; never silently carry data into the wrong project.

An unavailable project/record should remain unavailable, not fall through to another project's data. For errors with unknown outcome, do not claim a retry did or did not save; enable retry only where safe. These are proposed recovery boundaries, not established permission/safety defaults. Keyboard/focus and access needs require evaluation. U3 prevents an inclusive-experience guarantee.

### Routing and correction

| Intent/example | Proposed destination and boundary |
| --- | --- |
| Login is broken and I need help | Support Broken; a new permission request goes to Access instead. |
| I observed a confusing flow but need no help now | Feedback, not a personal resolution promise. |
| A new export feature would improve my work | Ideas, not a roadmap commitment. |
| An agreed test scenario failed during execution | UAT scenario evidence/defect, not automatic Support intake. |

When uncertain, distinguish needing help now, sharing an observation, proposing a change or executing an assigned test. Do not force one universal form. Before submission, changing module may retain only safe shared description for explicit review, without silent mapping or private-data transfer. After recording, propose an explanation and manual correct-intent handoff. No automatic conversion, new record creation, linking, integration, unapproved sharing or live handoff channel is promised.

No live notifications are in scope. New delivery copy and an M catalogue are deferred rather than inventing channels, service hours or support links. Confirmation and next-action meanings above guide evaluation, not detailed screen copy.

## Evaluation plan

The [Test Plan](test-plan.md) owns procedures, criteria, participants, cases and results. All evaluation is planned, none run. U5 comes from the latest request and static completeness inference, E11–E13, not user findings. The proposed, reversible first study investigates comprehension and reported current context. C1/C3 cannot isolate taxonomy from clearer labels or completed recording, or establish improvement over alternatives. U5 remains untested and comparative commitment stays blocked without equivalent alternative task evidence and actual context. The predeclared qualitative criteria inform narrowing to terminology/help or reassessing one entry, not automatic superiority or demand. U1–U4 remain open; evaluation cannot itself grant operational authority.

The plan prepares a focused first pilot using C2 intake/follow-up and only relevant C9 discussion distinctions, with short C1 and reviewed C4 content where appropriate. It gathers requester/comprehension evidence only. It does not authorize module expansion or bypass foundation gates C5–C8; broad actor/governance work remains separate and later. Missing human prerequisites keep the pilot planned/not run.

Foundation evaluation is [C6](test-plan.md#c6-understand-project-setup-and-change-scope), covering U6/U7 before configuration commitment; C5 owns attributed authority review. Neither resolves safety by itself.

[C7](test-plan.md#c7-distinguish-master-data-settings-and-work-records) investigates reference/settings/work distinctions and U7/U8 before master administration investment. The plan owns its procedure and results.

[C8](test-plan.md#c8-validate-actor-and-handoff-model) investigates task ownership and U9 before role-based feature commitment; C5 separately seeks authority evidence. Neither validates staffing or access through a role label.

[C9](test-plan.md#c9-distinguish-discussion-from-workflow-actions) investigates U10's discussion/activity/outcome meanings and flat context, plus U11 audience/attribution/saved-limit comprehension. C5 seeks U11 authority decisions. The plan owns methods, criteria and results; neither case is a safety validation.

## First useful release

The focused requester pilot described in the Evaluation plan may gather comprehension evidence before the later targeted foundation and governance rounds. Foundation identity/scope, task ownership, master-reference versus settings/work classification and settings-save meaning still require evaluation before their corresponding commitments or module expansion. Evaluate requester Support, including conversation/workflow separation through C9, Overview intent selection and representative Feedback/Ideas/UAT distinctions, with same-session creation/findability before extra votes or dashboards. C9 may share C2 recent-history accounts, not an invented additional study. Early C9 comprehension evidence does not bypass foundation or authority gates. Live policies/integrations and campaign building remain deferred. Specify is closed: this is not a production release, build-ready slice or SRS authorization.

## Review and next steps

Static scoped recheck of E26 confirmed F1–F3 addressed: the reference-only boundary, comparative inference limits and C2 intake coverage are reconciled. It found R1 sequence ambiguity between the early comprehension pilot and later foundation rounds. The author applied the settled sequence correction. Parent static consistency check confirmed the corrected sequence agrees with the Evaluation plan and retained gates, not reviewer approval of R1 or the whole package. The accepted S1 sequence remains in C8, with unaided recent accounts before roster comparison; C1 retains reported current-approach context without a superiority inference.

Review evidence is limited to static document coherence. The review did not independently verify runtime behavior or source claims, validate actors or run participant sessions. No validator, renderer or software test ran. Package review is not human approval; approval remains proposed.

Evidence confidence: medium for bounded static observations, low for priority and proposed experience. E1–E10 remain a static snapshot; E27 adds external document guidance only, not DX validation. No participant or runtime validation exists. U4 is unresolved.

Delivery readiness remains limited to evaluation preparation; parent static consistency check completed after the R1 author correction, without reviewer or human approval. The authorized non-human document corrections and pilot preparation are complete; human dependencies remain, including unknown decision owner/facilitator, actual likely-user participation and consent, reviewed language/accommodations and requester context. No recruitment or operational review is booked. This is not sessions-ready, build-ready or approved for live use. Next gate is test solutions. Stop at Shape; package review is not human approval.

## Decision history

2026-10-30: initial proposed framing from E1 and static E2–E9 at `b390577`. Broad standardization becomes a bounded requester next-action hypothesis, E10, with N1–N4 and U1–U4 provisional. No prior design is reconstructed, no earlier participant results exist to carry forward, and no human approval is recorded. Real cases and accountable ownership must be assessed before priority commitment. Decision owner remains unknown; phase remains Understand.

2026-10-30: latest user request explicitly opens Shape, E11. Prior Understand-only deferral is superseded by the proposed purpose-based module map and shared patterns. Added E12–E13, N5–N6, U5 and linked `test-plan.md`; E1–E10, N1–N4 and U1–U4 remain applicable with their original limitations. No participant results exist to invalidate; all cases are planned/not run. Commitment remains blocked by untested needs and ownership, with U2 blocking live scope. Proposed product lead/service owners are unknown, not approvals. Shape authorization does not authorize investment, build or launch.

2026-10-30: primary accepted the read-only two-file package review with no blocker or material finding for provisional evaluation. Integrated S1 current-approach comparison in C1, clarified user/service outcomes and pre-confirmation back-to-edit. All cases remain planned/not run; no human approval or phase advance. The initial Understand entry above is historical, not the current phase.

2026-10-30: E14 refinement changes module-first sequencing to foundation evaluation before expansion. Added E14–E16, provisional N7–N9, U6/U7 and C6; C5 authority/change-impact scope revised, still planned. Module distinctions and E1–E13 retain their static limitations. C1–C5 never ran, so no passes carry forward. Current changes await scoped review; approval stays proposed and Shape remains open, not Specify.

2026-10-30: E17 request refines the foundation with master data/settings distinctions. Added primary-supplied static E18, inference E19, provisional N10, extended U7, U8 and C7; C5 source/authority/retirement review updated. Prior IDs, rules, module map and decision history remain. C1–C6 never ran; C7 is also planned/not run. Earlier reviewer conclusions are neither validation nor review of these changes. Foundation/master changes await scoped review; no phase advance or approval.

2026-10-30: E20 actor/use-case request continues Shape. Added primary-supplied static E21, inference E22, provisional N11/U9, ACT-01–15, UC-01–26 and planned C8; C5 role/visibility authority questions revised. Actor coverage describes bounded task facets, not validated staffing or access. U2/U7 retain their authoritative definitions. E1–E19, N1–N10, U1–U8, module/configuration/master definitions and prior history remain; C1–C7 have no results to carry forward and earlier evidence stays static. Full current package awaits scoped review. No recruitment, testing, human approval, Specify or build authorization.

2026-10-30: primary consumed the current workspace/configuration/master-data/ACT/UC review with no blocker or material finding, judged the provisional package coherent for evaluation preparation only, and integrated S1 in C8 to compare proposed roles only after unaided accounts and roster introduction; static review is not validation, permission or phase advance.

2026-10-30: E23 discussion request continues Shape/evaluation/design-documents. Added bounded static E24, inference E25, provisional N12/N13, U10/U11, Ticket discussion and history, UC-27–29 and C9; UC-05–09 reference discussion semantics and C5 adds discussion authority questions under U2. Existing E1–E22, N1–N11, U1–U9, ACT-01–15, UC-01–26 and C1–C8 histories remain. No earlier results exist to carry forward. Prior review does not cover this revision, which awaits review. No implementation, participant evaluation, human approval or phase advance.

2026-10-30: primary consumed the scoped read-only discussion/use-case/shared-dependency review with no blocker, material finding or suggested correction and accepts coherence for provisional Shape evaluation preparation only; limited static review did not independently check sources/runtime, grant authority, advance phase or produce evaluation results, and the package is not sessions-ready, build-ready or approved for live use.

2026-10-30: user authorization, "proceed Recommended next action non human require", is interpreted by the primary as non-human document corrections/preparation only. E26 records F1 reference-only versus assignment-default mismatch, F2 unsupported comparative improvement inference and F3 missing intake coverage. Revised U5/C1/C3 to comprehension and reported context, preserving the original improvement hypothesis as untested; reconciled C6/C7 with reference-only effects and added N2/UC-04 intake/review/confirmation within C2's N1–N4/UC-04–08 coverage. Prepared a focused pilot inside the plan without bypassing foundation gates. Static scoped recheck confirmed F1–F3 addressed and found R1 sequence ambiguity. The authorized author correction distinguishes early comprehension evidence from later foundation commitments and expansion gates. Parent static consistency check confirmed the corrected sequence agrees with the Evaluation plan and retained gates, with no reviewer approval of R1 or the whole package. Prior results are none; C1–C9 remain planned/not run. E27 external guidance informs wording and boundaries, not DX demand, taxonomy, policy, enforcement or conformance. Decision owner remains unknown, no human approval is recorded, and readiness stays limited to evaluation preparation. Shape/evaluation/design-documents, proposed approval and test solutions gate remain unchanged; no investment, build or Specify authorization.
