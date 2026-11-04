import { cleanup, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test } from "vitest";

import messages from "@/messages/en.json";
import { render } from "@/test-utils/render";

import { SessionRecordList } from "./session-record-list";

afterEach(cleanup);

test("renders real statuses, metadata and canonical links without status for guides", () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SessionRecordList
        rows={[
          {
            id: "BUG-1",
            projectId: "beacon-portal",
            kind: "bug",
            title: "Broken export",
            href: "/projects/beacon-portal/support/bugs/BUG-1",
            status: "Waiting for reporter",
            active: true,
          },
          {
            id: "GUIDE-1",
            projectId: "orchid-reports",
            kind: "guide",
            title: "Export guide",
            href: "/projects/orchid-reports/guides/GUIDE-1",
          },
        ]}
      />
    </NextIntlClientProvider>,
  );
  expect(screen.getByRole("link", { name: "Broken export" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/bugs/BUG-1",
  );
  expect(screen.getByText("Waiting for reporter")).toBeInTheDocument();
  expect(
    screen.getByText(/Orchid Reports · Guides · GUIDE-1/),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
