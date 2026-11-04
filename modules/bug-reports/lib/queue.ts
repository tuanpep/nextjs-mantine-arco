import type { BugQueueQuery, BugStatusFilter, BugView } from "./search-params";
import { compareBugSeverity, type BugReport } from "./state";

export function statusFitsView(
  status: BugStatusFilter,
  view: BugView,
): boolean {
  return (
    status === "all" ||
    view === "all" ||
    (view === "resolved" ? status === "Resolved" : status !== "Resolved")
  );
}

export function bugMatchesView(bug: BugReport, view: BugView): boolean {
  return statusFitsView(bug.status, view);
}

type MatchField =
  | "happened"
  | "expected"
  | "steps"
  | "environment"
  | "correlationId"
  | "impactDetail"
  | "pageUrl"
  | "message"
  | "note";

function searchFields(bug: BugReport): { field: MatchField; text: string }[] {
  return [
    { field: "happened", text: bug.happened },
    { field: "expected", text: bug.expected },
    { field: "steps", text: bug.steps },
    { field: "environment", text: bug.environment },
    { field: "correlationId", text: bug.correlationId },
    { field: "impactDetail", text: bug.impactDetail },
    { field: "pageUrl", text: bug.pageUrl },
    ...bug.messages.map(({ text }) => ({ field: "message" as const, text })),
    ...bug.notes.map(({ text }) => ({ field: "note" as const, text })),
  ];
}

export function bugSearchMatch(
  bug: BugReport,
  q: string,
): { field: MatchField; text: string } | null {
  const needle = q.trim().toLowerCase();
  if (
    !needle ||
    bug.title.toLowerCase().includes(needle) ||
    bug.id.toLowerCase().includes(needle)
  )
    return null;
  for (const { field, text } of searchFields(bug)) {
    const index = text.toLowerCase().indexOf(needle);
    if (index !== -1) {
      const start = Math.max(
        0,
        index - Math.max(0, Math.floor((160 - needle.length) / 2)),
      );
      const end = Math.min(
        text.length,
        Math.max(index + needle.length, start + 160),
      );
      return {
        field,
        text: `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`,
      };
    }
  }
  return null;
}

export function selectBugQueue(
  bugs: readonly BugReport[],
  query: BugQueueQuery,
): { items: BugReport[]; total: number; page: number; pages: number } {
  const needle = query.q.trim().toLowerCase();
  const matching = bugs.filter(
    (bug) =>
      bugMatchesView(bug, query.view) &&
      (query.status === "all" || bug.status === query.status) &&
      (query.severity === "all" ||
        (query.severityOp === "is"
          ? bug.severity === query.severity
          : bug.severity !== query.severity)) &&
      (!needle ||
        bug.title.toLowerCase().includes(needle) ||
        bug.id.toLowerCase().includes(needle) ||
        bugSearchMatch(bug, needle) !== null),
  );
  matching.sort((left, right) => {
    const comparison =
      query.sort === "title"
        ? left.title.localeCompare(right.title)
        : compareBugSeverity(left, right) *
          (query.sort === "severity-asc" ? -1 : 1);
    return (
      comparison ||
      left.id.localeCompare(right.id, undefined, { numeric: true }) ||
      left.id.localeCompare(right.id)
    );
  });
  const total = matching.length;
  const pages = Math.max(1, Math.ceil(total / 25));
  const page = Number.isInteger(query.page)
    ? Math.min(pages, Math.max(1, query.page))
    : 1;
  return {
    items: matching.slice((page - 1) * 25, page * 25),
    total,
    page,
    pages,
  };
}
