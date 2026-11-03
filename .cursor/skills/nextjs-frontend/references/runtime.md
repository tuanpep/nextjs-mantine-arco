# Next.js 16 runtime (this repo)

Sources: bundled docs under `node_modules/next/dist/docs/`, [upgrade to 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy), [async dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis).

## Async request APIs

`params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` are async. Always await in Server Components / Route Handlers. In Client Components, unwrap with `React.use()`.

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <Screen projectId={projectId} />;
}
```

In this repo the await lives in an inner async component under `Suspense`, so the route skeleton can paint. See [layout](layout.md). Prefer typed helpers when available (`LayoutProps<"…">`, generated page props). Do not treat `params` / `searchParams` as plain objects without awaiting.

## Cache Components

`next.config.ts` sets `cacheComponents: true` and `partialPrefetching: true`. Do not turn them off casually.

- Keep request-time reads (`cookies()`, `headers()`, `searchParams`) inside the narrowest Suspense / dynamic boundary so the static shell can still prerender.
- Use `"use cache"` only when a stable, explicit cache boundary is required; read the local Cache Components guide first.
- Prefer `revalidateTag` / `updateTag` / `refresh` from current docs over memorized Next 14/15 cache APIs.

## Proxy (not middleware)

`middleware.ts` is deprecated. Request interception is `proxy.ts` next to `app/`, exporting `proxy`. Runtime is Node.js (not Edge). Prefer route handlers, layouts, or Server Actions when they suffice; use proxy as a last resort for redirects, rewrites, and headers.

Who may authorize a record, and how a write chooses its door, is in [boundaries](boundaries.md).

Do not add next-intl middleware/proxy for locale prefixes — this app uses a cookie locale (`DX_LOCALE`) without a `[locale]` segment. Change locale via `lib/i18n/actions.ts` (`setLocale`).

## Server Actions and RSC

- Default to Server Components for pages and layouts. Isolate `"use client"` to interactive leaves.
- Mutations that do I/O follow [boundaries](boundaries.md): one door, pure rules in the feature `lib/`, session loaded once from `modules/account`.

## i18n and auth touchpoints

| Concern                   | Where                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| Request locale + messages | `lib/i18n/request.ts` (next-intl plugin entry in `next.config.ts`)            |
| Locale cookie write       | `lib/i18n/actions.ts`                                                         |
| Locales list              | `lib/i18n/config.ts` (`vi` default, `en`)                                     |
| Keycloak init / session   | `modules/account/lib/keycloak.ts`, `auth-provider.tsx`                        |
| Bearer API                | `modules/account/lib/api-client.ts` — only to `NEXT_PUBLIC_API_PREFIX` origin |

E2E auth bypass is `isE2eAuthBypass()` in `app/env.ts` and must never activate in production builds.
