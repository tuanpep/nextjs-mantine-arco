import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";
import { FeedbackReviewForm } from "./feedback-review-form";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("validates notes and retains a failed draft with navigation protection", () => {
  const submit = vi.fn(() => false);
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FeedbackReviewForm onSubmit={submit} />
      <a href="/elsewhere">Leave</a>
    </NextIntlClientProvider>,
  );
  const note = screen.getByRole("textbox");
  const button = screen.getByRole("button");
  fireEvent.click(button);
  expect(submit).not.toHaveBeenCalled();
  fireEvent.change(note, { target: { value: "x".repeat(10001) } });
  fireEvent.click(button);
  expect(submit).not.toHaveBeenCalled();
  fireEvent.change(note, { target: { value: "Review note" } });
  fireEvent.click(button);
  expect(submit).toHaveBeenCalledWith("Review note");
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(note).toHaveValue("Review note");
  fireEvent.click(screen.getByRole("link", { name: "Leave" }));
  expect(confirm).toHaveBeenCalledOnce();
});
