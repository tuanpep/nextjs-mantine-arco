import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortalProvider, usePortal } from "./portal-provider";

describe("feedback provider commands", () => {
  it("rejects invalid and repeated reviews, including immediately after creation", () => {
    const { result } = renderHook(() => usePortal(), {
      wrapper: PortalProvider,
    });
    let id = "";
    act(() => {
      const item = result.current.createFeedback({
        projectId: "project",
        title: "Title",
        observation: "Observation",
      });
      if (!item) throw new Error("Expected feedback");
      id = item.id;
      expect(result.current.reviewFeedback("other", id, "Note")).toBe(false);
      expect(result.current.reviewFeedback("project", "missing", "Note")).toBe(
        false,
      );
      expect(result.current.reviewFeedback("project", id, " ")).toBe(false);
      expect(
        result.current.reviewFeedback("project", id, "x".repeat(10001)),
      ).toBe(false);
      expect(result.current.reviewFeedback("project", id, " Note ")).toBe(true);
      expect(result.current.reviewFeedback("project", id, "Again")).toBe(false);
    });
    expect(
      result.current.feedback.find((item) => item.id === id),
    ).toMatchObject({
      status: "Reviewed",
      notes: [{ action: "review", text: "Note" }],
    });
  });
});
