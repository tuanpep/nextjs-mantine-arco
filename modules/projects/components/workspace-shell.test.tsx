import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";
import { WorkspaceShell } from "./workspace-shell";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/projects/orchid-reports/support",
}));
vi.mock("nextjs-toploader/app", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/i18n/actions", () => ({ setLocale: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("workspace navigation", () => {
  it("switches projects and keeps the current section", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <WorkspaceShell>Workspace content</WorkspaceShell>
      </NextIntlClientProvider>,
    );
    const switchers = screen.getAllByRole("combobox", {
      name: "Switch project",
    });
    const switcher = switchers[0];
    await waitFor(() => expect(switcher).toBeEnabled());
    expect(switcher).toHaveValue("orchid-reports");
    fireEvent.change(switcher, { target: { value: "beacon-portal" } });
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
    expect(screen.getByRole("link", { name: "UAT campaigns" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports/uat",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/projects/orchid-reports/settings",
    );
    expect(
      screen.queryByRole("link", { name: "My requests" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
  });
});
