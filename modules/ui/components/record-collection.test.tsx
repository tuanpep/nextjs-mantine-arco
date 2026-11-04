import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";

import { RecordCollection } from "./record-collection";

vi.mock("nextjs-toploader/app", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
afterEach(cleanup);

const defaults = {
  title: "Records",
  breadcrumbs: [],
  createHref: "/new",
  createLabel: "Create record",
  query: "",
  onQueryChange: vi.fn(),
  emptyTitle: "No records",
  emptyActionLabel: "Create record",
};

test("keeps default row counts and renders optional controls independently", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <RecordCollection
        {...defaults}
        rows={[{ id: "1", href: "/1", title: "One" }]}
      />
    </NextIntlClientProvider>,
  );
  expect(screen.getByRole("list", { name: "Records" })).toHaveTextContent(
    "One",
  );
  expect(
    screen.getByText(messages.Portal.count.replace("{count}", "1")),
  ).toBeVisible();
});

test("uses total count, slots, and a caller-provided empty-view action", () => {
  const onEmptyAction = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <RecordCollection
        {...defaults}
        rows={[]}
        resultCount={26}
        toolbarControls={<button>Sort records</button>}
        footer={<button>Next page</button>}
        emptyActionLabel="View all"
        onEmptyAction={onEmptyAction}
      />
    </NextIntlClientProvider>,
  );
  expect(
    screen.getByText(messages.Portal.count.replace("{count}", "26")),
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "Sort records" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Next page" })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "View all" }));
  expect(onEmptyAction).toHaveBeenCalledOnce();
});

test("search-empty recovery clears search rather than taking the view action", () => {
  const onQueryChange = vi.fn();
  const onEmptyAction = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <RecordCollection
        {...defaults}
        rows={[]}
        query="missing"
        onQueryChange={onQueryChange}
        onEmptyAction={onEmptyAction}
      />
    </NextIntlClientProvider>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: messages.Portal.clearSearch }),
  );
  expect(onQueryChange).toHaveBeenCalledWith("");
  expect(onEmptyAction).not.toHaveBeenCalled();
});
