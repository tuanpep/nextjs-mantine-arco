import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";

import { feedbackFixtures } from "../lib/fixtures";
import { FeedbackList } from "./feedback-list";

const mocks = vi.hoisted(() => ({
  query: { q: "", view: "open", sort: "title-asc", page: 1 },
  setQuery: vi.fn(),
}));
vi.mock("nuqs", async (importOriginal) => ({
  ...(await importOriginal<typeof import("nuqs")>()),
  useQueryStates: () => [mocks.query, mocks.setQuery],
}));
vi.mock("@/modules/portal/components/portal-provider", () => ({
  usePortal: () => ({ feedback: feedbackFixtures() }),
}));
vi.mock("nextjs-toploader/app", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
afterEach(() => {
  cleanup();
  mocks.query = { q: "", view: "open", sort: "title-asc", page: 1 };
  mocks.setQuery.mockClear();
});

function renderList() {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <FeedbackList projectId="beacon-portal" />
    </NextIntlClientProvider>,
  );
}

test("shows project counts, observation context, and queue return links", () => {
  renderList();
  expect(screen.getByRole("tab", { name: /All/ })).toHaveTextContent("2");
  expect(screen.getByText(/FB-1 · The export label sits/)).toBeVisible();
  expect(
    screen.getByRole("link", { name: "The export label is easy to miss" }),
  ).toHaveAttribute("href", expect.stringContaining("returnTo="));
  expect(screen.queryByText("The queue page is dense")).not.toBeInTheDocument();
});

test("finds review-only text and resets pagination on tab changes", () => {
  mocks.query = { ...mocks.query, view: "all", q: "future copy pass", page: 9 };
  renderList();
  expect(
    screen.getByRole("link", { name: "The confirmation copy is clear" }),
  ).toBeVisible();
  expect(
    screen.queryByText("The export label is easy to miss"),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: /New/ }));
  expect(mocks.setQuery).toHaveBeenCalledWith({ view: "open", page: 1 });
});
