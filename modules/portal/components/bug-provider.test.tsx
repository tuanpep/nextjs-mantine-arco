import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PortalProvider, usePortal } from "./portal-provider";

describe("Bug provider commands", () => {
  it("acknowledges accepted commands and preserves same-batch history", () => {
    const { result } = renderHook(() => usePortal(), {
      wrapper: PortalProvider,
    });
    let id = "";
    act(() => {
      const created = result.current.createBug({
        projectId: "project",
        title: "Bug",
        happened: "Something broke",
        steps: "Open the page",
        expected: "It works",
        environment: "",
        correlationId: "",
        impactDetail: "",
        pageUrl: "",
        attachments: [],
        impactScope: "only-me",
        urgency: "can-wait",
      });
      if (!created) throw new Error("Expected bug");
      id = created.id;

      expect(
        result.current.transitionBug("project", id, {
          kind: "wait",
          note: " Wait ",
        }),
      ).toBe(true);
      expect(result.current.addBugMessage("project", id, " Reply ")).toBe(true);
      expect(
        result.current.transitionBug("project", id, {
          kind: "start",
          note: "Start",
        }),
      ).toBe(true);
      expect(
        result.current.transitionBug("project", id, {
          kind: "resolve",
          note: "Resolve",
        }),
      ).toBe(true);
      expect(result.current.addBugMessage("project", id, " Follow-up ")).toBe(
        true,
      );

      expect(
        result.current.transitionBug("project", id, {
          kind: "start",
          note: "Invalid",
        }),
      ).toBe(false);
      expect(
        result.current.transitionBug("project", id, {
          kind: "reopen",
          note: "  ",
        }),
      ).toBe(false);
      expect(
        result.current.transitionBug("other", id, {
          kind: "reopen",
          note: "Wrong project",
        }),
      ).toBe(false);
      expect(
        result.current.transitionBug("project", "missing", {
          kind: "reopen",
          note: "Missing",
        }),
      ).toBe(false);
      expect(result.current.addBugMessage("project", id, "  ")).toBe(false);
      expect(result.current.addBugMessage("other", id, "Wrong project")).toBe(
        false,
      );
      expect(
        result.current.addBugMessage("project", "missing", "Missing"),
      ).toBe(false);
    });

    expect(result.current.bugs.find((item) => item.id === id)).toMatchObject({
      status: "Resolved",
      notes: [
        { action: "wait", text: "Wait", order: 1 },
        { action: "start", text: "Start", order: 3 },
        { action: "resolve", text: "Resolve", order: 4 },
      ],
      messages: [
        { text: "Reply", order: 2, resumedFromWaiting: true },
        { text: "Follow-up", order: 5, resumedFromWaiting: false },
      ],
    });
    const messages = result.current.bugs.find(
      (item) => item.id === id,
    )?.messages;
    expect(messages?.[0].id).not.toBe(messages?.[1].id);
  });
});
