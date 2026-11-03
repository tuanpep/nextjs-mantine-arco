import { parseAsString } from "nuqs";

export const guideSearchParams = {
  q: parseAsString.withDefault(""),
};
