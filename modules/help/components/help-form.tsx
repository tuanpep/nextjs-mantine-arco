"use client";

import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";
import { useQueryStates } from "nuqs";
import { useState } from "react";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";

import { helpSearchParams, serializeHelpQueue } from "../lib/search-params";

export function HelpForm({ projectId }: { projectId: string }) {
  const t = useTranslations("HelpRequests");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const [query] = useQueryStates(helpSearchParams);
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
  const back = serializeHelpQueue(base, query);

  return (
    <PageFrame
      header={
        <PageHeader
          title={t("new")}
          breadcrumbs={recordTrail(application, nav("projects"), [
            { title: t("title"), href: back },
            { title: t("new"), href: serializeHelpQueue(`${base}/new`, query) },
          ])}
        />
      }
    >
      <form
        onSubmit={form.onSubmit((values) => {
          const created = createHelp({ projectId, ...values });
          if (created) {
            setSubmitted(true);
            router.push(serializeHelpQueue(`${base}/${created.id}`, query));
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
            <Button component={Link} href={back} variant="default">
              {portal("cancel")}
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
