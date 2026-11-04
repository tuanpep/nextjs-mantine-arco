import { createSerializer, parseAsString } from "nuqs";

export const guideSearchParams = {
  q: parseAsString.withDefault(""),
};

export const serializeGuideQueue = createSerializer(guideSearchParams);
