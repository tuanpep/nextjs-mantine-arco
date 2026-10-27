import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { render } from "@/test-utils/render";
import { LearningScreen } from "./learning-screen";

afterEach(cleanup);

describe("learning center", () => {
  it("searches readable guides, records feedback, and clears empty filters", async () => {
    render(<LearningScreen />);
    fireEvent.change(screen.getByLabelText("Search guides"), {
      target: { value: "acceptance" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Run your first acceptance test/ }),
    );
    await waitFor(() =>
      expect(screen.getByText("Prepare a safe test")).toBeVisible(),
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Yes, helpful" })[0]);
    expect(
      screen.getByText(/Feedback noted in this demo: helpful/),
    ).toBeVisible();
    fireEvent.change(screen.getByLabelText("Search guides"), {
      target: { value: "no-such-guide" },
    });
    expect(screen.getByText("No matching guides")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("4 guides found")).toBeVisible();
  });

  it("keeps role checklists independent and lets users undo completion", () => {
    render(<LearningScreen />);
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Read the workspace and access guide",
      }),
    );
    expect(
      screen.getByText("1 of 4 steps complete for requester"),
    ).toBeVisible();
    fireEvent.change(screen.getByLabelText("Your learning role"), {
      target: { value: "Tester" },
    });
    expect(screen.getByText("0 of 4 steps complete for tester")).toBeVisible();
    fireEvent.change(screen.getByLabelText("Your learning role"), {
      target: { value: "Requester" },
    });
    expect(
      screen.getByRole("checkbox", {
        name: "Read the workspace and access guide",
      }),
    ).toBeChecked();
    fireEvent.click(
      screen.getByRole("checkbox", {
        name: "Read the workspace and access guide",
      }),
    );
    expect(
      screen.getByText("0 of 4 steps complete for requester"),
    ).toBeVisible();
  });
});
