# DX Portal modules

Project-scoped workspace. A person picks a project, then uses one of six jobs. Records live in the browser session and disappear on reload. Nothing is notified, uploaded, or granted.

## Intent

| Need                                             | Destination              |
| ------------------------------------------------ | ------------------------ |
| Something is broken                              | Support → Bug Reports    |
| A personal question needs an answer              | Support → Help           |
| The product should change                        | Ideas → Feature Requests |
| Share an experience, with no personal fix        | Ideas → Feedback         |
| Read or write how something works                | Guides                   |
| Talk about the project, apart from those records | Discussions              |

No record is converted into another type. A bug report can hold its own messages, including after resolution. A message on a report waiting for its reporter returns it to Open; other messages do not change status. Discussions remain a separate project thread. An explicit status action stores one required note on that record. File names stay with the report in the session and are not uploaded.

Bug reporters can mark reproduction steps as unknown and omit environment details. Known reproduction requires steps. Waiting for reporter is a shared demo state, not an identity-enforced role: any posted message returns the report to Open. Follow-up messages on resolved reports do not reopen them.

Waiting reports show the latest information request above the reply field. Bug replies and status actions clear text only after an accepted update and announce the result. Unsaved reply and action text prompts before reload or following a link; browser history navigation is not guarded. Failed updates retain the draft. Records remain session-only.

Both bug intake paths retain text and staged attachments when creation is rejected. Titles allow 160 characters, narrative fields and follow-up notes allow 10,000, environment and correlation codes allow 500, and page addresses allow 2,048, measured after trimming. Unknown reproduction does not store hidden steps. Both paths suggest up to three same-project related reports by title-token overlap without blocking submission. Related links stay in the same tab and use the draft-discard confirmation.

Bug activity combines messages and status notes in their accepted order. A message that resumes a waiting report records that change in its activity entry. Activity has no invented authors or timestamps and is not a durable audit log.

## Lifecycles

- Bug report: Open → In progress → Resolved. Open or In progress can move to Waiting for reporter. Waiting can return to Open or resolve. Resolved can reopen to Open. All states except Resolved count as open.
- Help request: Open → Answered. Answered can reopen to Open. Replies append to the conversation without changing either status. Answer and reopen each require a message. Help is not a guide. Unsaved question and response text prompts before reload or following a link; browser history navigation is not guarded. Failed response updates retain the draft. Records remain session-only.
- Feature request: Submitted → Accepted or Declined with a required decision reason. Acceptance is for consideration, not a delivery commitment. No votes. Follow-up notes are allowed at every status and do not change the decision. Notes have no invented author or timestamp and are not private.
- Feedback: New → Reviewed. Reviewed does not promise a product change.
  Feedback intake and review require trimmed text, with 160 characters for titles and 10,000 for observations or review notes. Failed saves retain text. Unsaved full-page drafts prompt before reload or following a link; browser history navigation is not guarded. Review succeeds once with a required note and does not notify anyone.
- Guide: title, summary, and body. No comments.
- Discussion: title, opening post, and replies on that thread only.

Discussions show mock authors and timestamps. All and Unanswered views, search across opening posts and replies, activity sorting, and pages of 10 threads are URL-backed. Detail and creation links preserve the list query. Unsaved text prompts before reload or following a link; browser history navigation is not guarded. New posts and replies remain session-only.

## Navigation

Feedback has New, Reviewed, and All views. Project-scoped search includes observations and review notes. Title sorting and pages of 25 records are URL-backed; tab counts cover the project and result counts reflect search. Creation and detail links preserve a validated same-project queue return URL. All feedback changes remain session-only.

Feature Requests has Submitted, Decided, and All views. Project-scoped search includes the problem, desired outcome, and notes. Status filters, title sorting, and pages of 25 records are URL-backed. Tab counts cover the entire project; result counts reflect filters. Detail and creation links retain a validated same-project queue return URL. Both feature intake paths suggest up to three same-project requests by title token overlap without blocking submission or merging records. Titles allow 160 characters; problem, outcome, and notes allow 10,000, measured after trimming. Unsaved full-page text prompts before reload or link navigation, not browser history navigation. All changes remain session-only.

Bug Reports opens as an active queue with Resolved and All views. Search, status, severity, sort, and page are URL-backed. Status choices stay compatible with the selected view. Tab counts cover all project reports; the result count reflects the current filters. Rows show actual-result context or a matching search excerpt. Pages contain up to 25 reports. Creation and detail links retain the validated same-project queue query and effective page. No ownership or date-based queues appear until those fields exist.

Inside a project the sidebar is Overview, Support (Bug Reports, Help), Ideas (Feature Requests, Feedback), Guides, and Discussions. Open and closed slices are in-page tabs. Switching projects keeps the section and drops the record id.
