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

test("creation fixes sender, starts unclaimed and makes no handling promise", () => {
  const item = createSupportRequest("local-id", {
    summary: " Help ",
    situation: " Trying to export ",
    expected: "",
    impact: "",
    environment: "",
  });
  expect(item.sender).toBe("Jo Lee");
  expect(item.status).toBe("Unclaimed");
  expect(item.handler).toBeNull();
  expect(item.nextActor).toBe("Responsible team");
  expect(item.summary).toBe("Help");
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
