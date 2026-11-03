import { describe, expect, it } from "vitest";

import { applyFeatureTransition, createFeatureRequest } from "./state";

describe("feature requests", () => {
  it("accepts or declines a submitted request once", () => {
    const item = createFeatureRequest("FEAT-9", {
      projectId: "beacon-portal",
      title: " Named views ",
      problem: "Filters are rebuilt",
      outcome: "Teams reopen a view",
    });
    expect(item?.status).toBe("Submitted");
    const accepted = item
      ? applyFeatureTransition(item, { kind: "accept", note: "Later review" })
      : null;
    expect(accepted?.status).toBe("Accepted");
    expect(
      accepted
        ? applyFeatureTransition(accepted, { kind: "decline", note: "No" })
        : null,
    ).toBeNull();
    if (!item) throw new Error("expected a feature request");
    expect(
      applyFeatureTransition(item, { kind: "decline", note: " " }),
    ).toBeNull();
  });
});
