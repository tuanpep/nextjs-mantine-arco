import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { PortalProvider } from "@/modules/portal/components/portal-provider";
import { render } from "@/test-utils/render";

import { HelpDetail } from "./help-detail";
import { HelpForm } from "./help-form";
import { HelpList } from "./help-list";

const push = vi.fn();
vi.mock("nextjs-toploader/app", () => ({ useRouter: () => ({ push }) }));
vi.mock("../lib/fixtures", async (importOriginal) => {
  const original = await importOriginal<typeof import("../lib/fixtures")>();
  return {
    helpFixtures: () =>
      original.helpFixtures().filter((item) => item.status === "Open"),
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  push.mockClear();
});

test("creation retains the queue on the new detail", () => {
  show(<HelpForm projectId="beacon-portal" />);
  fireEvent.change(screen.getByRole("textbox", { name: /Question/ }), {
    target: { value: "My question" },
  });
  fireEvent.change(
    screen.getByRole("textbox", { name: /What you already tried/ }),
    { target: { value: "Looked around" } },
  );
  fireEvent.click(screen.getByRole("button", { name: "Save question" }));
  expect(push).toHaveBeenCalledWith(
    expect.stringMatching(/\/support\/help\/[^?]+\?q=menu&view=answered$/),
  );
});

test("empty answered view offers the open view", () => {
  show(<HelpList projectId="orchid-reports" />, "?view=answered");
  expect(screen.getByText("No answered questions")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
});

function show(child: React.ReactNode, searchParams = "?q=menu&view=answered") {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NuqsTestingAdapter searchParams={searchParams}>
        <PortalProvider>{child}</PortalProvider>
      </NuqsTestingAdapter>
    </NextIntlClientProvider>,
  );
}

test("list and detail preserve the queue in their links", () => {
  const list = show(
    <HelpList projectId="beacon-portal" />,
    "?q=help&view=open",
  );
  expect(screen.getByRole("link", { name: "New question" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/help/new?q=help",
  );
  list.unmount();
  show(<HelpDetail projectId="beacon-portal" helpId="HELP-1" />);
  expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/help?q=menu&view=answered",
  );
});

test("cancel preserves the queue and protects a dirty draft", () => {
  show(<HelpForm projectId="beacon-portal" />);
  const cancel = screen.getByRole("link", { name: "Cancel" });
  expect(cancel).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/help?q=menu&view=answered",
  );
  fireEvent.change(screen.getByRole("textbox", { name: /Question/ }), {
    target: { value: "Draft" },
  });
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  fireEvent.click(cancel);
  expect(confirm).toHaveBeenCalledOnce();
});
