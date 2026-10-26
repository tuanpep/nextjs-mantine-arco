import { createLoader, parseAsString } from "nuqs/server";

export const issueSearchParams = {
  q: parseAsString.withDefault(""),
};

export const loadIssueSearchParams = createLoader(issueSearchParams);
