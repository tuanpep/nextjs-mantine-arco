import type {
  FeatureQueueQuery,
  FeatureStatusFilter,
  FeatureView,
} from "./search-params";
import type { FeatureRequest } from "./state";

export function statusFitsView(
  status: FeatureStatusFilter,
  view: FeatureView,
): boolean {
  return (
    status === "all" ||
    view === "all" ||
    (view === "open" ? status === "Submitted" : status !== "Submitted")
  );
}

export function selectFeatureQueue(
  items: readonly FeatureRequest[],
  query: FeatureQueueQuery,
  projectId: string,
): { items: FeatureRequest[]; total: number; page: number; pages: number } {
  const needle = query.q.trim().toLowerCase();
  const status = statusFitsView(query.status, query.view)
    ? query.status
    : "all";
  const matching = items.filter(
    (item) =>
      item.projectId === projectId &&
      statusFitsView(item.status, query.view) &&
      (status === "all" || item.status === status) &&
      (!needle ||
        [
          item.id,
          item.title,
          item.problem,
          item.outcome,
          ...item.notes.map((note) => note.text),
        ].some((text) => text.toLowerCase().includes(needle))),
  );
  matching.sort(
    (a, b) =>
      a.title.localeCompare(b.title) * (query.sort === "title-desc" ? -1 : 1) ||
      a.id.localeCompare(b.id, undefined, { numeric: true }) ||
      a.id.localeCompare(b.id),
  );
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
