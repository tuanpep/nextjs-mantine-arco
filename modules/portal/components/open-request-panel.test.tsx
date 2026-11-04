import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";

import { OpenRequestControl } from "./open-request-panel";
import { PortalProvider } from "./portal-provider";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function openDrawer() {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <OpenRequestControl
          projectId="beacon-portal"
          projectOptions={[{ value: "beacon-portal", label: "Beacon Portal" }]}
        />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Open request" }));
  return within(await screen.findByRole("dialog"));
}

test("drawer preserves a draft when discard is declined", async () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  const drawer = await openDrawer();
  fireEvent.change(drawer.getByRole("textbox", { name: "Title" }), {
    target: { value: "Unsaved report" },
  });
  fireEvent.click(drawer.getByRole("button", { name: "Close" }));
  expect(confirm).toHaveBeenCalledWith(messages.Portal.discardDraft);
  expect(drawer.getByRole("textbox", { name: "Title" })).toHaveValue(
    "Unsaved report",
  );
});

test("Help intake protects text on close and clears the guard after save", async () => {
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  const drawer = await openDrawer();
  fireEvent.change(drawer.getByRole("combobox", { name: "Type" }), {
    target: { value: "help" },
  });
  fireEvent.change(drawer.getByRole("textbox", { name: "Question" }), {
    target: { value: "Where can I export?" },
  });
  fireEvent.click(drawer.getByRole("button", { name: "Close" }));
  expect(confirm).toHaveBeenCalledOnce();
  expect(drawer.getByRole("textbox", { name: "Question" })).toHaveValue(
    "Where can I export?",
  );
  fireEvent.change(
    drawer.getByRole("textbox", { name: "What you already tried" }),
    {
      target: { value: "Checked the toolbar" },
    },
  );
  fireEvent.click(drawer.getByRole("button", { name: "Save question" }));
  expect(
    await drawer.findByRole("link", { name: "Where can I export?" }),
  ).toHaveAttribute("href", "/projects/beacon-portal/support/help/HELP-5");
  fireEvent.click(drawer.getAllByRole("button", { name: "Close" })[0]);
  expect(confirm).toHaveBeenCalledOnce();
});

test("drawer creates an unknown-reproduction report without environment", async () => {
  const confirm = vi.spyOn(window, "confirm");
  const drawer = await openDrawer();
  for (const [name, value] of [
    ["Title", "Intermittent failure"],
    ["What happened", "Saving fails"],
    ["Expected result", "Changes save"],
    ["Steps to reproduce", "Hidden steps"],
  ]) {
    fireEvent.change(drawer.getByRole("textbox", { name }), {
      target: { value },
    });
  }
  fireEvent.click(
    drawer.getByRole("checkbox", {
      name: "I don't know how to reproduce this",
    }),
  );
  expect(
    drawer.queryByRole("textbox", { name: "Steps to reproduce" }),
  ).not.toBeInTheDocument();
  fireEvent.change(drawer.getByRole("combobox", { name: "Who is affected" }), {
    target: { value: "unsure" },
  });
  fireEvent.change(drawer.getByRole("combobox", { name: "How soon" }), {
    target: { value: "unsure" },
  });
  fireEvent.click(drawer.getByRole("button", { name: "Create bug report" }));
  expect(
    await drawer.findByRole("link", { name: "Intermittent failure" }),
  ).toHaveAttribute("href", "/projects/beacon-portal/support/bugs/BUG-5");
  fireEvent.click(drawer.getAllByRole("button", { name: "Close" })[0]);
  expect(confirm).not.toHaveBeenCalled();
});
