import { parseAsString, parseAsStringLiteral } from "nuqs/server";

export const feedbackViews = ["needs-review", "acknowledged", "all"] as const;
export type FeedbackView = (typeof feedbackViews)[number];

export const feedbackSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsStringLiteral(feedbackViews).withDefault("needs-review"),
};
