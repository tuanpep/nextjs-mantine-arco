import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import { render } from "@/test-utils/render";

import { SupportDetails } from "./support-details";
import { SupportForm } from "./support-form";
import { SupportProvider } from "./support-provider";

afterEach(cleanup);

test("an application route cannot display another application's request", () => {
  render(<SupportProvider><SupportDetails projectId="orchid-reports" supportId="SUP112" /></SupportProvider>);
  expect(screen.getByRole("heading", { name: "Support unavailable" })).toBeInTheDocument();
  expect(screen.queryByText("Help with the monthly report export")).not.toBeInTheDocument();
});

test("unknown application intake routes to triage without assigning Beacon", () => {
  render(<SupportProvider><SupportForm /></SupportProvider>);
  expect(screen.getByLabelText("Affected application")).toHaveValue("");
  fireEvent.change(screen.getByLabelText(/Brief summary/), { target: { value: "Cannot find my report" } });
  fireEvent.change(screen.getByLabelText(/^Situation/), { target: { value: "I do not know which application owns this report." } });
  fireEvent.click(screen.getByRole("button", { name: "Review request" }));
  expect(screen.getByText(/Not sure, route to DX triage/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Confirm creation in demo" }));
  expect(screen.getByText(/Responsible team: DX triage/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View request" })).toHaveAttribute("href", expect.stringMatching(/^\/support\/SUP-/));
});

test("review does not create; explicit confirmation creates an in-memory request", () => {
  render(
    <SupportProvider>
      <SupportForm projectId="beacon-portal" />
    </SupportProvider>,
  );
  fireEvent.change(screen.getByLabelText(/Brief summary/), {
    target: { value: "Help finding a report" },
  });
  fireEvent.change(screen.getByLabelText(/^Situation/), {
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
  fireEvent.click(
    screen.getByRole("button", { name: "Confirm creation in demo" }),
  );
  expect(
    screen.getByRole("heading", { name: "Request created in this demo" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View request" })).toHaveAttribute(
    "href",
    expect.stringContaining("/projects/beacon-portal/support/SUP-"),
  );
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
  fireEvent.click(screen.getByRole("button", { name: "Send reply in demo" }));
  expect(screen.getByText("April, with no filter.")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "The handler has the next action",
  );
  expect(
    screen.queryByRole("button", { name: "Send reply in demo" }),
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
  fireEvent.click(
    screen.getByRole("button", { name: "Confirm retest result in demo" }),
  );
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
  fireEvent.click(
    screen.getByRole("button", { name: "Confirm reopening in demo" }),
  );
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
