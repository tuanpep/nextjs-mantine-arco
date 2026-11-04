import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import vietnamese from "@/messages/vi.json";
import { PortalProvider } from "@/modules/portal/components/portal-provider";
import { render } from "@/test-utils/render";
import { FeedbackDetail } from "./feedback-detail";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));
afterEach(cleanup);

test("accepted review keeps its announcement after removing the form", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <FeedbackDetail projectId="beacon-portal" feedbackId="FB-1" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "Review note" }), {
    target: { value: "  Noted for usability review  " },
  });
  fireEvent.click(screen.getByRole("button", { name: "Mark reviewed" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    messages.Feedback.reviewSucceeded,
  );
  expect(screen.getByText("Noted for usability review")).toBeVisible();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  const unload = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(unload);
  expect(unload.defaultPrevented).toBe(false);
});

test("Vietnamese review labels and wrong-project records remain unavailable", () => {
  const view = render(
    <NextIntlClientProvider locale="vi" messages={vietnamese}>
      <PortalProvider>
        <FeedbackDetail projectId="beacon-portal" feedbackId="FB-1" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  expect(
    screen.getByRole("textbox", { name: vietnamese.Feedback.reviewNote }),
  ).toBeVisible();
  view.unmount();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <FeedbackDetail projectId="orchid-reports" feedbackId="FB-1" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  expect(screen.getByText("This page is unavailable")).toBeVisible();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
