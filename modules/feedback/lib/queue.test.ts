import { describe, expect, it } from "vitest";
import { selectFeedbackQueue } from "./queue";
import type { FeedbackQueueQuery } from "./search-params";
import type { FeedbackItem } from "./state";

const query: FeedbackQueueQuery = {
  q: "",
  view: "all",
  sort: "title-asc",
  page: 1,
};
const item: FeedbackItem = {
  id: "FB-1",
  projectId: "p",
  title: "Title",
  observation: "Observation",
  status: "New",
  notes: [{ action: "review", text: "Note" }],
};

describe("feedback queue", () => {
  it("scopes, filters and searches all fields", () => {
    const items: FeedbackItem[] = [
      item,
      { ...item, id: "FB-2", projectId: "other" },
      { ...item, id: "FB-3", status: "Reviewed" },
    ];
    for (const q of [" fb-1 ", "TITLE", "observation", "note"]) {
      expect(
        selectFeedbackQueue(items, { ...query, q, view: "open" }, "p").items,
      ).toEqual([item]);
    }
    expect(
      selectFeedbackQueue(items, { ...query, view: "closed" }, "p").items.map(
        (x) => x.id,
      ),
    ).toEqual(["FB-3"]);
    expect(
      selectFeedbackQueue(items, { ...query, q: "missing" }, "p").total,
    ).toBe(0);
  });
  it("sorts deterministically and clamps pages", () => {
    const items = Array.from({ length: 27 }, (_, i) => ({
      ...item,
      id: `FB-${i + 1}`,
    }));
    expect(
      selectFeedbackQueue(items, { ...query, page: 2 }, "p").items.map(
        (x) => x.id,
      ),
    ).toEqual(["FB-26", "FB-27"]);
    for (const page of [0, -1, NaN, 1.5])
      expect(selectFeedbackQueue(items, { ...query, page }, "p").page).toBe(1);
    expect(selectFeedbackQueue(items, { ...query, page: 99 }, "p").page).toBe(
      2,
    );
    expect(selectFeedbackQueue([], query, "p")).toEqual({
      items: [],
      total: 0,
      page: 1,
      pages: 1,
    });
    const sorted = selectFeedbackQueue(
      [
        { ...item, id: "FB-10" },
        { ...item, id: "FB-2" },
        { ...item, title: "Z" },
      ],
      { ...query, sort: "title-desc" },
      "p",
    );
    expect(sorted.items.map((x) => x.id)).toEqual(["FB-1", "FB-2", "FB-10"]);
  });
});
