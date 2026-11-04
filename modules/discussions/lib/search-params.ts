import {
  createParser,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

export const discussionSorts = ["recent", "oldest"] as const;
export const discussionViews = ["all", "unanswered"] as const;

const positivePage = createParser({
  parse: (value) =>
    /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value))
      ? Number(value)
      : null,
  serialize: String,
});

export const discussionSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(discussionSorts).withDefault("recent"),
  view: parseAsStringLiteral(discussionViews).withDefault("all"),
  page: positivePage.withDefault(1),
};

export const serializeDiscussionQueue = createSerializer(
  discussionSearchParams,
);
