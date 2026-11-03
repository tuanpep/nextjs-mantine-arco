import { parseAsString, parseAsStringLiteral } from "nuqs";

export const helpViews = ["open", "answered"] as const;
export type HelpView = (typeof helpViews)[number];

export const helpSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(helpViews).withDefault("open"),
};
