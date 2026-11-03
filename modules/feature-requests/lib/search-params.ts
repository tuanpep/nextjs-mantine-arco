import { parseAsString, parseAsStringLiteral } from "nuqs";

export const featureViews = ["open", "closed"] as const;
export type FeatureView = (typeof featureViews)[number];

export const featureSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(featureViews).withDefault("open"),
};
