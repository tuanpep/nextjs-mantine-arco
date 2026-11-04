import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, expect, test, vi } from "vitest";

import messages from "@/messages/en.json";
import { PortalProvider } from "@/modules/portal/components/portal-provider";
import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";
import { render } from "@/test-utils/render";

import { SimilarBugReports } from "./similar-bug-reports";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Suggestions({
  projectId,
  title,
}: {
  projectId: string;
  title: string;
}) {
  useUnsavedDraft(true, "Discard draft?");
  return <SimilarBugReports projectId={projectId} title={title} />;
}

test("shows same-tab links across statuses, hides nonmatches, and follows project changes", () => {
  const view = (projectId: string, title: string) => (
    <NextIntlClientProvider locale="en" messages={messages}>
      <PortalProvider>
        <Suggestions projectId={projectId} title={title} />
      </PortalProvider>
    </NextIntlClientProvider>
  );
  const { rerender } = render(view("beacon-portal", "Avatar image"));
  const link = screen.getByRole("link", {
    name: "Avatar image stays blank · BUG-2",
  });
  expect(screen.getByText("Resolved", { exact: true })).toBeVisible();
  expect(link).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/bugs/BUG-2",
  );
  expect(link).not.toHaveAttribute("target");
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
  expect(fireEvent.click(link)).toBe(false);
  expect(confirm).toHaveBeenCalledWith("Discard draft?");
  rerender(view("orchid-reports", "Avatar image"));
  expect(
    screen.queryByRole("region", { name: "Related reports" }),
  ).not.toBeInTheDocument();
  rerender(view("orchid-reports", "Scheduled report"));
  expect(
    screen.getByRole("link", { name: "Scheduled report stays queued · BUG-3" }),
  ).toBeVisible();
});
