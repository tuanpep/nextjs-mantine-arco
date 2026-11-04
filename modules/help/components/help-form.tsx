"use client";

import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";

export function HelpForm({ projectId }: { projectId: string }) {
  const t = useTranslations("HelpRequests");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { createHelp } = usePortal();
  const router = useRouter();
  const mounted = useMounted();
  const [submitted, setSubmitted] = useState(false);
  const required = portal("required");
  const form = useForm({
    initialValues: { question: "", tried: "" },
    validate: {
      question: (value) => (value.trim() ? null : required),
      tried: (value) => (value.trim() ? null : required),
    },
  });
  useUnsavedDraft(!submitted && form.isDirty(), portal("discardDraft"));

  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;
  const base = `/projects/${projectId}/support/help`;

  return (
    <PageFrame
      header={
        <PageHeader
          title={t("new")}
          breadcrumbs={recordTrail(application, nav("projects"), [
            { title: t("title"), href: base },
            { title: t("new"), href: `${base}/new` },
          ])}
        />
      }
    >
      <form
        onSubmit={form.onSubmit((values) => {
          const created = createHelp({ projectId, ...values });
          if (created) {
            setSubmitted(true);
            router.push(`${base}/${created.id}`);
          }
        })}
      >
        <Stack gap="md">
          <Textarea
            label={t("question")}
            required
            minRows={3}
            {...form.getInputProps("question")}
          />
          <Textarea
            label={t("tried")}
            required
            minRows={3}
            {...form.getInputProps("tried")}
          />
          <Group justify="flex-end">
            <Button type="submit" disabled={!mounted}>
              {t("create")}
            </Button>
          </Group>
        </Stack>
      </form>
    </PageFrame>
  );
}
