import type { SessionRow } from "@/modules/portal/lib/session-rows";

import { applications } from "./applications";
import type { SessionRecordQuery } from "./search-params";

export const sessionPageSize = 10;

export function selectSessionRecords(
  rows: SessionRow[],
  query: SessionRecordQuery,
  locale: string,
) {
  const project = applications.some((item) => item.id === query.recordsProject)
    ? query.recordsProject
    : "all";
  const terms = query.recordsQ.trim().toLocaleLowerCase(locale);
  const collator = new Intl.Collator(locale);
  const matches = rows
    .filter(
      (row) =>
        (project === "all" || row.projectId === project) &&
        (query.recordsKind === "all" || row.kind === query.recordsKind) &&
        (!terms ||
          `${row.title} ${row.id}`.toLocaleLowerCase(locale).includes(terms)),
    )
    .sort(
      (a, b) =>
        collator.compare(a.title, b.title) ||
        a.projectId.localeCompare(b.projectId) ||
        a.kind.localeCompare(b.kind) ||
        a.id.localeCompare(b.id),
    );
  const pages = Math.max(1, Math.ceil(matches.length / sessionPageSize));
  const page = Math.min(
    pages,
    Math.max(
      1,
      Number.isFinite(query.recordsPage) ? Math.trunc(query.recordsPage) : 1,
    ),
  );
  return {
    rows: matches.slice((page - 1) * sessionPageSize, page * sessionPageSize),
    count: matches.length,
    pages,
    page,
    project,
  };
}
