import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs";

import { sessionKinds } from "@/modules/portal/lib/session-rows";

export const recordKinds = ["all", ...sessionKinds] as const;

export const workspaceSearchParams = {
  recordsQ: parseAsString.withDefault(""),
  recordsProject: parseAsString.withDefault("all"),
  recordsKind: parseAsStringLiteral(recordKinds).withDefault("all"),
  recordsPage: parseAsInteger.withDefault(1),
};

export type SessionRecordQuery = {
  recordsQ: string;
  recordsProject: string;
  recordsKind: (typeof recordKinds)[number];
  recordsPage: number;
};
