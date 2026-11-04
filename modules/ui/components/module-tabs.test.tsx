import { cleanup, fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test } from "vitest";

import { render } from "@/test-utils/render";

import { ModuleTabs, ModuleTabPanel } from "./module-tabs";

afterEach(cleanup);

function Queue() {
  const [value, setValue] = useState("open");
  return (
    <>
      <ModuleTabs
        id="queue"
        ariaLabel="Queue views"
        value={value}
        items={[
          { value: "open", label: "Open", count: 2 },
          { value: "closed", label: "Closed", count: 1 },
        ]}
        onChange={setValue}
      />
      <ModuleTabPanel id="queue" value={value}>
        {value === "open" ? "Active records" : "Closed records"}
      </ModuleTabPanel>
    </>
  );
}

test("connects queue views to their content and updates the panel label", () => {
  render(<Queue />);
  const open = screen.getByRole("tab", { name: "Open (2)" });
  const panel = screen.getByRole("tabpanel", { name: "Open (2)" });
  expect(open).toHaveAttribute("aria-controls", panel.id);
  expect(panel).toHaveAttribute("aria-labelledby", open.id);
  expect(panel).toHaveTextContent("Active records");
  fireEvent.click(screen.getByRole("tab", { name: "Closed (1)" }));
  expect(
    screen.getByRole("tabpanel", { name: "Closed (1)" }),
  ).toHaveTextContent("Closed records");
  expect(open).toHaveAttribute("aria-selected", "false");
});

test("arrow keys switch views and keep keyboard focus on the active tab", () => {
  render(<Queue />);
  const open = screen.getByRole("tab", { name: "Open (2)" });
  open.focus();
  fireEvent.keyDown(open, { key: "ArrowRight" });
  const closed = screen.getByRole("tab", { name: "Closed (1)" });
  expect(closed).toHaveFocus();
  expect(closed).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel", { name: "Closed (1)" })).toBeVisible();
});
