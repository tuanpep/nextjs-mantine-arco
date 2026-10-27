import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { localeCookie, resolveLocale } from "./config";

const catalogs = {
  vi: () => import("@/messages/vi.json").then((module) => module.default),
  en: () => import("@/messages/en.json").then((module) => module.default),
};

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = resolveLocale(store.get(localeCookie)?.value);

  return {
    locale,
    messages: await catalogs[locale](),
    timeZone: "Asia/Ho_Chi_Minh",
  };
});
