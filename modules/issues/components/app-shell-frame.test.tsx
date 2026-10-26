import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { render } from "@/test-utils/render";

import { AppShellFrame } from "./app-shell-frame";

const navigation = vi.hoisted(() => ({
  pathname: "/issues",
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: navigation.push }),
}));

afterEach(() => {
  cleanup();
  navigation.pathname = "/issues";
  navigation.push.mockReset();
});

test("shows nested icon links and collapses them to the top level", () => {
  render(
    <AppShellFrame>
      <div>Content</div>
    </AppShellFrame>,
  );

  expect(screen.getByRole("link", { name: "Issues" })).toHaveAttribute(
    "href",
    "/issues",
  );
  expect(screen.getByRole("link", { name: "Showcase" })).toHaveAttribute(
    "href",
    "/showcase",
  );
  expect(
    screen.getByRole("button", { name: "Foundations" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Typography" })).toHaveAttribute(
    "href",
    "/showcase#typography",
  );
  expect(screen.getByRole("link", { name: "Navigation" })).toHaveAttribute(
    "href",
    "/showcase#navigation",
  );
  expect(
    screen.getByRole("textbox", { name: "Search issues" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));

  expect(
    screen.queryByRole("link", { name: "Typography" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Foundations" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Showcase" })).toHaveAttribute(
    "href",
    "/showcase",
  );
  expect(screen.getByRole("link", { name: "BP" })).toHaveAttribute(
    "href",
    "/issues",
  );

  fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));

  expect(screen.getByRole("link", { name: "Typography" })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Beacon Portal" }),
  ).toBeInTheDocument();
});

test("keeps search centered and shows header actions", async () => {
  navigation.pathname = "/showcase";

  render(
    <AppShellFrame>
      <div>Content</div>
    </AppShellFrame>,
  );

  expect(
    screen.getByRole("textbox", { name: "Search issues" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Notifications, 2 unread" }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Account menu" }));

  expect(await screen.findByText("Mina Cho")).toBeInTheDocument();
  expect(
    screen.getByRole("menuitem", { name: "Showcase", hidden: true }),
  ).toHaveAttribute("href", "/showcase");
});

test("collapses a nested group from the group control", () => {
  render(
    <AppShellFrame>
      <div>Content</div>
    </AppShellFrame>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Foundations" }));

  expect(
    screen.queryByRole("link", { name: "Typography" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Showcase" })).toHaveAttribute(
    "href",
    "/showcase",
  );
  expect(screen.getByRole("link", { name: "Inputs" })).toBeInTheDocument();
});
