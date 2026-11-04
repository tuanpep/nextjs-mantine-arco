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
    within(card).getByRole("link", { name: messages.Overview.openBugs }),
  ).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/bugs?view=open&sort=severity-desc",
  );
  fireEvent.click(screen.getByRole("button", { name: "Resolve sample" }));
  expect(
    within(card).getByText(String(open - 1), { exact: true }),
  ).toBeInTheDocument();
  expect(screen.getByText(messages.Overview.emptyBugs)).toBeInTheDocument();
  expect(
    screen.queryByRole("list", { name: messages.Overview.bugsAttention }),
  ).not.toBeInTheDocument();
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
    within(screen.getByRole("region", { name: "Resources" })).getByRole(
      "link",
      {
        name: messages.Overview.guides,
      },
    ),
  ).toHaveAttribute("href", "/projects/orchid-reports/guides");
});

test("overview separates actionable summaries, bug context, review and resources", () => {
  renderHub("beacon-portal");
  for (const label of [
    messages.Overview.openBugs,
    messages.Overview.openHelp,
    messages.Overview.pendingDecisions,
  ]) {
    const card = screen.getByRole("region", { name: label });
    expect(within(card).getByRole("link", { name: label })).toBeInTheDocument();
    expect(within(card).getAllByRole("link")).toHaveLength(1);
  }
  const bugs = screen.getByRole("list", {
    name: messages.Overview.bugsAttention,
  });
  const active = bugFixtures().filter(
    (bug) => bug.projectId === "beacon-portal" && bug.status !== "Resolved",
  );
  expect(within(bugs).getAllByRole("listitem")).toHaveLength(
    Math.min(5, active.length),
  );
  expect(
    within(bugs).getByText(messages.Portal.statusOpen),
  ).toBeInTheDocument();
  const pane = screen.getByRole("complementary", {
    name: messages.Portal.details,
  });
  const review = within(pane).getByRole("region", {
    name: messages.Overview.pendingReview,
  });
  expect(
    within(pane).getByRole("region", { name: messages.Overview.resources }),
  ).toBeInTheDocument();
  expect(
    within(review).getByRole("link", { name: messages.Overview.openFeatures }),
  ).toHaveAttribute("href", "/projects/beacon-portal/ideas/features?view=open");
  expect(
    within(review).getByRole("link", { name: messages.Overview.newFeedback }),
  ).toHaveAttribute("href", "/projects/beacon-portal/ideas/feedback?view=open");
  expect(screen.getAllByText("Beacon Portal")).toHaveLength(1);
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
