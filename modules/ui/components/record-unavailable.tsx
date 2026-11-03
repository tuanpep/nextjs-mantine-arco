"use client";

import { useTranslations } from "next-intl";

import { DestinationUnavailable } from "./destination-unavailable";
import { PageFrame } from "./page-frame";

export function RecordUnavailable({ backHref }: { backHref: string }) {
  const t = useTranslations("Portal");
  return (
    <PageFrame>
      <DestinationUnavailable
        title={t("unavailableTitle")}
        description={t("unavailableBody")}
        backHref={backHref}
        backLabel={t("backToList")}
      />
    </PageFrame>
  );
}
