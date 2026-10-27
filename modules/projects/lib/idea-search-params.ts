import { parseAsString, parseAsStringLiteral } from "nuqs/server";

export const ideaViews = ["all", "under-review", "voted"] as const;
export type IdeaView = (typeof ideaViews)[number];

export const ideaSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(ideaViews).withDefault("all"),
};
