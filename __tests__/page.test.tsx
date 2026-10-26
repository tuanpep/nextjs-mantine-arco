import { cleanup, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import IssuesPage from "../app/(workspace)/issues/page";
import { render } from "../test-utils/render";

afterEach(() => {
  cleanup();
});

test("issues page lists the open issue", async () => {
  render(await IssuesPage({ searchParams: Promise.resolve({}) }));

  expect(
    screen.getByRole("heading", { level: 1, name: "Issues" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Login fails after password reset/ }),
  ).toBeInTheDocument();
});

test("issues page filters from the query", async () => {
  render(await IssuesPage({ searchParams: Promise.resolve({ q: "Export" }) }));

  expect(
    screen.getByRole("link", { name: /Export skips the last page/ }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Invitation email never arrives/ }),
  ).not.toBeInTheDocument();
});
