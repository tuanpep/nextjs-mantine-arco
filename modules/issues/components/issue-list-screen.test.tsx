import { cleanup, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import { render } from "@/test-utils/render";

import { issues } from "../lib/fixtures";
import { IssueListScreen } from "./issue-list-screen";

afterEach(() => {
  cleanup();
});

test("lists issues as links to their details", () => {
  render(<IssueListScreen issues={issues} />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Issues" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Login fails after password reset/ }),
  ).toHaveAttribute("href", "/issues/SUP-1042");
  expect(
    screen.getByRole("link", { name: /Export skips the last page/ }),
  ).toHaveAttribute("href", "/issues/SUP-1038");
});

test("shows an empty state when nothing matches", () => {
  render(<IssueListScreen issues={[]} />);

  expect(screen.getByText("No matching issues")).toBeInTheDocument();
});
