"use client";

import { useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";
import { Group, Pagination, Select } from "@mantine/core";
import { useMounted } from "@mantine/hooks";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { forProject } from "@/modules/portal/lib/search";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordCollection } from "@/modules/ui/components/record-collection";

import {
  feedbackSearchParams,
  feedbackViews,
  feedbackSorts,
  serializeFeedbackQueue,
  type FeedbackQueueQuery,
  type FeedbackView,
} from "../lib/search-params";
import { feedbackInView, type FeedbackStatus } from "../lib/state";
import { selectFeedbackQueue } from "../lib/queue";

export function FeedbackList({ projectId }: { projectId: string }) {
  const t = useTranslations("Feedback");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { feedback } = usePortal();
  const [query, setQuery] = useQueryStates(feedbackSearchParams);
  const { q, view } = query;
  const mounted = useMounted();
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const mine = forProject(feedback, projectId);
  const base = `/projects/${projectId}/ideas/feedback`;
  const result = selectFeedbackQueue(feedback, query, projectId);
  const returnTo = serializeFeedbackQueue(base, {
    ...query,
    page: result.page,
  });
  const detailQuery = new URLSearchParams({ returnTo }).toString();
  const update = (patch: Partial<FeedbackQueueQuery>) =>
    void setQuery({ ...patch, page: 1 });
  const emptyView = mine.length > 0 && view !== "all";

  return (
    <RecordCollection
      title={t("title")}
      description={t("description")}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: base },
      ])}
      createHref={`${base}/new?${detailQuery}`}
      createLabel={t("new")}
      query={q}
      onQueryChange={(value) => update({ q: value })}
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
        { value: "all", label: t("tabAll"), count: mine.length },
      ]}
      view={view}
      onViewChange={(value) => {
        if (isFeedbackView(value)) update({ view: value });
      }}
      rows={result.items.map((item) => ({
        id: item.id,
        href: `${base}/${item.id}?${detailQuery}`,
        title: item.title,
        meta: `${item.id} · ${item.observation.slice(0, 160)}${item.observation.length > 160 ? "…" : ""}`,
        status: feedbackStatusLabel(item.status, portal),
      }))}
      emptyTitle={
        mine.length === 0 || view === "all"
          ? t("emptyAll")
          : view === "closed"
            ? t("emptyClosed")
            : t("emptyOpen")
      }
      emptyActionLabel={emptyView ? t("viewAll") : t("new")}
      onEmptyAction={emptyView ? () => update({ view: "all" }) : undefined}
      resultCount={result.total}
      toolbarControls={
        <Group px="md" pb="sm">
          <Select
            label={t("sort")}
            value={query.sort}
            allowDeselect={false}
            disabled={!mounted}
            data={feedbackSorts.map((value) => ({
              value,
              label:
                value === "title-asc" ? t("sortTitleAsc") : t("sortTitleDesc"),
            }))}
            onChange={(value) => {
              const sort = feedbackSorts.find((item) => item === value);
              if (sort) update({ sort });
            }}
          />
        </Group>
      }
      footer={
        result.pages > 1 ? (
          <Pagination
            total={result.pages}
            value={result.page}
            onChange={(page) => void setQuery({ page })}
            getControlProps={(control) => ({
              "aria-label":
                control === "next"
                  ? t("nextPage")
                  : control === "previous"
                    ? t("previousPage")
                    : undefined,
            })}
          />
        ) : null
      }
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
