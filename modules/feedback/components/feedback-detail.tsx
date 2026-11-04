"use client";

import { Anchor, Text } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { NotesList } from "@/modules/ui/components/notes-list";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import { feedbackQueueReturnHref } from "../lib/queue-navigation";
import { type FeedbackStatus } from "../lib/state";
import { FeedbackReviewForm } from "./feedback-review-form";

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
  const searchParams = useSearchParams();
  const [reviewed, setReviewed] = useState(false);
  const { feedback, reviewFeedback } = usePortal();
  const item = feedback.find(
    (entry) => entry.id === feedbackId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/ideas/feedback`;
  const backHref = feedbackQueueReturnHref(base, searchParams.get("returnTo"));
  if (!application) return <ProjectUnavailable />;
  if (!item) return <RecordUnavailable backHref={backHref} />;

  return (
    <RecordDetailFrame
      title={item.title}
      status={feedbackStatusLabel(item.status, portal)}
      meta={item.id}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: backHref },
        { title: item.title, href: `${base}/${item.id}` },
      ])}
    >
      <Anchor component={Link} href={backHref}>
        {t("back")}
      </Anchor>
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
      {reviewed ? <Text role="status">{t("reviewSucceeded")}</Text> : null}
      {item.status === "New" ? (
        <FeedbackReviewForm
          onSubmit={(note) => {
            const success = reviewFeedback(projectId, item.id, note);
            if (success) setReviewed(true);
            return success;
          }}
        />
      ) : null}
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
