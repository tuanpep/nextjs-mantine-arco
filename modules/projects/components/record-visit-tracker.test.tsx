import { act, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  PortalProvider,
  usePortal,
} from "@/modules/portal/components/portal-provider";
import { seedPortal } from "@/modules/portal/lib/seed";
import { sessionRows } from "@/modules/portal/lib/session-rows";

import { RecordVisitTracker } from "./record-visit-tracker";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

it("tracks committed canonical records, not invalid paths or record updates", () => {
  const rows = sessionRows("beacon-portal", seedPortal());
  const first = rows.find((row) => row.kind === "bug");
  const second = rows.find((row) => row.kind === "help");
  if (!first || !second) throw new Error("Expected seed records");
  navigation.pathname = first.href;
  let portal: ReturnType<typeof usePortal> | undefined;
  function Observer() {
    portal = usePortal();
    return <RecordVisitTracker />;
  }
  const view = render(
    <PortalProvider>
      <Observer />
    </PortalProvider>,
  );
  expect(portal?.recentRecords.map((item) => item.id)).toEqual([first.id]);
  navigation.pathname = second.href;
  view.rerender(
    <PortalProvider>
      <Observer />
    </PortalProvider>,
  );
  expect(portal?.recentRecords.map((item) => item.id)).toEqual([
    second.id,
    first.id,
  ]);
  act(() => {
    portal?.recordVisit({ projectId: "other", kind: "bug", id: "other" });
    portal?.transitionHelp("beacon-portal", second.id, {
      kind: "reply",
      note: "Update",
    });
  });
  expect(portal?.recentRecords[0]?.id).toBe("other");
  for (const path of [
    "/",
    "/projects/unknown/support/bugs/1",
    "/projects/beacon-portal/support/bugs/new",
    `${first.href}/extra`,
    "/projects/beacon-portal/support/bugs/missing",
  ]) {
    navigation.pathname = path;
    view.rerender(
      <PortalProvider>
        <Observer />
      </PortalProvider>,
    );
    expect(portal?.recentRecords[0]?.id).toBe("other");
  }
});
