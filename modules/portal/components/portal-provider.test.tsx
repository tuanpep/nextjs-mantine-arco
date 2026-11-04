import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PortalProvider, usePortal } from "./portal-provider";

describe("Help provider commands", () => {
  it("acknowledges same-batch commands and retains history", () => {
    const { result } = renderHook(() => usePortal(), {
      wrapper: PortalProvider,
    });
    let id = "";
    act(() => {
      const created = result.current.createHelp({
        projectId: "project",
        question: "Question",
        tried: "Tried",
      });
      if (!created) throw new Error("Expected request");
      id = created.id;
      expect(
        result.current.transitionHelp("project", id, {
          kind: "reply",
          note: " First ",
        }),
      ).toBe(true);
      expect(
        result.current.transitionHelp("project", id, {
          kind: "answer",
          note: "Answer",
        }),
      ).toBe(true);
      expect(
        result.current.transitionHelp("project", id, {
          kind: "answer",
          note: "Again",
        }),
      ).toBe(false);
      expect(
        result.current.transitionHelp("other", id, {
          kind: "reply",
          note: "Wrong project",
        }),
      ).toBe(false);
      expect(
        result.current.transitionHelp("project", id, {
          kind: "reply",
          note: "  ",
        }),
      ).toBe(false);
      expect(
        result.current.transitionHelp("project", "missing", {
          kind: "reply",
          note: "Missing",
        }),
      ).toBe(false);
      expect(
        result.current.transitionHelp("project", id, {
          kind: "reply",
          note: "Follow-up",
        }),
      ).toBe(true);
      expect(
        result.current.transitionHelp("project", id, {
          kind: "reopen",
          note: "Reopen",
        }),
      ).toBe(true);
    });
    expect(result.current.help.find((item) => item.id === id)).toMatchObject({
      status: "Open",
      notes: [
        { action: "reply", text: "First" },
        { action: "answer", text: "Answer" },
        { action: "reply", text: "Follow-up" },
        { action: "reopen", text: "Reopen" },
      ],
    });
  });
});
