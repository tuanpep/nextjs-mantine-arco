import { describe, expect, it } from "vitest";
import { featureFixtures } from "./fixtures";
import { selectFeatureQueue, statusFitsView } from "./queue";
import type { FeatureQueueQuery } from "./search-params";

const query: FeatureQueueQuery = {
  q: "",
  view: "all",
  status: "all",
  sort: "title-asc",
  page: 1,
};

describe("feature queue", () => {
  it("scopes before searching notes and outcomes", () => {
    const items = featureFixtures();
    expect(
      selectFeatureQueue(
        items,
        { ...query, q: "no ship date" },
        "beacon-portal",
      ).items.map((x) => x.id),
    ).toEqual(["FEAT-2"]);
    expect(
      selectFeatureQueue(items, { ...query, q: "folder" }, "beacon-portal")
        .total,
    ).toBe(0);
    expect(
      selectFeatureQueue(
        items,
        { ...query, q: "darker palette" },
        "beacon-portal",
      ).total,
    ).toBe(1);
  });
  it("filters views and statuses and clamps pages", () => {
    expect(
      selectFeatureQueue(
        featureFixtures(),
        { ...query, view: "open", status: "Accepted" },
        "beacon-portal",
      ).total,
    ).toBe(1);
    expect(statusFitsView("Accepted", "open")).toBe(false);
    expect(statusFitsView("all", "closed")).toBe(true);
    const result = selectFeatureQueue(
      featureFixtures(),
      { ...query, view: "closed", page: 20 },
      "beacon-portal",
    );
    expect([result.total, result.page, result.pages]).toEqual([1, 1, 1]);
    expect(
      selectFeatureQueue(
        featureFixtures(),
        { ...query, status: "Declined" },
        "beacon-portal",
      ).items,
    ).toEqual([]);
  });
  it("sorts and paginates deterministically", () => {
    const seed = featureFixtures()[0];
    const items = Array.from({ length: 27 }, (_, i) => ({
      ...seed,
      id: `FEAT-${i + 1}`,
    }));
    const result = selectFeatureQueue(
      items,
      { ...query, page: 2 },
      seed.projectId,
    );
    expect(result.items.map((x) => x.id)).toEqual(["FEAT-26", "FEAT-27"]);
    expect(result.pages).toBe(2);
  });
});
