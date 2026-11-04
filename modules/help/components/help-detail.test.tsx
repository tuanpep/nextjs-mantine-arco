import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import vietnamese from "@/messages/vi.json";
import { PortalProvider } from "@/modules/portal/components/portal-provider";
import { render } from "@/test-utils/render";

import { HelpDetail } from "./help-detail";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("real Help detail replies, answers and reopens while retaining conversation", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <HelpDetail projectId="beacon-portal" helpId="HELP-1" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  const message = screen.getByRole("textbox", { name: "Message" });
  const action = screen.getByRole("combobox", { name: "Action" });
  fireEvent.change(message, { target: { value: "More context" } });
  fireEvent.click(screen.getByRole("button", { name: "Reply" }));
  expect(screen.getByText("Open", { exact: true })).toBeInTheDocument();
  fireEvent.click(action);
  fireEvent.click(screen.getByRole("option", { name: "Post answer" }));
  fireEvent.change(message, { target: { value: "Use the view menu" } });
  fireEvent.click(screen.getByRole("button", { name: "Post answer" }));
  expect(screen.getByText("Answered", { exact: true })).toBeInTheDocument();
  expect(action).toHaveValue("Reply");
  fireEvent.change(message, { target: { value: "Thanks" } });
  fireEvent.click(screen.getByRole("button", { name: "Reply" }));
  expect(screen.getByText("Answered", { exact: true })).toBeInTheDocument();
  fireEvent.click(action);
  fireEvent.click(screen.getByRole("option", { name: "Reopen question" }));
  fireEvent.change(message, { target: { value: "Still need help" } });
  fireEvent.click(screen.getByRole("button", { name: "Reopen question" }));
  expect(screen.getByText("Open", { exact: true })).toBeInTheDocument();
  const conversation = within(
    screen.getByRole("region", { name: "Conversation" }),
  );
  for (const text of [
    "More context",
    "Use the view menu",
    "Thanks",
    "Still need help",
  ]) {
    expect(conversation.getByText(text, { exact: true })).toBeInTheDocument();
  }
  expect(message).toHaveValue("");
});

test("Vietnamese labels and project-scoped unavailable state", () => {
  const view = render(
    <NextIntlClientProvider locale="vi" messages={vietnamese}>
      <PortalProvider>
        <HelpDetail projectId="beacon-portal" helpId="HELP-2" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  expect(
    screen.getByRole("region", { name: "Cuộc trao đổi" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Tin nhắn" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Trả lời" })).toBeInTheDocument();
  view.unmount();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <HelpDetail projectId="orchid-reports" helpId="HELP-1" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  expect(screen.getByText("This page is unavailable")).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
