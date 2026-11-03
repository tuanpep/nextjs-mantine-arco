"use client";

import { useTranslations } from "next-intl";

import { DestinationUnavailable } from "./destination-unavailable";
import { PageFrame } from "./page-frame";

export function ProjectUnavailable() {
  const t = useTranslations("Portal");
  return (
    <PageFrame>
      <DestinationUnavailable
        title={t("unavailableTitle")}
        description={t("unavailableBody")}
        backHref="/"
        backLabel={t("backToProjects")}
      />
    </PageFrame>
  );
}
