"use client";

import { Text } from "@mantine/core";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { NoteAction } from "@/modules/ui/components/note-action";
import { NotesList } from "@/modules/ui/components/notes-list";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import { feedbackActions, type FeedbackStatus } from "../lib/state";

export function FeedbackDetail({
  projectId,
  feedbackId,
}: {
  projectId: string;
  feedbackId: string;
}) {
  const t = useTranslations("Feedback");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { feedback, reviewFeedback } = usePortal();
  const item = feedback.find(
    (entry) => entry.id === feedbackId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/ideas/feedback`;
  if (!application) return <ProjectUnavailable />;
  if (!item) return <RecordUnavailable backHref={base} />;

  return (
    <RecordDetailFrame
      title={item.title}
      status={feedbackStatusLabel(item.status, portal)}
      meta={item.id}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: base },
        { title: item.title, href: `${base}/${item.id}` },
      ])}
    >
      <RecordFields
        fields={[{ label: t("observation"), value: item.observation }]}
      />
      <NotesList
        title={portal("notes")}
        notes={item.notes.map((note) => ({
          label: portal("actionReview"),
          text: note.text,
        }))}
      />
      {feedbackActions(item.status).length === 0 ? (
        <Text size="sm">{portal("decisionStands")}</Text>
      ) : (
        <NoteAction
          actions={feedbackActions(item.status).map((kind) => ({
            value: kind,
            label: portal("actionReview"),
          }))}
          onSubmit={(_action, note) => reviewFeedback(projectId, item.id, note)}
        />
      )}
    </RecordDetailFrame>
  );
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
