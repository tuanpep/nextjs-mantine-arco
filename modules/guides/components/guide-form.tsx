"use client";

import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "nextjs-toploader/app";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";

export function GuideForm({ projectId }: { projectId: string }) {
  const t = useTranslations("Guides");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const { createGuide } = usePortal();
  const router = useRouter();
  const mounted = useMounted();
  const required = portal("required");
  const form = useForm({
    initialValues: { title: "", summary: "", body: "" },
    validate: {
      title: (value) => (value.trim() ? null : required),
      summary: (value) => (value.trim() ? null : required),
      body: (value) => (value.trim() ? null : required),
    },
  });

  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;
  const base = `/projects/${projectId}/guides`;

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
          const created = createGuide({ projectId, ...values });
          if (created) router.push(`${base}/${created.id}`);
        })}
      >
        <Stack gap="md">
          <TextInput
            label={t("titleField")}
            required
            {...form.getInputProps("title")}
          />
          <TextInput
            label={t("summary")}
            required
            {...form.getInputProps("summary")}
          />
          <Textarea
            label={t("body")}
            required
            minRows={6}
            {...form.getInputProps("body")}
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
