import { parseAsString, parseAsStringLiteral } from "nuqs/server";

import { supportStatuses } from "./fixtures";

export const supportSearchParams = {
  q: parseAsString.withDefault(""),
  status: parseAsStringLiteral(["all", ...supportStatuses]).withDefault("all"),
};
