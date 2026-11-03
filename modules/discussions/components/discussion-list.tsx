"use client";

import { useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { forProject, includesQuery } from "@/modules/portal/lib/search";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordCollection } from "@/modules/ui/components/record-collection";

import { discussionSearchParams } from "../lib/search-params";

export function DiscussionList({ projectId }: { projectId: string }) {
  const t = useTranslations("Discussions");
  const nav = useTranslations("Workspace");
  const { discussions } = usePortal();
  const [{ q }, setQuery] = useQueryStates(discussionSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const base = `/projects/${projectId}/discussions`;
  const rows = forProject(discussions, projectId).filter((item) =>
    includesQuery(q, [item.title, item.body, item.id]),
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
      rows={rows.map((item) => ({
        id: item.id,
        href: `${base}/${item.id}`,
        title: item.title,
        meta: `${item.id} · ${t("replyCount", { count: item.replies.length })}`,
      }))}
      emptyTitle={t("empty")}
      emptyActionLabel={t("new")}
    />
  );
}
