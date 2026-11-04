"use client";

import { Button, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";

import { feedbackQueueReturnHref } from "../lib/queue-navigation";
import {
  FEEDBACK_TITLE_MAX_LENGTH,
  FEEDBACK_TEXT_MAX_LENGTH,
  validateFeedbackText,
} from "../lib/state";

export function FeedbackForm({ projectId }: { projectId: string }) {
  const t = useTranslations("Feedback");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { createFeedback } = usePortal();
  const router = useRouter();
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const required = portal("required");
  const form = useForm({
    initialValues: { title: "", observation: "" },
    validate: {
      title: (value) => {
        const issue = validateFeedbackText(value, FEEDBACK_TITLE_MAX_LENGTH);
        return issue === "required"
          ? required
          : issue === "tooLong"
            ? t("titleTooLong", { limit: FEEDBACK_TITLE_MAX_LENGTH })
            : null;
      },
      observation: (value) => {
        const issue = validateFeedbackText(value, FEEDBACK_TEXT_MAX_LENGTH);
        return issue === "required"
          ? required
          : issue === "tooLong"
            ? t("observationTooLong", { limit: FEEDBACK_TEXT_MAX_LENGTH })
            : null;
      },
    },
  });
  useUnsavedDraft(form.isDirty() && !saved, portal("discardDraft"));

  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;
  const base = `/projects/${projectId}/ideas/feedback`;
  const backHref = feedbackQueueReturnHref(base, searchParams.get("returnTo"));

  return (
    <PageFrame
      header={
        <PageHeader
          title={t("new")}
          breadcrumbs={recordTrail(application, nav("projects"), [
            { title: t("title"), href: backHref },
            { title: t("new"), href: `${base}/new` },
          ])}
        />
      }
    >
      <form
        noValidate
        onSubmit={form.onSubmit((values) => {
          const created = createFeedback({ projectId, ...values });
          if (!created) {
            setError(true);
            return;
          }
          setSaved(true);
          form.resetDirty();
          router.push(
            `${base}/${created.id}?${new URLSearchParams({ returnTo: backHref })}`,
          );
        })}
      >
        <Stack gap="md">
          <TextInput
            label={t("titleField")}
            required
            {...form.getInputProps("title")}
          />
          <Textarea
            label={t("observation")}
            required
            minRows={4}
            {...form.getInputProps("observation")}
          />
          <Group justify="flex-end">
            <Button component={Link} href={backHref} variant="default">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!mounted || saved}>
              {t("create")}
            </Button>
          </Group>
          {error ? (
            <Text c="red" role="alert">
              {t("createFailed")}
            </Text>
          ) : null}
        </Stack>
      </form>
    </PageFrame>
  );
}
