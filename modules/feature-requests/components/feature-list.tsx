"use client";

import { useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { forProject, includesQuery } from "@/modules/portal/lib/search";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordCollection } from "@/modules/ui/components/record-collection";

import {
  featureSearchParams,
  featureViews,
  type FeatureView,
} from "../lib/search-params";
import { featureInView, type FeatureStatus } from "../lib/state";

export function FeatureList({ projectId }: { projectId: string }) {
  const t = useTranslations("Features");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { features } = usePortal();
  const [{ q, view }, setQuery] = useQueryStates(featureSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const mine = forProject(features, projectId);
  const base = `/projects/${projectId}/ideas/features`;
  const rows = mine.filter(
    (item) =>
      featureInView(item, view) &&
      includesQuery(q, [item.title, item.problem, item.id]),
  );

  return (
    <RecordCollection
      title={t("title")}
      description={t("description")}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: base },
      ])}
      createHref={`${base}/new`}
      createLabel={t("new")}
      query={q}
      onQueryChange={(value) => void setQuery({ q: value })}
      views={[
        {
          value: "open",
          label: t("tabOpen"),
          count: mine.filter((item) => featureInView(item, "open")).length,
        },
        {
          value: "closed",
          label: t("tabClosed"),
          count: mine.filter((item) => featureInView(item, "closed")).length,
        },
      ]}
      view={view}
      onViewChange={(value) => {
        if (isFeatureView(value)) void setQuery({ view: value });
      }}
      rows={rows.map((item) => ({
        id: item.id,
        href: `${base}/${item.id}`,
        title: item.title,
        meta: item.id,
        status: featureStatusLabel(item.status, portal),
      }))}
      emptyTitle={view === "closed" ? t("emptyClosed") : t("emptyOpen")}
      emptyActionLabel={t("new")}
    />
  );
}

function isFeatureView(value: string): value is FeatureView {
  return (featureViews as readonly string[]).includes(value);
}

function featureStatusLabel(
  status: FeatureStatus,
  t: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (status) {
    case "Submitted":
      return t("statusSubmitted");
    case "Accepted":
      return t("statusAccepted");
    case "Declined":
      return t("statusDeclined");
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}
