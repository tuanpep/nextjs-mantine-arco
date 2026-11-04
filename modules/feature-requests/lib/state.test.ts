import { describe, expect, it } from "vitest";

import {
  addFeatureNote,
  applyFeatureTransition,
  createFeatureRequest,
  FEATURE_TEXT_MAX_LENGTH,
  FEATURE_TITLE_MAX_LENGTH,
  featureStatuses,
  validateFeatureText,
} from "./state";
import { featureFixtures } from "./fixtures";

describe("feature requests", () => {
  it("validates trimmed boundaries for every draft field", () => {
    const draft = {
      projectId: "beacon-portal",
      title: "a".repeat(FEATURE_TITLE_MAX_LENGTH),
      problem: "b".repeat(FEATURE_TEXT_MAX_LENGTH),
      outcome: "c".repeat(FEATURE_TEXT_MAX_LENGTH),
    };
    expect(
      createFeatureRequest("FEAT-9", { ...draft, title: ` ${draft.title} ` })
        ?.title,
    ).toBe(draft.title);
    for (const field of ["title", "problem", "outcome"] as const) {
      expect(
        createFeatureRequest("FEAT-9", { ...draft, [field]: " " }),
      ).toBeNull();
      expect(
        createFeatureRequest("FEAT-9", {
          ...draft,
          [field]: `${draft[field]}x`,
        }),
      ).toBeNull();
    }
    expect(validateFeatureText(" ", 10)).toBe("required");
    expect(validateFeatureText("abcd", 3)).toBe("tooLong");
  });

  it("appends independent notes at every status without mutating the record", () => {
    for (const status of featureStatuses) {
      const original = { ...featureFixtures()[0], status };
      const before = structuredClone(original);
      const next = addFeatureNote(original, " Context for reviewers ");
      expect(next?.status).toBe(status);
      expect(next?.notes.at(-1)).toEqual({
        action: "comment",
        text: "Context for reviewers",
      });
      expect(original).toEqual(before);
      expect(addFeatureNote(original, " ")).toBeNull();
      expect(
        addFeatureNote(original, "x".repeat(FEATURE_TEXT_MAX_LENGTH + 1)),
      ).toBeNull();
      expect(
        addFeatureNote(original, "x".repeat(FEATURE_TEXT_MAX_LENGTH)),
      ).not.toBeNull();
    }
  });

  it("requires a bounded reason for both decisions", () => {
    const item = featureFixtures()[0];
    for (const kind of ["accept", "decline"] as const) {
      expect(
        applyFeatureTransition(item, {
          kind,
          note: "x".repeat(FEATURE_TEXT_MAX_LENGTH + 1),
        }),
      ).toBeNull();
      const next = applyFeatureTransition(item, { kind, note: " Reason " });
      expect(next?.status).toBe(kind === "accept" ? "Accepted" : "Declined");
      expect(next?.notes.at(-1)?.text).toBe("Reason");
      expect(item.notes).toEqual([]);
    }
  });
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
