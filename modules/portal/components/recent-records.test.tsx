import { act, renderHook } from "@testing-library/react";
import { expect, it } from "vitest";

import { PortalProvider, usePortal } from "./portal-provider";

it("keeps history isolated between providers and clears it on remount", () => {
  const first = renderHook(() => usePortal(), { wrapper: PortalProvider });
  const second = renderHook(() => usePortal(), { wrapper: PortalProvider });
  const reference = { projectId: "p", kind: "bug", id: "1" } as const;
  act(() => first.result.current.recordVisit(reference));
  expect(first.result.current.recentRecords).toEqual([reference]);
  expect(second.result.current.recentRecords).toEqual([]);
  first.unmount();
  const remount = renderHook(() => usePortal(), { wrapper: PortalProvider });
  expect(remount.result.current.recentRecords).toEqual([]);
});
