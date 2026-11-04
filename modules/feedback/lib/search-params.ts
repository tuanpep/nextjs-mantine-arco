import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  type inferParserType,
} from "nuqs";

export const feedbackViews = ["open", "closed", "all"] as const;
export type FeedbackView = (typeof feedbackViews)[number];
export const feedbackSorts = ["title-asc", "title-desc"] as const;

export const feedbackSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(feedbackViews).withDefault("open"),
  sort: parseAsStringLiteral(feedbackSorts).withDefault("title-asc"),
  page: parseAsInteger.withDefault(1),
};
export type FeedbackQueueQuery = inferParserType<typeof feedbackSearchParams>;
export const serializeFeedbackQueue = createSerializer(feedbackSearchParams);
