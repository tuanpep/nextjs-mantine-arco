"use client";

import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

export function GuideDetail({
  projectId,
  guideId,
}: {
  projectId: string;
  guideId: string;
}) {
  const t = useTranslations("Guides");
  const nav = useTranslations("Workspace");
  const { guides } = usePortal();
  const item = guides.find(
    (entry) => entry.id === guideId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/guides`;
  if (!application) return <ProjectUnavailable />;
  if (!item) return <RecordUnavailable backHref={base} />;

  return (
    <RecordDetailFrame
      title={item.title}
      meta={item.id}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: base },
        { title: item.title, href: `${base}/${item.id}` },
      ])}
    >
      <RecordFields
        fields={[
          { label: t("summary"), value: item.summary },
          { label: t("body"), value: item.body },
        ]}
      />
    </RecordDetailFrame>
  );
}
