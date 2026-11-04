import { describe, expect, it } from "vitest";
import { discussionFixtures } from "./fixtures";
import { selectDiscussionQueue } from "./queue";
import { addDiscussionReply, createDiscussionThread } from "./state";
import { discussionSearchParams } from "./search-params";

const query = { q: "", sort: "recent", view: "all", page: 1 } as const;

describe("discussions", () => {
  it("validates and timestamps immutable changes", () => {
    const draft = {
      projectId: "beacon-portal",
      title: " Naming ",
      body: " Question ",
    };
    const thread = createDiscussionThread(
      "1",
      draft,
      "2026-01-01T00:00:00.000Z",
    );
    expect(thread).not.toBeNull();
    if (!thread) return;
    const replied = addDiscussionReply(
      thread,
      "2",
      " you ",
      " Answer ",
      "2026-01-02T00:00:00.000Z",
    );
    expect(thread.replies).toEqual([]);
    expect(thread.createdAt).toBe(thread.updatedAt);
    expect(replied?.updatedAt).toBe("2026-01-02T00:00:00.000Z");
    expect(replied?.replies[0]).toEqual({
      id: "2",
      author: "you",
      text: "Answer",
      createdAt: "2026-01-02T00:00:00.000Z",
    });
    expect(
      createDiscussionThread("1", { ...draft, title: "x".repeat(161) }),
    ).toBeNull();
    expect(
      createDiscussionThread("1", { ...draft, body: "x".repeat(10001) }),
    ).toBeNull();
    expect(
      addDiscussionReply(thread, "2", "you", "x".repeat(10001)),
    ).toBeNull();
    expect(addDiscussionReply(thread, "2", "you", " ")).toBeNull();
  });

  it("filters projects, replies and unanswered threads, sorts and clamps pages", () => {
    const threads = discussionFixtures();
    expect(selectDiscussionQueue(threads, "beacon-portal", query).total).toBe(
      13,
    );
    expect(selectDiscussionQueue(threads, "orchid-reports", query).total).toBe(
      2,
    );
    expect(
      selectDiscussionQueue(threads, "beacon-portal", {
        ...query,
        q: "quarterly review",
      }).total,
    ).toBe(1);
    expect(
      selectDiscussionQueue(threads, "beacon-portal", {
        ...query,
        view: "unanswered",
      }).items.every((t) => !t.replies.length),
    ).toBe(true);
    expect(
      selectDiscussionQueue(threads, "beacon-portal", {
        ...query,
        sort: "oldest",
      }).items[0].id,
    ).toBe("DISC-1");
    expect(
      selectDiscussionQueue(threads, "beacon-portal", query).items[0].id,
    ).toBe("DISC-13");
    expect(
      selectDiscussionQueue(threads, "beacon-portal", { ...query, page: 99 }),
    ).toMatchObject({ page: 2, pages: 2, total: 13 });
    expect(
      selectDiscussionQueue(threads, "beacon-portal", { ...query, page: -1 })
        .page,
    ).toBe(1);
    expect(discussionSearchParams.page.parse("0")).toBeNull();
    expect(discussionSearchParams.page.parse("2")).toBe(2);
  });
});
