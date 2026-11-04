import type { FeedbackQueueQuery } from "./search-params";
import { feedbackInView, type FeedbackItem } from "./state";

export function selectFeedbackQueue(
  items: readonly FeedbackItem[],
  query: FeedbackQueueQuery,
  projectId: string,
): { items: FeedbackItem[]; total: number; page: number; pages: number } {
  const needle = query.q.trim().toLowerCase();
  const matching = items.filter(
    (item) =>
      item.projectId === projectId &&
      feedbackInView(item, query.view) &&
      (!needle ||
        [
          item.id,
          item.title,
          item.observation,
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
