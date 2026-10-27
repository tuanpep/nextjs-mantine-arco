import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { render } from "@/test-utils/render";

import { SupportDetails } from "./support-details";
import { SupportForm } from "./support-form";
import { SupportProvider } from "./support-provider";

const search = vi.hoisted(() => ({ type: null as string | null }));

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "type" ? search.type : null),
  }),
}));

afterEach(() => {
  cleanup();
  search.type = null;
});

test("a valid application cannot open another application's request", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="orchid-reports" supportId="SUP112" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Support unavailable" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Help with the monthly report export"),
  ).not.toBeInTheDocument();
});

test("a project route cannot display another project's request", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="orchid-reports" supportId="SUP112" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Support unavailable" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Help with the monthly report export"),
  ).not.toBeInTheDocument();
});

test("review does not create; explicit confirmation creates an in-memory request", () => {
  search.type = "general";
  render(
    <SupportProvider>
      <SupportForm projectId="beacon-portal" />
    </SupportProvider>,
  );
  fireEvent.change(screen.getByLabelText(/Brief summary/), {
    target: { value: "Help finding a report" },
  });
  fireEvent.change(screen.getByLabelText(/Situation/), {
    target: {
      value: "I tried the reports menu but could not find the monthly report.",
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Review request" }));
  expect(
    screen.getByRole("heading", { name: "Review your request" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "View request" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Back to edit" }));
  expect(screen.getByLabelText(/Brief summary/)).toHaveValue(
    "Help finding a report",
  );
  fireEvent.click(screen.getByRole("button", { name: "Review request" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm creation" }));
  expect(
    screen.getByRole("heading", { name: "Request created" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View request" })).toHaveAttribute(
    "href",
    expect.stringContaining("/projects/beacon-portal/support/SUP-"),
  );
});

test("broken intake shows repro and correlation fields", () => {
  search.type = "broken";
  render(
    <SupportProvider>
      <SupportForm projectId="beacon-portal" />
    </SupportProvider>,
  );
  expect(screen.getByLabelText(/Steps to reproduce/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Correlation \/ error ID/)).toBeInTheDocument();
  expect(
    screen.getByText(/Broken reports need repro steps/i),
  ).toBeInTheDocument();
});

test("demo handler triage can mark needs more info", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP116" />
    </SupportProvider>,
  );
  expect(screen.getByText("DEMO-4821")).toBeInTheDocument();
  expect(screen.getByText("Auto-close paused")).toBeInTheDocument();
  fireEvent.change(
    screen.getByLabelText(/What do you still need from the sender/),
    {
      target: { value: "Which filter values reset after navigation?" },
    },
  );
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  expect(screen.getByRole("status")).toHaveTextContent("needs more info");
  expect(screen.getByText("Waiting for sender")).toBeInTheDocument();
});

test("sender reply updates responsibility and removes stale reply controls", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP112" />
    </SupportProvider>,
  );
  fireEvent.change(screen.getByLabelText(/Your reply/), {
    target: { value: "April, with no filter." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send reply" }));
  expect(screen.getByText("April, with no filter.")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "The handler has the next action",
  );
  expect(
    screen.queryByRole("button", { name: "Send reply" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /claim|assign|resolve|handover/i }),
  ).not.toBeInTheDocument();
});

test("retest pass records a result without resolving the request", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP113" />
    </SupportProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirm retest" }));
  expect(screen.getByText("Retest: Pass")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "This does not resolve the request or approve UAT",
  );
  expect(screen.getByText("Handling")).toBeInTheDocument();
});

test("sender reopening keeps the official outcome as superseded history", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP114" />
    </SupportProvider>,
  );
  fireEvent.change(screen.getByLabelText(/Reason for reopening/), {
    target: { value: "The same totals mismatch returned." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Reopen" }));
  expect(
    screen.getByText("Prior outcome · superseded on reopening"),
  ).toBeInTheDocument();
  expect(screen.getByText("Report totals corrected")).toBeInTheDocument();
  expect(screen.getByText("Handling")).toBeInTheDocument();
});

test("unknown project and unknown request show the same nonenumerating state", () => {
  const { unmount } = render(
    <SupportProvider>
      <SupportDetails projectId="orchid" supportId="SUP112" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Support unavailable" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Beacon Portal")).not.toBeInTheDocument();
  unmount();
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="missing" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Support unavailable" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Beacon Portal")).not.toBeInTheDocument();
});
