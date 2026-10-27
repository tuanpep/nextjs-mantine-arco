import { parseAsString, parseAsStringLiteral } from "nuqs/server";

import { supportStatuses } from "./fixtures";

export const supportViews = ["open", "closed"] as const;
export type SupportView = (typeof supportViews)[number];

export const supportSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(supportViews).withDefault("open"),
  status: parseAsStringLiteral(["all", ...supportStatuses]).withDefault("all"),
};
