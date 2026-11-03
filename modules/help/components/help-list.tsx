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
  helpSearchParams,
  helpViews,
  type HelpView,
} from "../lib/search-params";
import { helpInView, type HelpStatus } from "../lib/state";

export function HelpList({ projectId }: { projectId: string }) {
  const t = useTranslations("HelpRequests");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { help } = usePortal();
  const [{ q, view }, setQuery] = useQueryStates(helpSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const mine = forProject(help, projectId);
  const base = `/projects/${projectId}/support/help`;
  const rows = mine.filter(
    (item) =>
      helpInView(item, view) &&
      includesQuery(q, [item.question, item.tried, item.id]),
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
          count: mine.filter((item) => helpInView(item, "open")).length,
        },
        {
          value: "answered",
          label: t("tabAnswered"),
          count: mine.filter((item) => helpInView(item, "answered")).length,
        },
      ]}
      view={view}
      onViewChange={(value) => {
        if (isHelpView(value)) void setQuery({ view: value });
      }}
      rows={rows.map((item) => ({
        id: item.id,
        href: `${base}/${item.id}`,
        title: item.question,
        meta: item.id,
        status: helpStatusLabel(item.status, portal),
      }))}
      emptyTitle={view === "answered" ? t("emptyAnswered") : t("emptyOpen")}
      emptyActionLabel={t("new")}
    />
  );
}

function isHelpView(value: string): value is HelpView {
  return (helpViews as readonly string[]).includes(value);
}

function helpStatusLabel(
  status: HelpStatus,
  t: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (status) {
    case "Open":
      return t("statusOpen");
    case "Answered":
      return t("statusAnswered");
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}
