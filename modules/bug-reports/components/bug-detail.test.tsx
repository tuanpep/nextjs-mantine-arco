import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test } from "vitest";

import messages from "@/messages/en.json";
import {
  PortalProvider,
  usePortal,
} from "@/modules/portal/components/portal-provider";
import { render } from "@/test-utils/render";

import { BugDetail } from "./bug-detail";

afterEach(cleanup);

function RequestInformation() {
  const { transitionBug } = usePortal();
  return (
    <button
      onClick={() => {
        transitionBug("beacon-portal", "BUG-1", {
          kind: "wait",
          note: "Old question",
        });
        transitionBug("beacon-portal", "BUG-1", {
          kind: "resume",
          note: "Already answered",
        });
        transitionBug("beacon-portal", "BUG-1", {
          kind: "wait",
          note: "Which release?",
        });
      }}
    >
      Prepare waiting report
    </button>
  );
}

test("shows the latest outstanding question beside the reply and resumes on accepted reply", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <RequestInformation />
        <BugDetail projectId="beacon-portal" bugId="BUG-1" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Prepare waiting report" }),
  );
  const discussion = within(screen.getByRole("region", { name: "Discussion" }));
  expect(discussion.getByText("Information requested")).toBeVisible();
  expect(discussion.getByText("Which release?")).toBeVisible();
  expect(discussion.queryByText("Old question")).not.toBeInTheDocument();
  const reply = discussion.getByRole("textbox", { name: "Message" });
  fireEvent.change(reply, { target: { value: "Release 2" } });
  fireEvent.click(discussion.getByRole("button", { name: "Post message" }));
  expect(screen.getByText("Release 2")).toBeVisible();
  expect(
    discussion.queryByText("Information requested"),
  ).not.toBeInTheDocument();
  expect(discussion.getByRole("status")).toHaveTextContent(
    messages.Bugs.messageSaved,
  );
  expect(reply).toHaveValue("");
  expect(screen.getByText("Open", { exact: true })).toBeVisible();
  const activity = within(
    screen.getByRole("region", { name: messages.Bugs.activity }),
  );
  const entries = activity.getAllByRole("listitem");
  expect(entries.map((entry) => entry.textContent)).toEqual([
    expect.stringContaining("It also fails from the saved view menu."),
    expect.stringContaining("Old question"),
    expect.stringContaining("Already answered"),
    expect.stringContaining("Which release?"),
    expect.stringContaining("Release 2"),
  ]);
  expect(entries.at(-1)).toHaveTextContent(messages.Bugs.returnedToOpen);
});

test("preserves oversized message and status drafts with validation errors", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <BugDetail projectId="beacon-portal" bugId="BUG-1" />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  const text = "x".repeat(10001);
  const message = screen.getByRole("textbox", { name: "Message" });
  fireEvent.change(message, { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Post message" }));
  expect(message).toHaveValue(text);
  const note = screen.getByRole("textbox", { name: "Note" });
  fireEvent.change(note, { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
  expect(note).toHaveValue(text);
  expect(screen.getAllByText(/10,?000/)).toHaveLength(2);
});
