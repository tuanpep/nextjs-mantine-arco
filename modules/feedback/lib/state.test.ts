import { describe, expect, it } from "vitest";

import {
  applyFeedbackReview,
  createFeedbackItem,
  feedbackInView,
  validateFeedbackText,
  FEEDBACK_TITLE_MAX_LENGTH,
  FEEDBACK_TEXT_MAX_LENGTH,
} from "./state";

describe("feedback", () => {
  it("reviews a new observation once", () => {
    const item = createFeedbackItem("FB-9", {
      projectId: "beacon-portal",
      title: " Label is easy to miss ",
      observation: "It sits far from the action",
    });
    expect(item?.status).toBe("New");
    const reviewed = item ? applyFeedbackReview(item, " Noted only ") : null;
    expect(reviewed?.status).toBe("Reviewed");
    expect(reviewed?.notes[0]?.text).toBe("Noted only");
    expect(reviewed ? applyFeedbackReview(reviewed, "Again") : null).toBeNull();
    expect(item ? applyFeedbackReview(item, " ") : null).toBeNull();
  });
  it("validates trimmed lengths on creation and review", () => {
    expect(validateFeedbackText("  ", 1)).toBe("required");
    expect(validateFeedbackText(" a ", 1)).toBeNull();
    expect(validateFeedbackText(" ab ", 1)).toBe("tooLong");
    const draft = {
      projectId: "p",
      title: "x".repeat(FEEDBACK_TITLE_MAX_LENGTH),
      observation: "y".repeat(FEEDBACK_TEXT_MAX_LENGTH),
    };
    const item = createFeedbackItem("1", draft);
    expect(item).not.toBeNull();
    expect(
      createFeedbackItem("1", { ...draft, title: draft.title + "x" }),
    ).toBeNull();
    expect(
      createFeedbackItem("1", {
        ...draft,
        observation: draft.observation + "x",
      }),
    ).toBeNull();
    if (!item) throw new Error("expected item");
    expect(
      applyFeedbackReview(item, "x".repeat(FEEDBACK_TEXT_MAX_LENGTH + 1)),
    ).toBeNull();
    expect(
      applyFeedbackReview(item, "x".repeat(FEEDBACK_TEXT_MAX_LENGTH)),
    ).not.toBeNull();
    expect(feedbackInView(item, "all")).toBe(true);
    expect(feedbackInView(item, "closed")).toBe(false);
    const reviewed = applyFeedbackReview(item, "ok");
    expect(reviewed && feedbackInView(reviewed, "closed")).toBe(true);
  });
});
