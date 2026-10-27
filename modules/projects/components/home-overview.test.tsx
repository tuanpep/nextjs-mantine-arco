import { cleanup, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { render } from "@/test-utils/render";
import { SupportProvider } from "@/modules/support/components/support-provider";
import { HomeOverview } from "./home-overview";

afterEach(cleanup);

test("home shows actionable requests and application destinations", () => {
  render(
    <SupportProvider>
      <HomeOverview />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Home", level: 1 }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Help with the monthly report export" }),
  ).toHaveAttribute("href", "/projects/beacon-portal/support/SUP112");
  expect(
    screen.getByRole("link", { name: "Retest the report export" }),
  ).toHaveAttribute("href", "/projects/beacon-portal/support/SUP113");
  expect(
    screen.queryByRole("link", {
      name: "Report totals display correctly again",
    }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Beacon Portal" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal",
  );
  for (const [name, href] of [
    ["View applications", "/applications"],
    ["View all applications", "/applications"],
    ["Get help", "/help"],
    ["Applications & services", "/applications"],
    ["Learning & onboarding", "/learning"],
    ["UAT & testing", "/uat"],
    ["My service requests", "/requests"],
    ["Improvements", "/improvements"],
    ["Service status", "/status"],
  ]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  }
});
