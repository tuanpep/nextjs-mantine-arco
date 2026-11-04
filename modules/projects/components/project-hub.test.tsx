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
  expect(
    within(card).getByRole("link", { name: messages.Overview.viewBugs }),
  ).toHaveAttribute("href", "/projects/beacon-portal/support/bugs?view=open");
  fireEvent.click(screen.getByRole("button", { name: "Resolve sample" }));
  expect(
    within(card).getByText(String(open - 1), { exact: true }),
  ).toBeInTheDocument();
  expect(
    within(card).getByText(messages.Overview.emptyActive),
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
      name: messages.Overview.viewGuides,
    }),
  ).toHaveAttribute("href", "/projects/orchid-reports/guides");
});

test("each overview card has a descriptive link and at most three previews", () => {
  renderHub("beacon-portal");
  for (const [label, view] of [
    [messages.Overview.openBugs, messages.Overview.viewBugs],
    [messages.Overview.openHelp, messages.Overview.viewHelp],
    [messages.Overview.openFeatures, messages.Overview.viewFeatures],
    [messages.Overview.newFeedback, messages.Overview.viewFeedback],
    [messages.Overview.guides, messages.Overview.viewGuides],
    [messages.Overview.discussions, messages.Overview.viewDiscussions],
  ]) {
    const card = screen.getByRole("region", { name: label });
    expect(within(card).getByRole("link", { name: view })).toBeInTheDocument();
    expect(within(card).getAllByRole("link").length).toBeLessThanOrEqual(4);
  }
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
