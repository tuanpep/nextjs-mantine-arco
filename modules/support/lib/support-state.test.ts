import { describe, expect, test } from "vitest";

import { supportFixtures } from "./fixtures";
import {
  applySenderAction,
  applyHandlerAction,
  createSupportRequest,
  filterSupport,
} from "./support-state";

function fixture(id: string) {
  const item = supportFixtures.find((request) => request.id === id);
  if (!item) throw new Error("Missing test fixture");
  return item;
}

describe("application triage", () => {
  test("unidentified intake is routed without replacing the request or conversation", () => {
    const draft = createSupportRequest("SUP-unknown", fixture("SUP112"), null);
    expect(draft.applicationId).toBeNull();
    expect(draft.responsibleTeam).toBe("DX triage");
    const routed = applyHandlerAction(draft, {
      kind: "route",
      applicationId: "orchid-reports",
    });
    expect(routed.id).toBe(draft.id);
    expect(routed.applicationId).toBe("orchid-reports");
    expect(routed.responsibleTeam).toBe("Business Analytics");
    expect(routed.status).toBe("Unclaimed");
    expect(routed.conversation.at(-1)?.text).toContain("Orchid Reports");
  });

  test("rejects unknown applications and rerouting already identified requests", () => {
    const draft = createSupportRequest("SUP-unknown", fixture("SUP112"), null);
    expect(() =>
      applyHandlerAction(draft, { kind: "route", applicationId: "missing" }),
    ).toThrow("Choose a known application");
    expect(() =>
      applyHandlerAction(fixture("SUP112"), {
        kind: "route",
        applicationId: "orchid-reports",
      }),
    ).toThrow("Only unidentified requests");
  });
});

describe("sender transitions", () => {
  test("reply retains the handler and returns next action without concluding", () => {
    const item = applySenderAction(fixture("SUP112"), {
      kind: "reply",
      text: " April, no filter. ",
    });
    expect(item.status).toBe("Handling");
    expect(item.handler).toBe("Mai Tran");
    expect(item.nextActor).toBe("Handler");
    expect(item.conversation.at(-1)).toEqual({
      author: "Jo Lee",
      text: "April, no filter.",
    });
    expect(item.outcomes).toEqual([]);
  });

  test("retest pass is not resolution; fail and unable require a note", () => {
    const item = fixture("SUP113");
    expect(
      applySenderAction(item, { kind: "retest", result: "Pass", text: "" })
        .status,
    ).toBe("Handling");
    expect(
      applySenderAction(item, { kind: "retest", result: "Fail", text: " " }),
    ).toBe(item);
    expect(
      applySenderAction(item, { kind: "retest", result: "Unable", text: "" }),
    ).toBe(item);
    expect(
      applySenderAction(item, {
        kind: "retest",
        result: "Unable",
        text: "Demo unavailable",
      }).nextActor,
    ).toBe("Handler");
  });

  test("reopening preserves the previous outcome and requires a reason", () => {
    const original = fixture("SUP114");
    expect(applySenderAction(original, { kind: "reopen", text: " " })).toBe(
      original,
    );
    const reopened = applySenderAction(original, {
      kind: "reopen",
      text: "The same totals mismatch returned.",
    });
    expect(reopened.status).toBe("Handling");
    expect(reopened.outcomes[0]).toEqual({
      ...original.outcomes[0],
      superseded: true,
    });
    expect(original.outcomes[0]?.superseded).toBe(false);
  });

  test("stale sender action cannot repeat or change another state", () => {
    const replied = applySenderAction(fixture("SUP112"), {
      kind: "reply",
      text: "April",
    });
    expect(applySenderAction(replied, { kind: "reply", text: "April" })).toBe(
      replied,
    );
    expect(
      applySenderAction(fixture("SUP115"), {
        kind: "reopen",
        text: "Please reopen",
      }),
    ).toBe(fixture("SUP115"));
  });
});

test("creation fixes sender, starts unclaimed and sets priority from impact and urgency", () => {
  const item = createSupportRequest("local-id", {
    summary: " Help ",
    situation: " Trying to export ",
    expected: " Rows export ",
    impact: "",
    environment: " demo ",
    reproSteps: " 1. Open report ",
    correlationId: " req-123 ",
    requestType: "broken",
    impactScope: "my-team",
    urgency: "today",
    attachments: [
      {
        id: "a1",
        name: "shot.png",
        sizeLabel: "12 KB",
        status: "Ready",
      },
      {
        id: "a2",
        name: "pending.png",
        sizeLabel: "8 KB",
        status: "Scanning",
      },
    ],
  });
  expect(item.sender).toBe("Jo Lee");
  expect(item.status).toBe("Unclaimed");
  expect(item.handler).toBeNull();
  expect(item.nextActor).toBe("Responsible team");
  expect(item.summary).toBe("Help");
  expect(item.reproSteps).toBe("1. Open report");
  expect(item.correlationId).toBe("req-123");
  expect(item.priority).toBe("High");
  expect(item.autoClosePaused).toBe(false);
  expect(item.lastDisposition).toBeNull();
  expect(item.attachments).toEqual([
    { id: "a1", name: "shot.png", sizeLabel: "12 KB", status: "Ready" },
  ]);
  expect(item.csat).toBeNull();
});

describe("handler triage dispositions", () => {
  test("needs-info claims unclaimed work and waits on the sender", () => {
    const item = applyHandlerAction(fixture("SUP115"), {
      kind: "needs-info",
      text: "Which guide did you open?",
    });
    expect(item.handler).toBe("Demo DX operator");
    expect(item.status).toBe("Waiting for sender");
    expect(item.lastDisposition).toBe("needs-info");
    expect(item.nextAction).toBe("Which guide did you open?");
  });

  test("link-eng pauses auto-close without resolving", () => {
    const item = applyHandlerAction(fixture("SUP116"), {
      kind: "link-eng",
      engTrackerId: " ENG-9 ",
      text: "Tracking the filter reset.",
    });
    expect(item.status).toBe("Handling");
    expect(item.engTrackerId).toBe("ENG-9");
    expect(item.autoClosePaused).toBe(true);
    expect(item.lastDisposition).toBe("linked-eng");
  });

  test("duplicate and misroute resolve with structured outcomes", () => {
    const duplicate = applyHandlerAction(fixture("SUP116"), {
      kind: "duplicate",
      relatedRequestId: "sup112",
      text: "Same export symptom.",
    });
    expect(duplicate.status).toBe("Resolved");
    expect(duplicate.relatedRequestId).toBe("SUP112");
    expect(duplicate.outcomes.at(-1)?.summary).toBe("Duplicate of SUP112");

    const misrouted = applyHandlerAction(fixture("SUP115"), {
      kind: "misroute",
      target: "ideas",
      text: "This is a product wish, not a break.",
    });
    expect(misrouted.status).toBe("Resolved");
    expect(misrouted.misrouteTarget).toBe("ideas");
    expect(misrouted.lastDisposition).toBe("misroute");
  });

  test("workaround can keep the ticket open or resolve it", () => {
    const open = applyHandlerAction(fixture("SUP116"), {
      kind: "workaround",
      text: "Re-apply filters after navigation.",
      keepOpen: true,
    });
    expect(open.status).toBe("Waiting for sender");
    expect(open.lastDisposition).toBe("workaround");

    const closed = applyHandlerAction(fixture("SUP116"), {
      kind: "workaround",
      text: "Use the saved view instead.",
      keepOpen: false,
    });
    expect(closed.status).toBe("Resolved");
    expect(closed.outcomes.at(-1)?.summary).toBe("Workaround provided");
  });
});

test("handler can adjust priority without resolving", () => {
  const item = applyHandlerAction(fixture("SUP116"), {
    kind: "set-priority",
    priority: "Critical",
  });
  expect(item.priority).toBe("Critical");
  expect(item.status).toBe("Handling");
});

test("csat is recorded once on a resolved request", () => {
  const scored = applySenderAction(fixture("SUP114"), {
    kind: "csat",
    score: 4,
  });
  expect(scored.csat).toBe(4);
  expect(applySenderAction(scored, { kind: "csat", score: 1 }).csat).toBe(4);
});

test("collection combines query and status filters", () => {
  expect(
    filterSupport(supportFixtures, " SUP113 ", "Waiting for retest").map(
      (item) => item.id,
    ),
  ).toEqual(["SUP113"]);
  expect(filterSupport(supportFixtures, "SUP113", "Resolved")).toEqual([]);
  expect(filterSupport(supportFixtures, "", "all")).toHaveLength(
    supportFixtures.length,
  );
});

test("collection open and closed views split resolved requests", () => {
  const openIds = filterSupport(supportFixtures, "", "all", "open").map(
    (item) => item.id,
  );
  const closedIds = filterSupport(supportFixtures, "", "all", "closed").map(
    (item) => item.id,
  );
  expect(openIds).not.toContain("SUP114");
  expect(closedIds).toContain("SUP114");
  expect(closedIds.every((id) => !openIds.includes(id))).toBe(true);
  expect(openIds.length + closedIds.length).toBe(supportFixtures.length);
});

test("staff takes a new issue through clarification, retest, resolution and reopening", () => {
  const assigned = applyHandlerAction(fixture("SUP115"), {
    kind: "assign",
    handler: "Mai Tran",
  });
  expect(assigned.status).toBe("Handling");
  const waiting = applyHandlerAction(assigned, {
    kind: "clarify",
    text: "Which report period?",
  });
  expect(waiting.nextActor).toBe("Sender");
  const replied = applySenderAction(waiting, { kind: "reply", text: "April" });
  const retest = applyHandlerAction(replied, {
    kind: "retest",
    text: "Export April again and compare totals.",
  });
  const passed = applySenderAction(retest, {
    kind: "retest",
    result: "Pass",
    text: "",
  });
  expect(passed.status).toBe("Handling");
  const resolved = applyHandlerAction(passed, {
    kind: "resolve",
    outcome: {
      summary: "Export corrected",
      work: "Verified totals",
      limitations: "Demo only",
    },
  });
  expect(resolved.status).toBe("Resolved");
  expect(resolved.outcomes[0]?.superseded).toBe(false);
  expect(
    applySenderAction(resolved, { kind: "reopen", text: "It happened again" })
      .outcomes[0]?.superseded,
  ).toBe(true);
});

test("staff actions reject missing ownership, empty instructions and premature resolution", () => {
  expect(() =>
    applyHandlerAction(fixture("SUP115"), {
      kind: "update",
      text: "Investigating",
    }),
  ).toThrow("Assign a handler");
  expect(() =>
    applyHandlerAction(fixture("SUP116"), { kind: "clarify", text: " " }),
  ).toThrow("Add a progress note");
  expect(() =>
    applyHandlerAction(fixture("SUP113"), {
      kind: "resolve",
      outcome: { summary: "Done", work: "Checked", limitations: "None" },
    }),
  ).toThrow("Review the employee");
  expect(() =>
    applyHandlerAction(fixture("SUP114"), {
      kind: "assign",
      handler: "Sam Rivera",
    }),
  ).toThrow("Reopen");
});

test("employee updates preserve the current responsibility without replying or reopening", () => {
  for (const id of ["SUP115", "SUP116", "SUP112", "SUP113"]) {
    const original = fixture(id);
    const updated = applySenderAction(original, {
      kind: "comment",
      text: " Now affects my team. ",
    });
    expect(updated.status).toBe(original.status);
    expect(updated.nextAction).toBe(original.nextAction);
    expect(updated.conversation.at(-1)?.text).toBe("Now affects my team.");
  }
  expect(
    applySenderAction(fixture("SUP114"), { kind: "comment", text: "Update" }),
  ).toBe(fixture("SUP114"));
});
