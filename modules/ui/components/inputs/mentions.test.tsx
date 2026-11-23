import { cleanup, fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test } from "vitest";

import { render } from "@/test-utils/render";

import { Mentions } from "./mentions";

afterEach(cleanup);

test("inserts a suggestion at the caret without losing surrounding text", () => {
  function Example() {
    const [value, setValue] = useState("Hello @alxx world");
    return (
      <Mentions
        label="Message"
        value={value}
        onChange={setValue}
        suggestions={[{ value: "alice", label: "Alice" }]}
      />
    );
  }
  render(<Example />);
  const input = screen.getByLabelText("Message");
  input.focus();
  if (!(input instanceof HTMLTextAreaElement))
    throw new Error("Expected textarea");
  input.setSelectionRange(9, 9);
  fireEvent.select(input);
  fireEvent.keyDown(input, { key: "Enter" });
  expect(input).toHaveValue("Hello @alice world");
  expect(input.selectionStart).toBe(12);
});
