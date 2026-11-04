"use client";

import {
  Alert,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordUnavailable } from "@/modules/ui/components/record-unavailable";

import {
  discussionSearchParams,
  serializeDiscussionQueue,
} from "../lib/search-params";
import { DISCUSSION_TEXT_LIMIT } from "../lib/state";
import { DiscussionPost } from "./discussion-post";
import { useDiscussionDraft } from "./use-discussion-draft";

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
  const [query] = useQueryStates(discussionSearchParams);
  const [outcome, setOutcome] = useState<"idle" | "success" | "error">("idle");
  const form = useForm({
    initialValues: { text: "" },
    validate: {
      text: (value) =>
        !value.trim()
          ? portal("required")
          : value.trim().length > DISCUSSION_TEXT_LIMIT
            ? t("tooLong", { count: DISCUSSION_TEXT_LIMIT })
            : null,
    },
  });
  useDiscussionDraft(Boolean(form.values.text.trim()), t("discardDraft"));
  const item = discussions.find(
    (entry) => entry.id === threadId && entry.projectId === projectId,
  );
  const application = getApplication(projectId);
  const base = `/projects/${projectId}/discussions`;
  const back = serializeDiscussionQueue(base, query);
  if (!application) return <ProjectUnavailable />;
  if (!item) return <RecordUnavailable backHref={back} />;

  return (
    <PageFrame
      header={
        <PageHeader
          title={item.title}
          breadcrumbs={recordTrail(application, nav("projects"), [
            { title: t("title"), href: back },
            {
              title: item.title,
              href: serializeDiscussionQueue(`${base}/${item.id}`, query),
            },
          ])}
          actions={
            <Button component={Link} href={back} variant="default">
              {t("back")}
            </Button>
          }
        />
      }
    >
      <Stack gap="lg">
        <DiscussionPost
          author={item.author}
          createdAt={item.createdAt}
          text={item.body}
          opening
        />
        <Stack component="section" aria-label={portal("replies")} gap="sm">
          <Title order={2} size="h4">
            {t("replyCount", { count: item.replies.length })}
          </Title>
          {item.replies.length ? (
            item.replies.map((reply) => (
              <DiscussionPost
                key={reply.id}
                author={reply.author}
                createdAt={reply.createdAt}
                text={reply.text}
              />
            ))
          ) : (
            <Text size="sm" c="dimmed">
              {t("firstReply")}
            </Text>
          )}
        </Stack>
        <form
          onSubmit={form.onSubmit(({ text }) => {
            if (!replyToDiscussion(projectId, item.id, text)) {
              setOutcome("error");
              return;
            }
            form.reset();
            setOutcome("success");
          })}
        >
          <Stack gap="sm">
            <Textarea
              label={t("reply")}
              required
              minRows={4}
              autosize
              maxRows={12}
              maxLength={DISCUSSION_TEXT_LIMIT}
              {...form.getInputProps("text")}
              onChange={(event) => {
                form.setFieldValue("text", event.currentTarget.value);
                setOutcome("idle");
              }}
            />
            {outcome === "error" && (
              <Alert color="red" role="alert">
                {t("replyFailed")}
              </Alert>
            )}
            <Group justify="space-between">
              <Text size="sm" c="dimmed" role="status">
                {outcome === "success" ? t("replySaved") : ""}
              </Text>
              <Button type="submit">{t("postReply")}</Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </PageFrame>
  );
}
