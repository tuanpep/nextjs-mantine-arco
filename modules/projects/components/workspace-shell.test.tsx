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
import { PortalProvider } from "@/modules/portal/components/portal-provider";
import { render } from "@/test-utils/render";

import { WorkspaceShell } from "./workspace-shell";

const { push, route } = vi.hoisted(() => ({
  push: vi.fn(),
  route: { pathname: "/projects/orchid-reports/support/bugs" },
}));
vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));
vi.mock("nextjs-toploader/app", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/i18n/actions", () => ({ setLocale: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  route.pathname = "/projects/orchid-reports/support/bugs";
});

function renderShell(locale: "en" | "vi" = "en") {
  const catalog = locale === "vi" ? vietnameseMessages : messages;
  return render(
    <NextIntlClientProvider locale={locale} messages={catalog}>
      <PortalProvider>
        <WorkspaceShell>Workspace content</WorkspaceShell>
      </PortalProvider>
    </NextIntlClientProvider>,
  );
}

describe("workspace navigation", () => {
  it("renders Vietnamese navigation and preserves the language selector", () => {
    renderShell("vi");
    const navigation = screen.getByRole("navigation", {
      name: "Điều hướng chính",
    });
    expect(
      within(navigation).queryByRole("link", { name: "Dự án" }),
    ).not.toBeInTheDocument();
    expect(
      within(navigation).getByRole("link", { name: "Tổng quan" }),
    ).toHaveAttribute("href", "/projects/orchid-reports");
    expect(
      within(navigation).getByRole("link", { name: "Báo cáo lỗi" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/support/bugs");
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
    expect(push).toHaveBeenCalledWith("/projects/beacon-portal/support/bugs");
    const navigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    expect(
      within(navigation).getByRole("link", { name: "Bug Reports" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/support/bugs");
    expect(
      within(navigation).getByRole("link", { name: "Help" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/support/help");
    expect(
      within(navigation).getByRole("link", { name: "Feature Requests" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/ideas/features");
    expect(
      within(navigation).getByRole("link", { name: "Feedback" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/ideas/feedback");
    expect(
      within(navigation).getByRole("link", { name: "Guides" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/guides");
    expect(
      within(navigation).getByRole("link", { name: "Discussions" }),
    ).toHaveAttribute("href", "/projects/orchid-reports/discussions");
    expect(
      within(navigation).getByRole("button", { name: "Support" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      within(navigation).getByRole("button", { name: "Ideas" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Hide sidebar" }),
    ).toBeInTheDocument();
    expect(
      within(navigation).queryByRole("link", { name: "Projects" }),
    ).not.toBeInTheDocument();
    expect(
      within(navigation).queryByRole("link", { name: "Project settings" }),
    ).not.toBeInTheDocument();
    expect(
      within(navigation).getByRole("link", { name: "Overview" }),
    ).toHaveAttribute("href", "/projects/orchid-reports");
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(document.getElementById("main-content")?.tagName).toBe("MAIN");
  });

  it("keeps project switching without a repeated static project label", () => {
    renderShell();
    expect(
      screen.getAllByRole("combobox", { name: "Switch project" }),
    ).toHaveLength(2);
    expect(
      screen
        .getAllByText("Orchid Reports")
        .filter(
          (element) => !element.closest('[role="combobox"], [role="option"]'),
        ),
    ).toHaveLength(0);
    expect(screen.getByText(messages.Portal.demoNotice)).toBeInTheDocument();
  });

  it.each(["/", "/projects/unknown/support/bugs"])(
    "shows only root navigation without a project at %s",
    (pathname) => {
      route.pathname = pathname;
      renderShell();
      const navigation = screen.getByRole("navigation", {
        name: "Main navigation",
      });
      expect(
        within(navigation).getByRole("link", { name: "Projects" }),
      ).toHaveAttribute("href", "/");
      expect(within(navigation).getAllByRole("link")).toHaveLength(1);
      expect(within(navigation).queryByRole("group")).not.toBeInTheDocument();
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
