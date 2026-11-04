import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortalProvider, usePortal } from "./portal-provider";

describe("feature provider commands", () => {
  it.each(["accept", "decline"] as const)(
    "preserves notes around %s and rejects invalid commands",
    (kind) => {
      const { result } = renderHook(() => usePortal(), {
        wrapper: PortalProvider,
      });
      let id = "";
      act(() => {
        const item = result.current.createFeature({
          projectId: "project",
          title: "Title",
          problem: "Problem",
          outcome: "Outcome",
        });
        if (!item) throw new Error("Expected feature");
        id = item.id;
        expect(result.current.addFeatureNote("other", id, "No")).toBe(false);
        expect(result.current.addFeatureNote("project", "missing", "No")).toBe(
          false,
        );
        expect(result.current.addFeatureNote("project", id, " ")).toBe(false);
        expect(
          result.current.addFeatureNote("project", id, "x".repeat(10001)),
        ).toBe(false);
        expect(
          result.current.transitionFeature("other", id, { kind, note: "No" }),
        ).toBe(false);
        expect(
          result.current.transitionFeature("project", "missing", {
            kind,
            note: "No",
          }),
        ).toBe(false);
        expect(
          result.current.transitionFeature("project", id, { kind, note: " " }),
        ).toBe(false);
        expect(result.current.addFeatureNote("project", id, " Before ")).toBe(
          true,
        );
        expect(
          result.current.transitionFeature("project", id, {
            kind,
            note: " Decision ",
          }),
        ).toBe(true);
        expect(
          result.current.transitionFeature("project", id, {
            kind,
            note: "Again",
          }),
        ).toBe(false);
        expect(result.current.addFeatureNote("project", id, " After ")).toBe(
          true,
        );
      });
      expect(
        result.current.features.find((item) => item.id === id),
      ).toMatchObject({
        status: kind === "accept" ? "Accepted" : "Declined",
        notes: [
          { action: "comment", text: "Before" },
          { action: kind, text: "Decision" },
          { action: "comment", text: "After" },
        ],
      });
    },
  );
});
