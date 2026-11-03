import { parseAsString, parseAsStringLiteral } from "nuqs";

import { bugSeverities } from "./state";

export const bugViews = ["open", "resolved"] as const;
export type BugView = (typeof bugViews)[number];

export const bugSeverityFilters = ["all", ...bugSeverities] as const;
export type BugSeverityFilter = (typeof bugSeverityFilters)[number];

export const bugSeverityOperators = ["is", "isNot"] as const;
export type BugSeverityOperator = (typeof bugSeverityOperators)[number];

export const bugSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(bugViews).withDefault("open"),
  severity: parseAsStringLiteral(bugSeverityFilters).withDefault("all"),
  severityOp: parseAsStringLiteral(bugSeverityOperators).withDefault("is"),
};
