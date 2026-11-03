import { describe, expect, it } from "vitest";

import {
  addBugMessage,
  applyBugTransition,
  bugActions,
  bugInView,
  bugMatchesSeverity,
  compareBugSeverity,
  createBugReport,
  type BugReport,
} from "./state";

const draft = {
  projectId: "beacon-portal",
  title: " Export fails ",
  happened: "Nothing downloads",
  steps: "Choose Export",
  expected: "A file downloads",
  environment: " Production · Chrome ",
  correlationId: "  ",
  impactDetail: " The morning export ",
  pageUrl: " https://beacon.example/export ",
  attachments: [{ name: " screen.png ", sizeLabel: " 12 KB " }],
  impactScope: "my-team",
  urgency: "today",
};

function openBug(): BugReport {
  const bug = createBugReport("BUG-9", draft);
  if (!bug) throw new Error("expected a bug");
  return bug;
}

describe("bug reports", () => {
  it("trims a new open report and rejects a blank field", () => {
    const bug = openBug();
    expect(bug.title).toBe("Export fails");
    expect(bug.environment).toBe("Production · Chrome");
    expect(bug.correlationId).toBe("");
    expect(bug.impactDetail).toBe("The morning export");
    expect(bug.pageUrl).toBe("https://beacon.example/export");
    expect(bug.attachments).toEqual([
      { name: "screen.png", sizeLabel: "12 KB" },
    ]);
    expect(
      createBugReport("BUG-9", {
        ...draft,
        attachments: [
          {
            name: "screen.png",
            sizeLabel: "12 KB",
            previewUrl: "blob:http://localhost/screen",
          },
        ],
      })?.attachments[0]?.previewUrl,
    ).toBe("blob:http://localhost/screen");
    expect(
      createBugReport("BUG-9", {
        ...draft,
        attachments: [
          {
            name: "screen.png",
            sizeLabel: "12 KB",
            previewUrl: "javascript:alert(1)",
          },
        ],
      })?.attachments,
    ).toEqual([{ name: "screen.png", sizeLabel: "12 KB" }]);
    expect(bug.messages).toEqual([]);
    expect(bug.severity).toBe("High");
    expect(bug.status).toBe("Open");
    expect(bug.notes).toEqual([]);
    expect(createBugReport("BUG-9", { ...draft, steps: "  " })).toBeNull();
    expect(createBugReport("BUG-9", { ...draft, environment: " " })).toBeNull();
    expect(
      createBugReport("BUG-9", { ...draft, impactScope: "everyone" }),
    ).toBeNull();
    expect(
      createBugReport("BUG-9", { ...draft, pageUrl: "javascript:alert(1)" }),
    ).toBeNull();
  });

  it("starts, resolves, and reopens without dropping earlier notes", () => {
    const bug = openBug();
    const started = applyBugTransition(bug, {
      kind: "start",
      note: " Looking ",
    });
    expect(bug.status).toBe("Open");
    expect(started?.status).toBe("In progress");
    expect(started?.notes).toEqual([{ action: "start", text: "Looking" }]);
    const resolved = started
      ? applyBugTransition(started, { kind: "resolve", note: "Fixed" })
      : null;
    expect(resolved?.status).toBe("Resolved");
    expect(resolved?.notes).toHaveLength(2);
    const reopened = resolved
      ? applyBugTransition(resolved, { kind: "reopen", note: "It returned" })
      : null;
    expect(reopened?.status).toBe("Open");
    expect(reopened?.notes).toHaveLength(3);
    expect(bugInView(bug, "open")).toBe(true);
    expect(resolved ? bugInView(resolved, "resolved") : false).toBe(true);
    expect(bugMatchesSeverity(bug, "all")).toBe(true);
    expect(bugMatchesSeverity(bug, "High")).toBe(true);
    expect(bugMatchesSeverity(bug, "Critical")).toBe(false);
  });

  it("orders a mixed list with critical reports first", () => {
    const high = openBug();
    const critical = { ...high, id: "BUG-1", severity: "Critical" as const };
    const low = { ...high, id: "BUG-2", severity: "Low" as const };
    expect(
      [low, high, critical].sort(compareBugSeverity).map((item) => item.id),
    ).toEqual(["BUG-1", "BUG-9", "BUG-2"]);
  });

  it("rejects a blank note and an action the status does not allow", () => {
    const bug = openBug();
    expect(bugActions(bug.status)).toEqual(["start", "resolve"]);
    expect(applyBugTransition(bug, { kind: "start", note: " " })).toBeNull();
    expect(
      applyBugTransition(bug, { kind: "reopen", note: "Again" }),
    ).toBeNull();
    expect(bug.notes).toEqual([]);
  });

  it("adds a message without changing status and refuses one on a resolved report", () => {
    const bug = openBug();
    const messaged = addBugMessage(bug, "MSG-2", " Still blank ");
    expect(bug.status).toBe("Open");
    expect(messaged?.status).toBe("Open");
    expect(messaged?.messages).toEqual([{ id: "MSG-2", text: "Still blank" }]);
    expect(addBugMessage(bug, "MSG-3", " ")).toBeNull();
    const resolved = applyBugTransition(bug, {
      kind: "resolve",
      note: "Fixed",
    });
    expect(
      resolved ? addBugMessage(resolved, "MSG-4", "Again") : null,
    ).toBeNull();
  });
});
