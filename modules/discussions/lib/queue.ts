import type { DiscussionThread } from "./state";

export type DiscussionQueueQuery = {
  q: string;
  sort: "recent" | "oldest";
  view: "all" | "unanswered";
  page: number;
};

export const DISCUSSION_PAGE_SIZE = 10;

export function selectDiscussionQueue(
  threads: DiscussionThread[],
  projectId: string,
  query: DiscussionQueueQuery,
) {
  const search = query.q.trim().toLowerCase();
  const matching = threads.filter(
    (thread) =>
      thread.projectId === projectId &&
      (query.view !== "unanswered" || thread.replies.length === 0) &&
      (!search ||
        [
          thread.title,
          thread.body,
          ...thread.replies.map((reply) => reply.text),
        ].some((text) => text.toLowerCase().includes(search))),
  );
  matching.sort((a, b) =>
    query.sort === "oldest"
      ? a.createdAt.localeCompare(b.createdAt)
      : b.updatedAt.localeCompare(a.updatedAt),
  );
  const total = matching.length;
  const pages = Math.max(1, Math.ceil(total / DISCUSSION_PAGE_SIZE));
  const requestedPage = Number.isSafeInteger(query.page) ? query.page : 1;
  const page = Math.min(pages, Math.max(1, requestedPage));
  return {
    items: matching.slice(
      (page - 1) * DISCUSSION_PAGE_SIZE,
      page * DISCUSSION_PAGE_SIZE,
    ),
    total,
    page,
    pages,
  };
}
