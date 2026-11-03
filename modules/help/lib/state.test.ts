import { describe, expect, it } from "vitest";

import { applyHelpTransition, createHelpRequest } from "./state";

describe("help requests", () => {
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
