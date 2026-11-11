# Boundaries

A check in one entry point does not cover the others. The layout, the page, a server action, and a route handler run separately.

## Who decides

| Entry                | Does                                                                                | Does not                                                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout               | Chrome, sidebar cookie, user menu                                                   | Authorize a record. A layout does not re-render on client navigation, and it does not stop the page, a route handler, or an action from running |
| Page                 | Await params, `notFound()` or redirect for this URL, pass ids and a permission prop | Own the list, the form, or the record array                                                                                                     |
| Feature `lib/`       | Pure rules. `createX` returns the record or `null`                                  | React, `fetch`, or a session lookup                                                                                                             |
| Feature `actions.ts` | The write the screen performs                                                       | Trust that the page already checked                                                                                                             |
| `route.ts`           | The write or read an external client performs                                       | Repeat a write that already has an action                                                                                                       |
| `proxy.ts`           | Optimistic redirect from the cookie                                                 | Be the only protection for a record                                                                                                             |
| Client screen        | Hide a control. Read `usePortal()`                                                  | Import `server-only` code, a secret, or the session check                                                                                       |

Root `proxy.ts` is optional and a last resort for redirects and headers. Do not add `middleware.ts`. Locale stays a cookie (`DX_LOCALE`); do not add a locale proxy.

## Server and client

Pages and layouts stay Server Components. `"use client"` goes on the screen in `modules/`, not on `page.tsx`.

Use a Client Component for state, event handlers, and browser APIs. Use a Server Component for request data and secrets.

Props passed into a Client Component are visible to the browser. Pass the fields the screen renders: ids, labels, and plain rows. Do not pass a session, a token, or a raw API payload.

## Today vs server I/O

Most record flows are **in-memory** for this browser session: screens read and mutate through `usePortal()`. The only server action in wide use today is `lib/i18n/actions.ts` (`setLocale`). Add `modules/<feature>/actions.ts` when a screen mutation must hit the network or persist outside the portal model; until then, portal methods are the write path.

## Reads

Today a screen reads `usePortal()`. It does not keep its own copy of the record array. Filters stay in that feature's `lib/search-params.ts`.

When a read hits the network, one server function in the feature checks the session and returns the feature type from `state.ts`. `modules/account/lib/api-client.ts` (`apiFetch`) is the only HTTP client. A component does not call `fetch`.

The type stays in `state.ts` until a second feature needs the same contract. Then it moves to `lib/`. Do not add a `types/` or `dto/` folder.

## Writes

One write has one door.

- The screen calls a server action in that feature's `actions.ts` (`"use server"` on the first line).
- An external client calls a `route.ts`.
- The same transition is not both.

The pure rule stays in `state.ts`. The door validates input, checks the caller, calls the pure function, and returns the fields the UI needs. Confirmed, pending, and failed stay distinct at the call site. The form keeps its draft until the server confirms the write.

A server action is a public POST. Rendering the form on a signed-in page does not authorize it. The action loads the user through one helper in `modules/account`. A `projectId` argument selects the record. It does not prove the caller may change it. Do not add a root `actions/` folder.

## Env

New variables go in `app/env.ts` only. A secret never uses `NEXT_PUBLIC_`. `isE2eAuthBypass()` never activates in a production build.
