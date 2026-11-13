# Golden slice (fictional `bug-reports`)

[placement](placement.md) · [slicing](slicing.md) — sketch only; folders appear when you implement.

```text
app/(workspace)/projects/[projectId]/bugs/page.tsx     # Suspense + async Content
modules/bug-reports/
  components/bug-list.tsx                                 # "use client", usePortal, nuqs
  components/bug-list-skeleton.tsx                        # page fallback (or shared ui)
  lib/state.ts                                            # createBugReport, types
  lib/search-params.ts                                    # nuqs parsers
  lib/fixtures.ts                                         # Vitest + portal seed
  actions.ts                                              # optional API persist
messages/en.json + vi.json                                # "Bugs" namespace, same keys
```

Thin page:

```tsx
export default function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<BugListSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
```

Test (colocated):

```tsx
import { render } from "@/test-utils/render";
import { bugFixtures } from "../lib/fixtures";
import { BugList } from "./bug-list";
```

After adding routes or `Bugs` copy: `npm run check` and `npm run test:e2e` if chrome or locale changed ([review](review.md)).
