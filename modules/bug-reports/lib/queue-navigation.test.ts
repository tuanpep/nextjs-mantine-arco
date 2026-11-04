import { describe, expect, it } from "vitest";

import { bugQueueReturnHref } from "./queue-navigation";

const base = "/projects/beacon-portal/support/bugs";

describe("bug queue return navigation", () => {
  it("preserves a query for this project's list only", () => {
    const href = `${base}?view=all&q=export&sort=title&page=2`;
    expect(bugQueueReturnHref(base, href)).toBe(href);
    expect(bugQueueReturnHref(base, base)).toBe(base);
    for (const value of [
      null,
      "https://example.com",
      "//example.com",
      "/projects/orchid-reports/support/bugs?q=x",
      `${base}/BUG-1`,
      `${base}/../help`,
      "javascript:alert(1)",
    ]) {
      expect(bugQueueReturnHref(base, value)).toBe(base);
    }
  });
});
