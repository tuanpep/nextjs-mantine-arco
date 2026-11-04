import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { PortalProvider } from "@/modules/portal/components/portal-provider";
import { render } from "@/test-utils/render";

import { GuideDetail } from "./guide-detail";
import { GuideForm } from "./guide-form";
import { GuideList } from "./guide-list";

const push = vi.fn();
vi.mock("nextjs-toploader/app", () => ({ useRouter: () => ({ push }) }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

function show(child: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NuqsTestingAdapter searchParams="?q=export">
        <PortalProvider>{child}</PortalProvider>
      </NuqsTestingAdapter>
    </NextIntlClientProvider>,
  );
}

test("list and detail links preserve search", () => {
  const list = show(<GuideList projectId="beacon-portal" />);
  expect(screen.getByRole("link", { name: "New guide" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/guides/new?q=export",
  );
  expect(
    screen.getByRole("link", { name: /Export a saved view/ }),
  ).toHaveAttribute("href", "/projects/beacon-portal/guides/GUIDE-1?q=export");
  list.unmount();
  show(<GuideDetail projectId="beacon-portal" guideId="GUIDE-1" />);
  expect(screen.getByRole("link", { name: "Guides" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/guides?q=export",
  );
});

test("cancel protects a dirty draft and preserves search", () => {
  show(<GuideForm projectId="beacon-portal" />);
  const cancel = screen.getByRole("link", { name: "Cancel" });
  expect(cancel).toHaveAttribute(
    "href",
    "/projects/beacon-portal/guides?q=export",
  );
  fireEvent.change(screen.getByRole("textbox", { name: /Title/ }), {
    target: { value: "Draft" },
  });
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  expect(fireEvent.click(cancel)).toBe(false);
  expect(confirm).toHaveBeenCalledWith("Discard your unsaved draft?");
});

test("saving navigates to the new guide with search and clears the guard", () => {
  show(<GuideForm projectId="beacon-portal" />);
  fireEvent.change(screen.getByRole("textbox", { name: /Title/ }), {
    target: { value: "Title" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /Summary/ }), {
    target: { value: "Summary" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /Body/ }), {
    target: { value: "Body" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save guide" }));
  expect(push).toHaveBeenCalledWith(
    expect.stringMatching(
      /^\/projects\/beacon-portal\/guides\/GUIDE-\d+\?q=export$/,
    ),
  );
  const unload = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(unload);
  expect(unload.defaultPrevented).toBe(false);
});
