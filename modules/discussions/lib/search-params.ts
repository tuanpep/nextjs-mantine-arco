import { parseAsString } from "nuqs";

export const discussionSearchParams = {
  q: parseAsString.withDefault(""),
};
