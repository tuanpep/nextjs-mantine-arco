"use client";

import {
  Alert,
  Button,
  Group,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useState } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";

import {
  discussionSearchParams,
  serializeDiscussionQueue,
} from "../lib/search-params";
import { DISCUSSION_TITLE_LIMIT, DISCUSSION_TEXT_LIMIT } from "../lib/state";
import { useDiscussionDraft } from "./use-discussion-draft";

export function DiscussionForm({ projectId }: { projectId: string }) {
  const t = useTranslations("Discussions");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { createDiscussion } = usePortal();
  const router = useRouter();
  const mounted = useMounted();
  const [query] = useQueryStates(discussionSearchParams);
  const [failed, setFailed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const required = portal("required");
  const form = useForm({
    initialValues: { title: "", body: "" },
    validate: {
      title: (value) =>
        !value.trim()
          ? required
          : value.trim().length > DISCUSSION_TITLE_LIMIT
            ? t("tooLong", { count: DISCUSSION_TITLE_LIMIT })
            : null,
      body: (value) =>
        !value.trim()
          ? required
          : value.trim().length > DISCUSSION_TEXT_LIMIT
            ? t("tooLong", { count: DISCUSSION_TEXT_LIMIT })
            : null,
    },
  });
  useDiscussionDraft(!submitted && form.isDirty(), t("discardDraft"));

  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;
  const base = `/projects/${projectId}/discussions`;
  const back = serializeDiscussionQueue(base, query);

  return (
    <PageFrame
      header={
        <PageHeader
          title={t("new")}
          breadcrumbs={recordTrail(application, nav("projects"), [
            { title: t("title"), href: back },
            {
              title: t("new"),
              href: serializeDiscussionQueue(`${base}/new`, query),
            },
          ])}
        />
      }
    >
      <form
        onSubmit={form.onSubmit((values) => {
          const created = createDiscussion({ projectId, ...values });
          if (!created) {
            setFailed(true);
            return;
          }
          setSubmitted(true);
          router.push(serializeDiscussionQueue(`${base}/${created.id}`, query));
        })}
      >
        <Stack gap="md">
          <TextInput
            label={t("titleField")}
            required
            maxLength={DISCUSSION_TITLE_LIMIT}
            {...form.getInputProps("title")}
          />
          <Textarea
            label={t("body")}
            required
            minRows={5}
            autosize
            maxRows={16}
            maxLength={DISCUSSION_TEXT_LIMIT}
            {...form.getInputProps("body")}
          />
          {failed && (
            <Alert color="red" role="alert">
              {t("createFailed")}
            </Alert>
          )}
          <Group justify="flex-end">
            <Button component={Link} href={back} variant="default">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!mounted || submitted}>
              {t("create")}
            </Button>
          </Group>
        </Stack>
      </form>
    </PageFrame>
  );
}
