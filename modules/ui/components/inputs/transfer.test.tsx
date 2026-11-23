import { cleanup, fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

import { render } from "@/test-utils/render";

import { Transfer } from "./transfer";

afterEach(cleanup);

test("moves only explicitly selected enabled items in both directions", () => {
  const changed = vi.fn();
  function Example() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Transfer
        items={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta", disabled: true },
        ]}
        value={value}
        onChange={(next) => {
          changed(next);
          setValue(next);
        }}
        labels={{
          source: "Available",
          target: "Chosen",
          search: "Search",
          moveToTarget: "Add",
          moveToSource: "Remove",
        }}
      />
    );
  }
  render(<Example />);
  expect(screen.getByRole("checkbox", { name: "Beta" })).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
  expect(changed).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  expect(changed).toHaveBeenLastCalledWith(["a"]);
  fireEvent.click(screen.getByRole("checkbox", { name: "Alpha" }));
  fireEvent.click(screen.getByRole("button", { name: "Remove" }));
  expect(changed).toHaveBeenLastCalledWith([]);
});
