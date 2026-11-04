export function featureQueueReturnHref(
  base: string,
  returnTo: string | null,
): string {
  if (!returnTo?.startsWith(`${base}?`) && returnTo !== base) return base;
  try {
    const url = new URL(returnTo, "https://portal.invalid");
    return url.origin === "https://portal.invalid" &&
      url.pathname === base &&
      !url.hash
      ? `${url.pathname}${url.search}`
      : base;
  } catch {
    return base;
  }
}
