import { expect, it } from "vitest";
import { feedbackQueueReturnHref } from "./queue-navigation";

it("accepts and canonicalizes only valid same-queue queries", () => {
  const base = "/projects/a/feedback";
  expect(feedbackQueueReturnHref(base, `${base}?page=2&view=closed&q=hi`)).toBe(
    `${base}?q=hi&view=closed&page=2`,
  );
  expect(
    feedbackQueueReturnHref(base, `${base}?view=open&sort=title-asc&page=1`),
  ).toBe(base);
  for (const value of [
    null,
    "https://evil.test/",
    "//evil.test/",
    `${base}/other`,
    `${base}?q=x#`,
    `${base}?q=%zz`,
    `${base}?q=x&q=y`,
    `${base}?other=x`,
    `${base}?view=no`,
    `${base}?sort=no`,
    `${base}?page=0`,
    `${base}?page=1x`,
    `${base}?page=1.5`,
  ]) {
    expect(feedbackQueueReturnHref(base, value)).toBe(base);
  }
});
