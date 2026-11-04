import { expect, it } from "vitest";
import {
  addFeatureNote,
  applyFeatureTransition,
  createFeatureRequest,
  FEATURE_TEXT_MAX_LENGTH,
  FEATURE_TITLE_MAX_LENGTH,
  validateFeatureText,
} from "./state";
import { featureFixtures } from "./fixtures";

it("validates trimmed lengths and preserves status when commenting", () => {
  expect(validateFeatureText("  ", 1)).toBe("required");
  expect(validateFeatureText(" a ", 1)).toBeNull();
  expect(validateFeatureText("aa", 1)).toBe("tooLong");
  const draft = {
    projectId: "a",
    title: "x".repeat(FEATURE_TITLE_MAX_LENGTH),
    problem: "p",
    outcome: "o",
  };
  expect(createFeatureRequest("id", draft)).not.toBeNull();
  expect(
    createFeatureRequest("id", { ...draft, title: `${draft.title}x` }),
  ).toBeNull();
  const item = featureFixtures()[1];
  expect(addFeatureNote(item, " hi ")).toMatchObject({
    status: "Accepted",
    notes: [...item.notes, { action: "comment", text: "hi" }],
  });
  expect(
    addFeatureNote(item, "x".repeat(FEATURE_TEXT_MAX_LENGTH + 1)),
  ).toBeNull();
  expect(
    applyFeatureTransition(featureFixtures()[0], {
      kind: "accept",
      note: "x".repeat(FEATURE_TEXT_MAX_LENGTH + 1),
    }),
  ).toBeNull();
});
