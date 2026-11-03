import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test } from "vitest";

import messages from "@/messages/en.json";
import { bugFixtures } from "@/modules/bug-reports/lib/fixtures";
import {
  PortalProvider,
  usePortal,
} from "@/modules/portal/components/portal-provider";
import { render } from "@/test-utils/render";

import { ProjectHub } from "./project-hub";

afterEach(cleanup);

function Resolve() {
  const { transitionBug } = usePortal();
  return (
    <button
      onClick={() =>
        transitionBug("beacon-portal", "BUG-1", {
          kind: "resolve",
          note: "Fixed in this session",
        })
      }
    >
      Resolve sample
    </button>
  );
}

function renderHub(projectId: string) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <ProjectHub projectId={projectId} />
        <Resolve />
      </PortalProvider>
    </NextIntlClientProvider>,
  );
}

test("overview counts stay inside the project and update after a bug is resolved", () => {
  renderHub("beacon-portal");
  const open = bugFixtures().filter(
    (item) => item.projectId === "beacon-portal" && item.status !== "Resolved",
  ).length;
  const card = screen.getByRole("region", { name: "Open bug reports" });
  expect(
    within(card).getByText(String(open), { exact: true }),
  ).toBeInTheDocument();
  expect(within(card).getByRole("link", { name: "View" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/bugs?view=open",
  );
  fireEvent.click(screen.getByRole("button", { name: "Resolve sample" }));
  expect(
    within(card).getByText(String(open - 1), { exact: true }),
  ).toBeInTheDocument();
});

test("Orchid overview does not show Beacon bug titles", () => {
  renderHub("orchid-reports");
  const beaconTitle = bugFixtures().find(
    (item) => item.projectId === "beacon-portal",
  )?.title;
  expect(screen.queryByText(beaconTitle ?? "")).not.toBeInTheDocument();
  expect(
    within(screen.getByRole("region", { name: "Open bug reports" })).getByText(
      "2",
      { exact: true },
    ),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole("region", { name: "Guides" })).getByRole("link", {
      name: "View",
    }),
  ).toHaveAttribute("href", "/projects/orchid-reports/guides");
});

test("unknown project does not display module counts", () => {
  renderHub("missing");
  expect(
    screen.queryByRole("region", { name: "Open bug reports" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "This page is unavailable" }),
  ).toBeInTheDocument();
});
