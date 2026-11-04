import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";

import { NoteAction } from "./note-action";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("validates domain text without submitting or clearing the draft", () => {
  const submit = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NoteAction
        actions={[{ value: "reply", label: "Reply" }]}
        validateNote={(value) => (value.trim().length > 5 ? "Too long" : null)}
        onSubmit={submit}
      />
    </NextIntlClientProvider>,
  );
  const note = screen.getByRole("textbox", { name: "Note" });
  fireEvent.change(note, { target: { value: "long reply" } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(submit).not.toHaveBeenCalled();
  expect(note).toHaveValue("long reply");
  expect(screen.getByText("Too long")).toBeVisible();
  fireEvent.change(note, { target: { value: "short" } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(submit).toHaveBeenCalledWith("reply", "short");
  expect(note).toHaveValue("");
});

test("retains rejected drafts and clears them only after an accepted update", () => {
  const submit = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NoteAction
        actions={[{ value: "reply", label: "Reply" }]}
        protectDraft
        errorMessage="Update failed"
        successMessage="Update accepted"
        onSubmit={submit}
      />
    </NextIntlClientProvider>,
  );
  const note = screen.getByRole("textbox", { name: "Note" });
  fireEvent.change(note, { target: { value: "My reply" } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Update failed");
  expect(note).toHaveValue("My reply");
  const dirtyUnload = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(dirtyUnload);
  expect(dirtyUnload.defaultPrevented).toBe(true);

  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Update accepted");
  expect(note).toHaveValue("");
  const savedUnload = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(savedUnload);
  expect(savedUnload.defaultPrevented).toBe(false);
});

test("preserves legacy void callbacks and rejects blank notes", () => {
  const submit = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NoteAction
        actions={[{ value: "start", label: "Start" }]}
        onSubmit={submit}
      />
    </NextIntlClientProvider>,
  );
  const note = screen.getByRole("textbox", { name: "Note" });
  fireEvent.change(note, { target: { value: "   " } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByText(messages.Portal.required)).toBeVisible();
  fireEvent.change(note, { target: { value: "Start work" } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(submit).toHaveBeenCalledWith("start", "Start work");
  expect(note).toHaveValue("");
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
