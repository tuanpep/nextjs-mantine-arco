import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { featureStatuses } from "./state";

export const featureViews = ["open", "closed", "all"] as const;
export type FeatureView = (typeof featureViews)[number];
export const featureStatusFilters = ["all", ...featureStatuses] as const;
export type FeatureStatusFilter = (typeof featureStatusFilters)[number];
export const featureSorts = ["title-asc", "title-desc"] as const;
export type FeatureSort = (typeof featureSorts)[number];
export type FeatureQueueQuery = {
  q: string;
  view: FeatureView;
  status: FeatureStatusFilter;
  sort: FeatureSort;
  page: number;
};

export const featureSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(featureViews).withDefault("open"),
  status: parseAsStringLiteral(featureStatusFilters).withDefault("all"),
  sort: parseAsStringLiteral(featureSorts).withDefault("title-asc"),
  page: parseAsInteger.withDefault(1),
};
export const serializeFeatureQueue = createSerializer(featureSearchParams);
