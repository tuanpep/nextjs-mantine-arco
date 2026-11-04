import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

import { bugSeverities, bugStatuses } from "./state";

export const bugViews = ["open", "resolved", "all"] as const;
export type BugView = (typeof bugViews)[number];

export const bugSeverityFilters = ["all", ...bugSeverities] as const;
export type BugSeverityFilter = (typeof bugSeverityFilters)[number];

export const bugSeverityOperators = ["is", "isNot"] as const;
export type BugSeverityOperator = (typeof bugSeverityOperators)[number];

export const bugStatusFilters = ["all", ...bugStatuses] as const;
export type BugStatusFilter = (typeof bugStatusFilters)[number];

export const bugSorts = ["severity-desc", "severity-asc", "title"] as const;
export type BugSort = (typeof bugSorts)[number];

export type BugQueueQuery = {
  q: string;
  view: BugView;
  severity: BugSeverityFilter;
  severityOp: BugSeverityOperator;
  status: BugStatusFilter;
  sort: BugSort;
  page: number;
};

export const bugSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(bugViews).withDefault("open"),
  severity: parseAsStringLiteral(bugSeverityFilters).withDefault("all"),
  severityOp: parseAsStringLiteral(bugSeverityOperators).withDefault("is"),
  status: parseAsStringLiteral(bugStatusFilters).withDefault("all"),
  sort: parseAsStringLiteral(bugSorts).withDefault("severity-desc"),
  page: parseAsInteger.withDefault(1),
};

export const serializeBugQueue = createSerializer(bugSearchParams);
