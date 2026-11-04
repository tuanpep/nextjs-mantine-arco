import { expect, test } from "vitest";
import { bugFixtures } from "./fixtures";
import { findSimilarBugs } from "./similar";

test("ranks unique Unicode tokens within the project across statuses", () => {
  const seed = bugFixtures()[0];
  const items = [
    { ...seed, id: "BUG-1", title: "Lỗi báo cáo", status: "Resolved" as const },
    { ...seed, id: "BUG-2", title: "Lỗi báo cáo export" },
    { ...seed, id: "BUG-3", title: "Lỗi báo cáo export", projectId: "other" },
  ];
  expect(
    findSimilarBugs(items, seed.projectId, "LỖI export export").map(
      (item) => item.id,
    ),
  ).toEqual(["BUG-2", "BUG-1"]);
  expect(findSimilarBugs(items, seed.projectId, "an of")).toEqual([]);
  expect(findSimilarBugs(items, seed.projectId, "unrelated")).toEqual([]);
});

test("caps results at three and breaks ties deterministically without changing input", () => {
  const seed = bugFixtures()[0];
  const items = [10, 3, 2, 1].map((id) => ({
    ...seed,
    id: `BUG-${id}`,
    title: "Export fails",
  }));
  expect(
    findSimilarBugs(items, seed.projectId, "export").map((item) => item.id),
  ).toEqual(["BUG-1", "BUG-2", "BUG-3"]);
  expect(items.map((item) => item.id)).toEqual([
    "BUG-10",
    "BUG-3",
    "BUG-2",
    "BUG-1",
  ]);
});
