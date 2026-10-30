# Support journey: low-fidelity screens and walkthrough

Status: proposed, not tested  
Updated: 2026-10-30  
Sources: [Product design](product-design.md), [UX flows](ux-flows.md), [Test plan](test-plan.md)

## Scope

These text wireframes cover the requester journey and the handler handoffs needed to explain it. They are evaluation material, not implemented screens or a build specification. Screen IDs identify walkthrough material, not routes. No participant session or runtime verification has run.

Use fictional Beacon examples only. Records, people and actions below are illustrative. Do not infer permissions, real delivery, timestamps or service commitments from them. Live audience and action authority remain unresolved under U2/U11. The existing product design owns lifecycle meaning and type-dependent required fields.

The proposed layout uses a shared shell and a single main reading column. Keep the current project visible throughout. On small screens, collapse navigation but retain the project name, page heading and next action above the long history.

## Screen map

```text
S01 Project Overview
  → S02 Support collection
    → S03 Describe
      → S04 Review ↔ S03 Edit
        → S05 Confirmation
          → S06 Request detail: Handling

S02 → open recorded request → current detail state
S06 → handler explicitly requests information → S07 Waiting for sender
S07 → requester sends requested information → S06
S06 → handler explicitly requests retest → S08 Waiting for retest
S08 → requester records Pass / Fail / Unable → S06
S06 → handler explicitly resolves → S09 Resolved
S09 → S10 Reopen with reason → S06

Active detail → ordinary update → same lifecycle state
Any unsent form → leave or switch project → S11 Leave confirmation
Any write → known failure or uncertain outcome → S12 Recovery
```

Handler steps are separate, explicit workflow actions. These arrows do not mean a requester can change the state directly or that all handler controls already exist. Retest Pass returns evidence to the handler; it never skips to Resolved.

## S01. Project Overview

```text
Projects > Beacon                         Project: Beacon [Change]

Beacon
What do you need to do?

[ Get support ]
Something is broken, you have a question, or you need access.

[ Share feedback ]   Tell us about an experience.
[ Suggest an idea ]  Describe a useful change.
[ Run UAT ]          Execute a defined test scenario.

Demo only. Do not enter real or confidential information.
```

Get support is the primary entry for this requester-first study. Keep the other intents visible rather than inside an overflow menu. A person who needs help now should not have to understand internal reviewer roles to choose Support.

## S02. Support collection

```text
Projects > Beacon > Support               Project: Beacon [Change]

Support                                    [ New request ]
Find help requests for this project.

[ Search requests________________ ]
[ Open ] [ Closed ] [ Needs your action ]
Current view: Open

Request                         State                Next action
Cannot sign in to demo portal   Waiting for sender   You: provide information
Export shows an error           Handling             Handler: review request

Select a request to see its details and history.
Demo records may reset. No live notifications are sent.
```

Rows have an accessible link on the request title. Do not rely on a whole-row click or color to communicate the next action. “You” refers only to the fictional requester context used by the walkthrough, not verified identity.

An empty collection offers New request. A no-results view keeps the query and active filters visible and offers Clear filters. After creation, the confirmation's View request bypasses filter ambiguity. Returning to the collection must reveal the record or explain the filter change needed to find it.

## S03. Describe a request

```text
Projects > Beacon > Support > New request

New request
Step 1 of 2: Describe
Project: Beacon                            [ Change project ]

Use fictional information only.
This demo keeps changes in the current session, not permanent storage.

What do you need help with?
[ Broken ] [ Question ] [ Access ] [ Other ]

<Selected type's existing intake fields, visible labels and help>
<Existing fictional attachment illustration, if applicable>

[ Review request ]                         [ Cancel ]
```

Do not create a new universal field set from this drawing. Use the recorded type-specific intake definitions when preparing each task card. Review request validates required information before S04. Place field errors beside the input and provide an error summary when needed. Preserve valid input.

Changing type requires review of any answers that no longer apply. Changing project or choosing Cancel with entered text opens S11. No real attachment upload or durable draft is implied.

## S04. Review before submission

```text
Projects > Beacon > Support > New request

Review request
Step 2 of 2: Review

Project       Beacon
Request type  Broken
<Summary of every entered intake value and illustrated evidence>

[ Back to edit ]

Submitting records a fictional request in this demo session.
It does not send a live request or notify a team.

[ Record demo request ]                     [ Cancel ]
```

Back to edit returns to S03 with the entered values. A changed summary must be reviewed again before submission. Use a deliberate submission button, not an automatic submit on entering this screen. Prevent repeated activation while processing without claiming server deduplication.

## S05. Confirmation with a way back

```text
Request recorded in this demo session

Cannot sign in to demo portal
Project: Beacon
<Actual local identifier, only if one was assigned>

Next: handler review in the demo workflow.
No live notification or delivery has occurred.
Resetting the demo removes local changes.

[ View request ]                           [ Back to Support ]
```

Show this only once the record can be opened with its submitted content in the same project/session. A toast, generated identifier or button animation alone is not confirmation. View request is primary and leads to S06, not a blank form. The actual recorded state determines the displayed next actor.

## S06. Active request detail

```text
Projects > Beacon > Support > Request

Cannot sign in to demo portal
Project: Beacon   Type: Broken   State: Handling

NEXT ACTION
Handler: review the request and explain the next step.
You do not need to provide anything right now.

Request details
<Recorded intake values and fictional evidence illustration>

Discussion and activity                     Order: oldest first
[Discussion] Fictional requester: <context>
[Activity]  <Known workflow action and effect>
<Show author and time only when actually known>

Add an update
Audience: permitted request participants only.
Demo labels do not establish real access or delivery.
[ Plain-text update________________________________ ]
Posting an update does not change status or the next actor.
[ Add update ]

[ Back to Support ]
```

Use a stable chronological reading order and a clear Jump to latest link for long history. Ordinary update submission retains unsent text after known validation failure. Confirm locally only when the message is visible. It neither escalates nor satisfies an explicit information/retest request.

If the next action is unknown, say that it is not established. Do not insert a person or invented response deadline. Handler controls belong in a separate labelled action area, not in the requester composer. A demo role switch is not security enforcement.

## S07. Requested information

Replace the next-action block with the explicit question and response action. Keep request details and history below it.

```text
State: Waiting for sender

YOUR NEXT ACTION
The handler requested information.
Question: <Actual recorded clarification question>

[ Provide requested information ]
  Your reply
  [ Plain-text response____________________________ ]
  Sending this reply returns the next action to the handler.
  [ Send requested information ]          [ Cancel reply ]
```

Blank or whitespace-only replies show an inline error and keep focus near the response. Cancel reply does not change workflow; if text would be lost, ask before discarding it. After successful explicit reply, show Handling and handler next action with the reply in history. A separate Add update control, if shown, must explain that it does not complete this handoff.

## S08. Retest request

```text
State: Waiting for retest

YOUR NEXT ACTION
Check the proposed outcome using these instructions:
<Handler's recorded test instructions and relevant outcome>

Retest result
[ Pass ] [ Fail ] [ Unable ]
<Applicable source-defined notes and validation>

This records evidence for handler review. It does not resolve the request.
[ Record retest result ]                   [ Cancel ]
```

After a valid result, return to the detail with handler next action and the explicit result visible in history. Fail explains what still fails. Unable must not be treated as Pass or as a UAT Blocked result. Do not infer any result from a discussion message saying “works now”.

## S09. Resolved request

```text
State: Resolved

CURRENT OUTCOME
<Official recorded resolution and explanation>
No requester action is required by this workflow.

[ Reopen request ]
Use this if the issue persists or needs more work.

Previous outcomes
<Prior outcomes explicitly labelled Superseded, if any>

Request details and discussion history
Read-only while resolved. Reopening is an explicit action.

[ Back to Support ]
```

Do not require an extra acceptance action to finish the journey. Do not show an editable composer that secretly reopens the request. A current resolution must remain distinguishable from an older workaround or superseded outcome.

## S10. Reopen with a reason

```text
Reopen request
Project: Beacon
Request: Cannot sign in to demo portal

Why does this need more work?
[ Reason___________________________________________ ]

Reopening returns the next action to the handler.
The previous outcome stays in history and is marked superseded.

[ Reopen request ]                         [ Cancel ]
```

Validate the required reason. Cancel keeps Resolved; protect entered text before discarding it. Success returns to S06 with Handling, handler next action and the reopening reason visible. Do not erase the former outcome or claim that an external engineer was notified.

## S11. Leave with unsent input

```text
Discard your unsent changes?
You are leaving <current Beacon form or request> for <destination>.
These changes have not been recorded.

[ Stay here ]                              [ Discard and leave ]
```

Stay here is the safe default. Trap focus only while the confirmation is open and return focus to the initiating control when it closes. Discard never carries text to another record. This protection covers controlled in-app navigation; browser closure, reload and reauthentication require separate implementation/security decisions and must not be advertised as draft recovery.

## S12. Submission recovery

Use distinct messages for known failure and uncertain outcome.

| Known situation | Proposed treatment |
| --- | --- |
| Blank response | “Enter a reply before sending.” Keep text and current workflow state. |
| Confirmed failure with no write | Explain the known failure. Offer a retry only when safe; preserve available input. |
| Outcome not known | “We cannot confirm whether this was recorded.” Offer inspection of the same request/history or collection when determinable. Do not show a success checkmark or encourage repeat submission. |
| Unknown or inaccessible record | “This request is unavailable.” Offer a permitted collection or project directory. Do not disclose hidden metadata or substitute a different record. |

For an uncertain outcome, keep the next step cautious even if no record is immediately visible. A filtered or unavailable view does not prove that nothing was recorded. Sensitive-data disclosure requires approved handling; this demo must not invent a reporting destination.

## Walkthrough cards for the first pilot

Use these as material for existing C2 and relevant C9 tasks, not a new full study or a claim that evaluation occurred. The [Test plan](test-plan.md#testing-strategy) owns prerequisites, consent, language review, recruitment and procedure. All remain planned. The facilitator can present the text screens as cards; that tests understanding, not working navigation or input retention.

| Card | Neutral participant prompt | Facilitator observation, not shown as an answer |
| --- | --- | --- |
| W1, S01–S03 | “You cannot sign in to the fictional Beacon portal. Where would you start, and what would you tell someone?” | Project and intent/type selection; source-defined missing details; whether the person expects real delivery. |
| W2, S04 | “One detail in this summary is wrong. What would you do before continuing?” | Recognizes correction path and rechecks the summary. Use a deliberately incorrect fictional value from the supplied intake material. |
| W3, S05–S06 | “What happened here? Where would you return later, and what would a demo reset mean?” | Recorded versus delivered/durable; primary return path; next actor. |
| W4, S07 | “You return and see this question. What would you do next?” | Explicit requested-information reply versus ordinary update; expected next actor. |
| W5, S08 | “The proposed fix cannot be tested in your situation today. What would you record, and what happens next?” | Understands Unable without resolution; distinguishes result from discussion prose. |
| W6, S09–S10 | “This request has an outcome, but the same problem still occurs. What would you do?” | Finds reopen, understands reason and retained previous outcome. |
| W7, S06/S12 | “You added this message. What, if anything, changed? Now the send outcome is uncertain. What would you do?” | Separates message, workflow and delivery; avoids assuming failure or sending duplicates. |

Do not force every card into one session. Select relevant follow-up histories after the intake portion and record findings separately. Ask for expectations before explaining labels. Reviewed Vietnamese material and agreed accommodations are prerequisites for Vietnamese-language evaluation.

Use this blank note format per selected card:

```text
Material version / date:
Case and card:
Participant response before explanation:
Action observed, only if the material is interactive:
Moderator help:
Interpretation, kept separate from observation:
Unknowns and material limitations:
Next design decision:
```

Stop for sensitive disclosure, consent withdrawal or an uncertain real submission. Use fictional cards only; no live handoff, message or notification is necessary for this walkthrough.

## Review checklist before a prototype

- Every screen names Beacon or the actual selected project. Unknown destinations never fall through to another record.
- Submitted content can be opened from confirmation and found again from the scoped collection.
- Status, next actor and primary action agree after reply, retest, resolution and reopen.
- An ordinary message changes none of those workflow values.
- Resolved discussion is read-only; reopening retains the superseded outcome.
- Validation, cancellation and controlled navigation have explicit text-loss behavior.
- Uncertain writes remain uncertain until evidence establishes an outcome.
- Reviewed vi/en content covers forms, errors, next actions and reset limits, not just navigation.
- A later interactive prototype must test focus, keyboard use, mobile reading order, input retention and local-state behavior separately.

This checklist is for design review. No items are reported as passing implementation tests, participant evaluation or authority review.
