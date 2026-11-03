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

No record is converted into another type. A bug report can hold its own messages; a message does not change its status, and a resolved report takes no new message until it is reopened. Discussions remain a separate project thread. A status change stores one required note on that record. File names stay with the report in the session and are not uploaded.

## Lifecycles

- Bug report: Open → In progress → Resolved. Resolved can reopen to Open. Open and In progress count as open.
- Help request: Open → Answered. Answered can reopen to Open. Help is not a guide.
- Feature request: Submitted → Accepted or Declined. Acceptance is not a ship date. No votes.
- Feedback: New → Reviewed. Reviewed does not promise a product change.
- Guide: title, summary, and body. No comments.
- Discussion: title, opening post, and replies on that thread only.

## Navigation

Inside a project the sidebar is Overview, Support (Bug Reports, Help), Ideas (Feature Requests, Feedback), Guides, and Discussions. Open and closed slices are in-page tabs. Switching projects keeps the section and drops the record id.
