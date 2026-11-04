import { describe, expect, it } from "vitest";

import { bugFixtures } from "./fixtures";
import {
  bugMatchesView,
  bugSearchMatch,
  selectBugQueue,
  statusFitsView,
} from "./queue";
import type { BugQueueQuery } from "./search-params";
import type { BugReport } from "./state";

const query: BugQueueQuery = {
  q: "",
  view: "all",
  status: "all",
  severity: "all",
  severityOp: "is",
  sort: "severity-desc",
  page: 1,
};
const sample = bugFixtures()[0];

describe("bug queue", () => {
  it("matches views and compatible status filters", () => {
    expect(bugMatchesView(sample, "open")).toBe(true);
    expect(bugMatchesView(sample, "resolved")).toBe(false);
    expect(bugMatchesView({ ...sample, status: "Resolved" }, "all")).toBe(true);
    expect(statusFitsView("all", "resolved")).toBe(true);
    expect(statusFitsView("Resolved", "open")).toBe(false);
    expect(statusFitsView("In progress", "resolved")).toBe(false);
    expect(statusFitsView("Resolved", "resolved")).toBe(true);
    expect(statusFitsView("Open", "all")).toBe(true);
    expect(
      selectBugQueue(bugFixtures(), {
        ...query,
        view: "open",
        status: "Resolved",
      }).total,
    ).toBe(0);
  });

  it("finds hidden fields and returns bounded matching context", () => {
    const bug: BugReport = {
      ...sample,
      happened: "x".repeat(200) + "Needle" + "y".repeat(200),
      notes: [{ action: "start", text: "special note", order: 2 }],
    };
    const match = bugSearchMatch(bug, "needle");
    expect(match?.field).toBe("happened");
    expect(match?.text).toContain("Needle");
    expect(match?.text.length).toBeLessThanOrEqual(162);
    expect(bugSearchMatch(bug, "special note")?.field).toBe("note");
    expect(bugSearchMatch(bug, bug.title)).toBeNull();
    expect(bugSearchMatch(bug, bug.id)).toBeNull();
    expect(selectBugQueue([bug], { ...query, q: "special note" }).total).toBe(
      1,
    );
    for (const [field, text] of [
      ["steps", bug.steps],
      ["environment", bug.environment],
      ["correlationId", bug.correlationId],
      ["impactDetail", bug.impactDetail],
      ["pageUrl", bug.pageUrl],
      ["message", bug.messages[0].text],
    ] as const) {
      expect(bugSearchMatch(bug, text)?.field).toBe(field);
    }
  });

  it("filters severity including legacy isNot", () => {
    const bugs = bugFixtures();
    expect(
      selectBugQueue(bugs, {
        ...query,
        severity: "Critical",
        severityOp: "is",
      }).items.every((b) => b.severity === "Critical"),
    ).toBe(true);
    expect(
      selectBugQueue(bugs, {
        ...query,
        severity: "Critical",
        severityOp: "isNot",
      }).items.every((b) => b.severity !== "Critical"),
    ).toBe(true);
    expect(selectBugQueue(bugs, { ...query, severityOp: "isNot" }).total).toBe(
      bugs.length,
    );
  });

  it("sorts deterministically, paginates and does not mutate input", () => {
    const bugs = Array.from({ length: 30 }, (_, i) => ({
      ...sample,
      id: `BUG-${30 - i}`,
      title: "Same",
    }));
    const original = [...bugs];
    const first = selectBugQueue(bugs, query);
    expect(first.items).toHaveLength(25);
    expect(first.items[1].id).toBe("BUG-2");
    expect(first).toMatchObject({ total: 30, page: 1, pages: 2 });
    expect(selectBugQueue(bugs, { ...query, page: 99 }).items).toHaveLength(5);
    expect(selectBugQueue(bugs, { ...query, page: -2 }).page).toBe(1);
    expect(selectBugQueue(bugs, { ...query, page: NaN }).page).toBe(1);
    expect(selectBugQueue([], query)).toEqual({
      items: [],
      total: 0,
      page: 1,
      pages: 1,
    });
    expect(bugs).toEqual(original);
    const different = [
      { ...sample, id: "2", title: "Z", severity: "Low" as const },
      { ...sample, id: "1", title: "A", severity: "Critical" as const },
    ];
    expect(
      selectBugQueue(different, { ...query, sort: "severity-asc" }).items[0].id,
    ).toBe("2");
    expect(
      selectBugQueue(different, { ...query, sort: "severity-desc" }).items[0]
        .id,
    ).toBe("1");
    expect(
      selectBugQueue(different, { ...query, sort: "title" }).items[0].id,
    ).toBe("1");
  });
});
