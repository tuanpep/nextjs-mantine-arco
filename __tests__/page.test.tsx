import { screen } from "@testing-library/react";
import { expect, test } from "vitest";

import HomePage from "../app/page";
import { render } from "../test-utils/render";

test("home page renders the template title", () => {
  render(<HomePage />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Next.js FE" }),
  ).toBeInTheDocument();
});
