import { feedbackSearchParams, serializeFeedbackQueue } from "./search-params";

export function feedbackQueueReturnHref(
  base: string,
  returnTo: string | null,
): string {
  if (!returnTo || (returnTo !== base && !returnTo.startsWith(`${base}?`)))
    return base;
  if (/%(?![\da-fA-F]{2})/.test(returnTo) || returnTo.includes("#"))
    return base;
  try {
    const url = new URL(returnTo, "https://portal.invalid");
    if (
      url.origin !== "https://portal.invalid" ||
      url.pathname !== base ||
      url.hash
    )
      return base;
    const seen = new Set<string>();
    for (const [key, value] of url.searchParams) {
      if (seen.has(key)) return base;
      seen.add(key);
      switch (key) {
        case "q":
          break;
        case "view":
          if (feedbackSearchParams.view.parse(value) === null) return base;
          break;
        case "sort":
          if (feedbackSearchParams.sort.parse(value) === null) return base;
          break;
        case "page":
          if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)))
            return base;
          break;
        default:
          return base;
      }
    }
    return serializeFeedbackQueue(base, {
      q: url.searchParams.get("q") ?? "",
      view:
        feedbackSearchParams.view.parse(url.searchParams.get("view") ?? "") ??
        "open",
      sort:
        feedbackSearchParams.sort.parse(url.searchParams.get("sort") ?? "") ??
        "title-asc",
      page: Number(url.searchParams.get("page") ?? 1),
    });
  } catch {
    return base;
  }
}
