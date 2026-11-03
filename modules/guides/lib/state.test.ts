import { describe, expect, it } from "vitest";

import { createGuideArticle } from "./state";

describe("guides", () => {
  it("requires a title, summary, and body", () => {
    expect(
      createGuideArticle("GUIDE-9", {
        projectId: "beacon-portal",
        title: " Export ",
        summary: "Download a view",
        body: "Choose Export.",
      })?.title,
    ).toBe("Export");
    expect(
      createGuideArticle("GUIDE-9", {
        projectId: "beacon-portal",
        title: "Export",
        summary: " ",
        body: "Choose Export.",
      }),
    ).toBeNull();
  });
});
