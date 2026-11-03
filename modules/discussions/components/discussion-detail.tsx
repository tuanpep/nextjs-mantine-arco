"use client";

import { Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { NoteAction } from "@/modules/ui/components/note-action";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordDetailFrame } from "@/modules/ui/components/record-detail-frame";
import { RecordFields } from "@/modules/ui/components/record-fields";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import { DEMO_AUTHOR } from "../lib/state";

export function DiscussionDetail({
  projectId,
  threadId,
}: {
  projectId: string;
  threadId: string;
}) {
  const t = useTranslations("Discussions");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { discussions, replyToDiscussion } = usePortal();
  const item = discussions.find(
    (entry) => entry.id === threadId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/discussions`;
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
      <RecordFields fields={[{ label: t("body"), value: item.body }]} />
      <Stack component="section" aria-label={portal("replies")} gap="sm">
        <Title order={2} size="h4">
          {t("replyCount", { count: item.replies.length })}
        </Title>
        {item.replies.map((reply) => (
          <Stack key={reply.id} gap={2}>
            <Text size="sm" fw={600}>
              {reply.author === DEMO_AUTHOR ? portal("you") : reply.author}
            </Text>
            <Text style={{ whiteSpace: "pre-wrap" }}>{reply.text}</Text>
          </Stack>
        ))}
      </Stack>
      <NoteAction
        actions={[{ value: "reply", label: t("postReply") }]}
        noteLabel={t("reply")}
        submitLabel={t("postReply")}
        onSubmit={(_action, note) =>
          replyToDiscussion(projectId, item.id, note)
        }
      />
    </RecordDetailFrame>
  );
}
