"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { sessionRows } from "@/modules/portal/lib/session-rows";

import { getApplication } from "../lib/applications";

export function RecordVisitTracker() {
  const pathname = usePathname();
  const portal = usePortal();
  const projectId = pathname.split("/")[2] ?? "";
  const row = getApplication(projectId)
    ? sessionRows(projectId, portal).find((item) => item.href === pathname)
    : undefined;
  const id = row?.id;
  const kind = row?.kind;
  const { recordVisit } = portal;

  useEffect(() => {
    if (id && kind) recordVisit({ projectId, kind, id });
  }, [pathname, projectId, id, kind, recordVisit]);

  return null;
}
