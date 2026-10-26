import { expect, test } from "vitest";

import { loadIssueSearchParams } from "./search-params";

test("uses an empty query when the URL has none", () => {
  expect(loadIssueSearchParams({})).toEqual({ q: "" });
});

test("reads the query from search params", () => {
  expect(loadIssueSearchParams({ q: "Export" })).toEqual({ q: "Export" });
});
