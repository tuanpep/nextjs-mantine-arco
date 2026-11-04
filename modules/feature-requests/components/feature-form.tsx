"use client";

import { Button, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";

import { featureQueueReturnHref } from "../lib/queue-navigation";
import {
  FEATURE_TITLE_MAX_LENGTH,
  FEATURE_TEXT_MAX_LENGTH,
  validateFeatureText,
} from "../lib/state";
import { SimilarFeatureRequests } from "./similar-feature-requests";

export function FeatureForm({ projectId }: { projectId: string }) {
  const t = useTranslations("Features");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { createFeature } = usePortal();
  const router = useRouter();
  const mounted = useMounted();
  const [returnTo] = useQueryState("returnTo", parseAsString);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const required = portal("required");
  const validate = (value: string, limit: number) => {
    const issue = validateFeatureText(value, limit);
    return issue === "required"
      ? required
      : issue === "tooLong"
        ? t("tooLong", { limit })
        : null;
  };
  const form = useForm({
    initialValues: { title: "", problem: "", outcome: "" },
    validate: {
      title: (value) => validate(value, FEATURE_TITLE_MAX_LENGTH),
      problem: (value) => validate(value, FEATURE_TEXT_MAX_LENGTH),
      outcome: (value) => validate(value, FEATURE_TEXT_MAX_LENGTH),
    },
  });
  useUnsavedDraft(form.isDirty() && !saved, portal("discardDraft"));

  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;
  const base = `/projects/${projectId}/ideas/features`;
  const backHref = featureQueueReturnHref(base, returnTo);

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
          const created = createFeature({ projectId, ...values });
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
          <SimilarFeatureRequests
            projectId={projectId}
            title={form.values.title}
          />
          <Textarea
            label={t("problem")}
            required
            minRows={3}
            {...form.getInputProps("problem")}
          />
          <Textarea
            label={t("outcome")}
            required
            minRows={3}
            {...form.getInputProps("outcome")}
          />
          {error ? (
            <Text c="red" role="alert">
              {t("createFailed")}
            </Text>
          ) : null}
          <Group justify="flex-end">
            <Button component={Link} href={backHref} variant="default">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!mounted}>
              {t("create")}
            </Button>
          </Group>
        </Stack>
      </form>
    </PageFrame>
  );
}
