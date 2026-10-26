import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import { render } from "@/test-utils/render";

import { issues } from "../lib/fixtures";
import { IssueDetailsScreen } from "./issue-details-screen";

afterEach(() => {
  cleanup();
});

test("shows the issue and a link back to the list", () => {
  render(<IssueDetailsScreen issue={issues[0]} />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Login fails after password reset",
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Issues" })).toHaveAttribute(
    "href",
    "/issues",
  );
});

test("switches to activity and adds a comment", () => {
  render(<IssueDetailsScreen issue={issues[0]} />);

  fireEvent.click(screen.getByRole("tab", { name: "Activity" }));
  expect(screen.getByText("Status set to Open")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("tab", { name: "Discussion" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Comment" }), {
    target: { value: "The reset link expired" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Comment" }));

  expect(screen.getByText("The reset link expired")).toBeInTheDocument();
});
