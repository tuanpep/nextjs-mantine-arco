import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { render } from "@/test-utils/render";
import { HelpScreen } from "./help-screen";

afterEach(cleanup);

test("routes employees to the correct help and recovers from an empty search", () => {
  render(<HelpScreen />);
  expect(
    screen.getByRole("link", { name: "Report a production issue" }),
  ).toHaveAttribute("href", "/support/new");
  fireEvent.change(
    screen.getByRole("textbox", { name: "Find the right help" }),
    { target: { value: "nonexistent" } },
  );
  expect(
    screen.getByRole("heading", { name: "No matching help topics" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
  expect(
    screen.getByRole("link", { name: "Open UAT campaigns" }),
  ).toHaveAttribute("href", "/uat");
});
