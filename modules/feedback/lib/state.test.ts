import { describe, expect, it } from "vitest";

import { applyFeedbackReview, createFeedbackItem } from "./state";

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
});
