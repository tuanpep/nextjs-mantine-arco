import { expect, it } from "vitest";
import { featureFixtures } from "./fixtures";
import { findSimilarFeatures } from "./similar";

it("ranks unique unicode token overlap within a project across statuses", () => {
  const seed = featureFixtures()[0];
  const items = [
    {
      ...seed,
      id: "1",
      title: "Café report report",
      status: "Accepted" as const,
    },
    { ...seed, id: "2", title: "Café report export" },
    { ...seed, id: "3", title: "Café report export", projectId: "other" },
  ];
  expect(
    findSimilarFeatures(items, seed.projectId, "CAFÉ report export export").map(
      (x) => x.id,
    ),
  ).toEqual(["2", "1"]);
  expect(findSimilarFeatures(items, seed.projectId, "an of")).toEqual([]);
});
