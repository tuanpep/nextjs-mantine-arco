import { expect, it } from "vitest";
import { featureQueueReturnHref } from "./queue-navigation";

it("only returns the exact queue path and query", () => {
  const base = "/projects/a/features";
  expect(featureQueueReturnHref(base, `${base}?view=closed`)).toBe(
    `${base}?view=closed`,
  );
  for (const value of [
    null,
    "https://evil.test/",
    "/projects/b/features?q=x",
    `${base}/other?q=x`,
    `${base}?q=x#fragment`,
  ]) {
    expect(featureQueueReturnHref(base, value)).toBe(base);
  }
});
