import { parseAsString, parseAsStringLiteral } from "nuqs";

export const feedbackViews = ["open", "closed"] as const;
export type FeedbackView = (typeof feedbackViews)[number];

export const feedbackSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(feedbackViews).withDefault("open"),
};
