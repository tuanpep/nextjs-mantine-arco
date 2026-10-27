export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";
export const localeCookie = "DX_LOCALE";

export function isLocale(value: unknown): value is Locale {
  return value === "vi" || value === "en";
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}
