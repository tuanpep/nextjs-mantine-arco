import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { useUnsavedDraft } from "./use-unsaved-draft";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Draft({ dirty }: { dirty: boolean }) {
  useUnsavedDraft(dirty, "Discard draft?");
  return <a href="/another-page">Leave</a>;
}

test("protects dirty drafts and removes the guard when saved", () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  const view = render(<Draft dirty />);
  expect(fireEvent.click(screen.getByRole("link", { name: "Leave" }))).toBe(
    false,
  );
  expect(confirm).toHaveBeenCalledWith("Discard draft?");
  const unload = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(unload);
  expect(unload.defaultPrevented).toBe(true);
  view.rerender(<Draft dirty={false} />);
  const savedUnload = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(savedUnload);
  expect(savedUnload.defaultPrevented).toBe(false);
});

test("allows confirmed navigation and ignores modified link clicks", () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
  render(<Draft dirty />);
  const link = screen.getByRole("link", { name: "Leave" });
  fireEvent.click(link, { ctrlKey: true });
  expect(confirm).not.toHaveBeenCalled();
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  link.dispatchEvent(event);
  expect(confirm).toHaveBeenCalledOnce();
  expect(event.defaultPrevented).toBe(false);
});
