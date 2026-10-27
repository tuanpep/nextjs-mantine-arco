import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { render } from "@/test-utils/render";
import { SupportOperations } from "./support-operations";
import { SupportProvider } from "./support-provider";

afterEach(cleanup);

test("operator must assign a new issue before posting progress", () => {
  render(
    <SupportProvider>
      <SupportOperations />
    </SupportProvider>,
  );
  fireEvent.change(screen.getByLabelText("Select issue"), {
    target: { value: "SUP115" },
  });
  expect(
    screen.getByRole("button", { name: "Record support action in demo" }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Assign issue handler" }));
  expect(
    screen.getByText("Choose a handler.", { exact: true }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Issue handler"), {
    target: { value: "Sam Rivera" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Assign issue handler" }));
  expect(screen.getByText("Handling", { exact: true })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Support action"), {
    target: { value: "clarify" },
  });
  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Progress note or employee instructions",
    }),
    { target: { value: "Which monthly report are you opening?" } },
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Record support action in demo" }),
  );
  expect(
    screen.getByText("Waiting for sender", { exact: true }),
  ).toBeInTheDocument();
});
