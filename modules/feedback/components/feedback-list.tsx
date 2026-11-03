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
  feedbackSearchParams,
  feedbackViews,
  type FeedbackView,
} from "../lib/search-params";
import { feedbackInView, type FeedbackStatus } from "../lib/state";

export function FeedbackList({ projectId }: { projectId: string }) {
  const t = useTranslations("Feedback");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { feedback } = usePortal();
  const [{ q, view }, setQuery] = useQueryStates(feedbackSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const mine = forProject(feedback, projectId);
  const base = `/projects/${projectId}/ideas/feedback`;
  const rows = mine.filter(
    (item) =>
      feedbackInView(item, view) &&
      includesQuery(q, [item.title, item.observation, item.id]),
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
          count: mine.filter((item) => feedbackInView(item, "open")).length,
        },
        {
          value: "closed",
          label: t("tabClosed"),
          count: mine.filter((item) => feedbackInView(item, "closed")).length,
        },
      ]}
      view={view}
      onViewChange={(value) => {
        if (isFeedbackView(value)) void setQuery({ view: value });
      }}
      rows={rows.map((item) => ({
        id: item.id,
        href: `${base}/${item.id}`,
        title: item.title,
        meta: item.id,
        status: feedbackStatusLabel(item.status, portal),
      }))}
      emptyTitle={view === "closed" ? t("emptyClosed") : t("emptyOpen")}
      emptyActionLabel={t("new")}
    />
  );
}

function isFeedbackView(value: string): value is FeedbackView {
  return (feedbackViews as readonly string[]).includes(value);
}

function feedbackStatusLabel(
  status: FeedbackStatus,
  t: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (status) {
    case "New":
      return t("statusNew");
    case "Reviewed":
      return t("statusReviewed");
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}
