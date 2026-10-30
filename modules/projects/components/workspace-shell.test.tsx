import {
  cleanup,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import messages from "@/messages/en.json";
import vietnameseMessages from "@/messages/vi.json";
import { render } from "@/test-utils/render";
import { WorkspaceShell } from "./workspace-shell";
import { ProjectSettingsProvider } from "./project-settings-provider";

const { push, route } = vi.hoisted(() => ({
  push: vi.fn(),
  route: { pathname: "/projects/orchid-reports/support" },
}));
vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));
vi.mock("nextjs-toploader/app", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/i18n/actions", () => ({ setLocale: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  route.pathname = "/projects/orchid-reports/support";
});

function renderShell() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ProjectSettingsProvider>
        <WorkspaceShell>Workspace content</WorkspaceShell>
      </ProjectSettingsProvider>
    </NextIntlClientProvider>,
  );
}

describe("workspace navigation", () => {
  it("renders Vietnamese navigation and preserves the language selector", () => {
    render(
      <NextIntlClientProvider locale="vi" messages={vietnameseMessages}>
        <ProjectSettingsProvider>
          <WorkspaceShell>Nội dung không gian làm việc</WorkspaceShell>
        </ProjectSettingsProvider>
      </NextIntlClientProvider>,
    );
    expect(
      screen.queryByRole("link", { name: "Dự án" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tổng quan" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports",
    );
    expect(screen.getByRole("option", { name: "Tiếng Việt" })).toHaveValue(
      "vi",
    );
    expect(screen.getByRole("option", { name: "English" })).toHaveValue("en");
  });

  it("switches projects and keeps the current section", async () => {
    renderShell();
    const switchers = screen.getAllByRole("combobox", {
      name: "Switch project",
    });
    const switcher = switchers[0];
    await waitFor(() => expect(switcher).toBeEnabled());
    expect(switcher).toHaveTextContent("Orchid Reports");
    fireEvent.click(switcher);
    const options = await screen.findAllByRole("option", {
      name: /Beacon Portal/,
      hidden: true,
    });
    fireEvent.click(options[0]);
    expect(push).toHaveBeenCalledWith("/projects/beacon-portal/support");
    expect(screen.getByRole("link", { name: "Support" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports/support",
    );
    expect(screen.getByRole("link", { name: "Feedback" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports/feedback",
    );
    expect(screen.getByRole("link", { name: "Ideas" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports/ideas",
    );
    expect(screen.getByRole("link", { name: "UAT" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports/uat",
    );
    expect(
      screen.getByRole("button", { name: "Hide sidebar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Project settings" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/settings");
    expect(
      screen.queryByRole("link", { name: "Projects" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports",
    );
    expect(
      screen.queryByRole("link", { name: "My requests" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(document.getElementById("main-content")?.tagName).toBe("MAIN");
  });

  it.each(["/", "/projects/unknown/support"])(
    "shows only root navigation without a project at %s",
    async (pathname) => {
      route.pathname = pathname;
      renderShell();
      const navigation = screen.getByRole("navigation", {
        name: "Main navigation",
      });
      expect(
        within(navigation).getByRole("link", { name: "Projects" }),
      ).toHaveAttribute("href", "/");
      expect(within(navigation).getAllByRole("link")).toHaveLength(1);
      expect(within(navigation).queryByRole("button")).not.toBeInTheDocument();
      expect(
        within(navigation).queryByText("Project work"),
      ).not.toBeInTheDocument();
      expect(
        within(navigation).queryByText("Beacon Portal"),
      ).not.toBeInTheDocument();
      expect(push).not.toHaveBeenCalled();
    },
  );

  it("header selection at root opens the selected project overview", async () => {
    route.pathname = "/";
    renderShell();
    expect(push).not.toHaveBeenCalled();
    const switcher = screen.getAllByRole("combobox", {
      name: "Choose project",
    })[0];
    fireEvent.click(switcher);
    const options = await screen.findAllByRole("option", {
      name: /Beacon Portal/,
      hidden: true,
    });
    fireEvent.click(options[0]);
    expect(push).toHaveBeenCalledWith("/projects/beacon-portal");
  });
});
