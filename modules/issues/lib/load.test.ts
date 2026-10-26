import { expect, test } from "vitest";

import { loadIssue, loadIssues } from "./load";

test("returns every issue when the query is empty", () => {
  expect(loadIssues("")).toHaveLength(3);
});

test("filters issues by title or id", () => {
  expect(loadIssues("export").map((issue) => issue.id)).toEqual(["SUP-1038"]);
});

test("finds an issue by id", () => {
  expect(loadIssue("SUP-1042")?.title).toBe("Login fails after password reset");
  expect(loadIssue("missing")).toBeUndefined();
});
