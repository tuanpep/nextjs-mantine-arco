import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test } from "vitest";

import messages from "@/messages/en.json";
import vietnamese from "@/messages/vi.json";
import {
  PortalProvider,
  usePortal,
} from "@/modules/portal/components/portal-provider";
import { seedPortal } from "@/modules/portal/lib/seed";
import { render } from "@/test-utils/render";

import { HomeScreen } from "./home-screen";

afterEach(cleanup);

function Visit() {
  const portal = usePortal();
  const bug = portal.bugs[0];
  if (!bug) return null;
  return (
    <>
      <button
        onClick={() =>
          portal.recordVisit({
            projectId: bug.projectId,
            kind: "bug",
            id: bug.id,
          })
        }
      >
        Visit bug
      </button>
      <button
        onClick={() =>
          portal.transitionBug(bug.projectId, bug.id, {
            kind: "resolve",
            note: "Fixed",
          })
        }
      >
        Resolve bug
      </button>
    </>
  );
}

function home(locale: "en" | "vi" = "en") {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "en" ? messages : vietnamese}
    >
      <PortalProvider>
        <HomeScreen />
        <Visit />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
}

test("shows a truthful session index, filters all kinds and recovers from no matches", async () => {
  home();
  expect(
    screen.queryByRole("heading", { name: "Recently opened" }),
  ).not.toBeInTheDocument();
  const records = screen.getByRole("region", { name: "Session records" });
  expect(screen.getByRole("button", { name: "Next page" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Previous page" }),
  ).toBeInTheDocument();
  expect(within(records).getAllByRole("listitem").length).toBeLessThanOrEqual(
    10,
  );
  fireEvent.change(screen.getByRole("combobox", { name: "Type" }), {
    target: { value: "help" },
  });
  await waitFor(() =>
    expect(
      within(records)
        .getAllByRole("listitem")
        .every((item) => item.textContent?.includes("Help")),
    ).toBe(true),
  );
  fireEvent.change(screen.getByRole("combobox", { name: "Project" }), {
    target: { value: "orchid-reports" },
  });
  await waitFor(() =>
    expect(
      within(records)
        .getAllByRole("listitem")
        .every((item) => item.textContent?.includes("Orchid Reports")),
    ).toBe(true),
  );
  fireEvent.change(
    screen.getByRole("textbox", { name: "Search session records" }),
    { target: { value: "nothing-matches-xyz" } },
  );
  fireEvent.keyDown(
    screen.getByRole("textbox", { name: "Search session records" }),
    { key: "Enter" },
  );
  await screen.findByText("No matching records");
  fireEvent.click(
    screen.getByText("Clear filters", { selector: "button span" }),
  );
  await waitFor(() =>
    expect(within(records).getAllByRole("listitem")).toHaveLength(10),
  );
});

test("recent history joins the current status and localized app descriptions", () => {
  home();
  expect(screen.getByText(/Internal product access/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Visit bug" }));
  const recent = screen.getByRole("region", { name: "Recently opened" });
  const bug = seedPortal().bugs[0];
  expect(
    within(recent).getByRole("link", { name: bug?.title }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Resolve bug" }));
  expect(within(recent).getByText("Resolved")).toBeInTheDocument();
});

test("Vietnamese descriptions and headings follow locale", () => {
  home("vi");
  expect(screen.getByText(/Truy cập sản phẩm nội bộ/)).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Nội dung trong phiên này" }),
  ).toBeInTheDocument();
});
