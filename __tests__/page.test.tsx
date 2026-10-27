import { cleanup, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import ProjectsPage from "../app/(workspace)/projects/page";
import { render } from "../test-utils/render";

afterEach(() => {
  cleanup();
});

test("legacy projects route opens the application directory", () => {
  render(<ProjectsPage />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Applications" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Open Beacon Portal" }),
  ).toBeInTheDocument();
});
