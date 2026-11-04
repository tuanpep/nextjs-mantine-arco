import { describe, expect, it } from "vitest";

import {
  addBugMessage,
  applyBugTransition,
  bugActions,
  bugInView,
  bugMatchesSeverity,
  compareBugSeverity,
  createBugReport,
  bugTextLimits,
  validateBugText,
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
    expect(
      createBugReport("BUG-9", { ...draft, environment: " " })?.environment,
    ).toBe("");
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
    expect(started?.notes).toEqual([
      { action: "start", text: "Looking", order: 1 },
    ]);
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
    expect(bugActions(bug.status)).toEqual(["start", "wait", "resolve"]);
    expect(applyBugTransition(bug, { kind: "start", note: " " })).toBeNull();
    expect(
      applyBugTransition(bug, { kind: "reopen", note: "Again" }),
    ).toBeNull();
    expect(bug.notes).toEqual([]);
  });

  it("adds follow-up messages without reopening resolved reports", () => {
    const bug = openBug();
    const messaged = addBugMessage(bug, "MSG-2", " Still blank ");
    expect(bug.status).toBe("Open");
    expect(messaged?.status).toBe("Open");
    expect(messaged?.messages).toEqual([
      { id: "MSG-2", text: "Still blank", order: 1, resumedFromWaiting: false },
    ]);
    expect(addBugMessage(bug, "MSG-3", " ")).toBeNull();
    const resolved = applyBugTransition(bug, {
      kind: "resolve",
      note: "Fixed",
    });
    expect(
      resolved ? addBugMessage(resolved, "MSG-4", "Again")?.status : null,
    ).toBe("Resolved");
  });

  it("allows explicitly unknown reproduction without storing hidden steps", () => {
    const bug = createBugReport("BUG-9", {
      ...draft,
      reproduction: "unknown",
      environment: "",
    });
    expect(bug?.reproduction).toBe("unknown");
    expect(bug?.steps).toBe("");
    expect(openBug().reproduction).toBe("known");
    expect(
      createBugReport("BUG-9", { ...draft, reproduction: "known", steps: " " }),
    ).toBeNull();
  });

  it("waits for information and returns to open when a reply arrives", () => {
    const waiting = applyBugTransition(openBug(), {
      kind: "wait",
      note: " Which release? ",
    });
    expect(waiting?.status).toBe("Waiting for reporter");
    expect(waiting?.notes).toEqual([
      { action: "wait", text: "Which release?", order: 1 },
    ]);
    if (!waiting) throw new Error("expected waiting report");
    expect(bugInView(waiting, "open")).toBe(true);
    expect(addBugMessage(waiting, "MSG-5", " ")).toBeNull();
    const replied = addBugMessage(waiting, "MSG-5", " Release 2 ");
    expect(replied?.status).toBe("Open");
    expect(replied?.messages.at(-1)?.text).toBe("Release 2");
    expect(replied?.messages.at(-1)).toMatchObject({
      order: 2,
      resumedFromWaiting: true,
    });
    expect(replied?.notes).toEqual(waiting.notes);
    expect(
      applyBugTransition(waiting, { kind: "resume", note: "Found the release" })
        ?.status,
    ).toBe("Open");
  });

  it("enforces trimmed text limits and ignores hidden reproduction steps", () => {
    expect(validateBugText("  ", 3)).toBe("required");
    expect(validateBugText("  ", 3, false)).toBeNull();
    expect(validateBugText(" abc ", 3)).toBeNull();
    expect(validateBugText(" abcd ", 3)).toBe("tooLong");
    for (const [field, limit] of Object.entries(bugTextLimits)) {
      const value =
        field === "pageUrl"
          ? `https://example.com/${"a".repeat(limit)}`
          : "a".repeat(limit + 1);
      expect(
        createBugReport("BUG", { ...draft, [field]: value }),
        field,
      ).toBeNull();
    }
    expect(
      createBugReport("BUG", {
        ...draft,
        reproduction: "unknown",
        steps: "x".repeat(10001),
      }),
    ).not.toBeNull();
  });

  it("orders interleaved accepted events without consuming order for rejected writes", () => {
    const waiting = applyBugTransition(openBug(), {
      kind: "wait",
      note: "Question",
    });
    if (!waiting) throw new Error("expected waiting report");
    expect(addBugMessage(waiting, "bad", "x".repeat(10001))).toBeNull();
    expect(
      applyBugTransition(waiting, { kind: "resume", note: "x".repeat(10001) }),
    ).toBeNull();
    const replied = addBugMessage(waiting, "reply", "Answer");
    if (!replied) throw new Error("expected reply");
    const resolved = applyBugTransition(replied, {
      kind: "resolve",
      note: "Fixed",
    });
    if (!resolved) throw new Error("expected resolved report");
    const followed = addBugMessage(resolved, "follow", "Follow-up");
    expect(followed?.status).toBe("Resolved");
    expect(followed?.notes.map((note) => note.order)).toEqual([1, 3]);
    expect(
      followed?.messages.map(({ order, resumedFromWaiting }) => ({
        order,
        resumedFromWaiting,
      })),
    ).toEqual([
      { order: 2, resumedFromWaiting: true },
      { order: 4, resumedFromWaiting: false },
    ]);
  });

  it("keeps available actions and transition validation consistent for every status", () => {
    const statuses = [
      "Open",
      "In progress",
      "Waiting for reporter",
      "Resolved",
    ] as const;
    const actions = ["start", "wait", "resume", "resolve", "reopen"] as const;
    for (const status of statuses) {
      const bug = { ...openBug(), status };
      for (const kind of actions) {
        const result = applyBugTransition(bug, { kind, note: "Reason" });
        expect(result !== null, `${status}: ${kind}`).toBe(
          bugActions(status).includes(kind),
        );
        expect(applyBugTransition(bug, { kind, note: " " })).toBeNull();
      }
    }
  });
});
