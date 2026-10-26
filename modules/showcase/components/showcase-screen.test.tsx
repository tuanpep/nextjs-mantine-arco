import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import { render } from "@/test-utils/render";

import { ShowcaseScreen } from "./showcase-screen";

afterEach(() => {
  cleanup();
});

test("shows the common control groups", () => {
  render(<ShowcaseScreen />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Showcase" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 2, name: "Buttons" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { level: 2, name: "Inputs" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Activity" })).toBeInTheDocument();
});

test("opens the close-issue modal", async () => {
  render(<ShowcaseScreen />);

  fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

  expect(
    await screen.findByRole("dialog", { name: "Close issue" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Mark SUP-1042 as resolved?")).toBeInTheDocument();
});
