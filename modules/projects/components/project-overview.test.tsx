import { cleanup, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { render } from "@/test-utils/render";
import { ProjectOverview } from "./project-overview";
import { SupportProvider } from "@/modules/support/components/support-provider";
import { applications } from "../lib/applications";
import { supportFixtures } from "@/modules/support/lib/fixtures";

afterEach(cleanup);

describe("product overview", () => {
  it("defaults to the first application and links to shared improvements", () => {
    render(
      <SupportProvider>
        <ProjectOverview />
      </SupportProvider>,
    );
    expect(
      screen.getByRole("link", { name: "Submit Support" }),
    ).toHaveAttribute("href", "/projects/beacon-portal/support/new");
    expect(
      screen.getByRole("link", { name: "Browse shared improvements" }),
    ).toHaveAttribute("href", "/improvements");
    expect(
      screen.queryByRole("button", { name: /admin|invite|grant/i }),
    ).not.toBeInTheDocument();
  });

  it.each(applications)(
    "renders $name and counts only its support requests",
    (application) => {
      render(
        <SupportProvider>
          <ProjectOverview application={application} />
        </SupportProvider>,
      );
      expect(
        screen.getByRole("heading", { level: 1, name: application.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: application.description }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(application.owner, { exact: true }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Submit Support" }),
      ).toHaveAttribute("href", `/projects/${application.id}/support/new`);
      expect(
        screen.getByRole("link", { name: "View Support" }),
      ).toHaveAttribute("href", `/projects/${application.id}/support`);
      const supportSummary = screen.getByText("Support", {
        exact: true,
      }).parentElement;
      expect(supportSummary).not.toBeNull();
      if (!supportSummary) throw new Error("Missing support summary");
      expect(
        within(supportSummary).getByText(
          String(
            supportFixtures.filter(
              (request) => request.applicationId === application.id,
            ).length,
          ),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Shared user guides" }),
      ).toHaveAttribute("href", "/learning");
      expect(
        screen.getByRole("link", { name: "Shared service catalog" }),
      ).toHaveAttribute("href", "/services");
      expect(
        screen.getByRole("link", { name: "Shared release testing" }),
      ).toHaveAttribute("href", "/uat");
      expect(
        screen.getByRole("link", { name: "Shared status & maintenance" }),
      ).toHaveAttribute("href", "/status");
      expect(
        screen.queryByRole("link", { name: /ideas/i }),
      ).not.toBeInTheDocument();
    },
  );
});
