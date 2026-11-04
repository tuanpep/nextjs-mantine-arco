import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";
import { FeedbackForm } from "./feedback-form";

const mocks = vi.hoisted(() => ({ create: vi.fn(), push: vi.fn() }));
vi.mock("@/modules/portal/components/portal-provider", () => ({
  usePortal: () => ({ createFeedback: mocks.create }),
}));
vi.mock("nextjs-toploader/app", () => ({
  useRouter: () => ({ push: mocks.push }),
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("retains failed creation drafts and validates length before mutation", () => {
  mocks.create.mockReturnValue(null);
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FeedbackForm projectId="beacon-portal" />
    </NextIntlClientProvider>,
  );
  const title = screen.getByRole("textbox", { name: "Title" });
  const observation = screen.getByRole("textbox", { name: "Observation" });
  fireEvent.change(title, { target: { value: "x".repeat(161) } });
  fireEvent.change(observation, { target: { value: "An observation" } });
  fireEvent.click(screen.getByRole("button", { name: "Save feedback" }));
  expect(mocks.create).not.toHaveBeenCalled();
  expect(screen.getByText(messages.Feedback.titleTooLong)).toBeVisible();
  fireEvent.change(title, { target: { value: "A title" } });
  fireEvent.click(screen.getByRole("button", { name: "Save feedback" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    messages.Feedback.createFailed,
  );
  expect(title).toHaveValue("A title");
  expect(observation).toHaveValue("An observation");
  expect(mocks.push).not.toHaveBeenCalled();
});
