import { describe, expect, it } from "vitest";

import { applyHelpTransition, createHelpRequest, helpActions } from "./state";

describe("help requests", () => {
  it("offers replies in both states and retains trimmed conversation history", () => {
    expect(helpActions("Open")).toEqual(["reply", "answer"]);
    expect(helpActions("Answered")).toEqual(["reply", "reopen"]);
    const item = createHelpRequest("HELP-1", {
      projectId: "project",
      question: " Question ",
      tried: " Tried ",
    });
    expect(item).not.toBeNull();
    if (!item) return;
    expect(item.question).toBe("Question");
    expect(item.tried).toBe("Tried");
    const reply = applyHelpTransition(item, { kind: "reply", note: " First " });
    expect(reply?.status).toBe("Open");
    if (!reply) return;
    const answered = applyHelpTransition(reply, {
      kind: "answer",
      note: " Answer ",
    });
    if (!answered) throw new Error("Expected answer");
    expect(
      applyHelpTransition(answered, { kind: "answer", note: "Again" }),
    ).toBeNull();
    const afterReply = applyHelpTransition(answered, {
      kind: "reply",
      note: " Follow-up ",
    });
    expect(afterReply?.status).toBe("Answered");
    expect(afterReply?.notes).toEqual([
      { action: "reply", text: "First" },
      { action: "answer", text: "Answer" },
      { action: "reply", text: "Follow-up" },
    ]);
    expect(item.notes).toEqual([]);
    for (const kind of ["reply", "answer", "reopen"] as const) {
      expect(applyHelpTransition(answered, { kind, note: "  " })).toBeNull();
    }
    expect(
      createHelpRequest("HELP-2", {
        projectId: "project",
        question: "Question",
        tried: " ",
      }),
    ).toBeNull();
  });
  it("answers an open question and reopens it with the answer kept", () => {
    const item = createHelpRequest("HELP-9", {
      projectId: "beacon-portal",
      question: " Where is export? ",
      tried: "I opened the menu",
    });
    expect(item?.status).toBe("Open");
    const answered = item
      ? applyHelpTransition(item, { kind: "answer", note: "Use the toolbar" })
      : null;
    expect(answered?.status).toBe("Answered");
    const reopened = answered
      ? applyHelpTransition(answered, { kind: "reopen", note: "Still missing" })
      : null;
    expect(reopened?.status).toBe("Open");
    expect(reopened?.notes.map((note) => note.action)).toEqual([
      "answer",
      "reopen",
    ]);
    expect(
      createHelpRequest("HELP-9", {
        projectId: "beacon-portal",
        question: " ",
        tried: "Tried",
      }),
    ).toBeNull();
    expect(
      item ? applyHelpTransition(item, { kind: "reopen", note: "No" }) : null,
    ).toBeNull();
  });
});
