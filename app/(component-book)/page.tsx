import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ComponentBookIndex } from "@/modules/ui/component-book/component-book-index";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ComponentBook");
  return { title: t("title") };
}

export default function Page() {
  return <ComponentBookIndex />;
}
