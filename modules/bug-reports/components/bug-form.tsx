"use client";

import {
  Accordion,
  Badge,
  Box,
  Button,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, type GetInputPropsReturnType } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordFields } from "@/modules/ui/components/record-fields";

import { acceptBugFiles, bugAttachmentMessage } from "../lib/attachments";
import { bugSeverity, isImpactScope, isUrgency } from "../lib/intake";
import { isPageUrl } from "../lib/state";

import { BugUpload, type BugUploadFile } from "./bug-upload";
import { useBugCopy } from "./use-bug-copy";

type BugFormValues = {
  title: string;
  happened: string;
  steps: string;
  expected: string;
  environment: string;
  pageUrl: string;
  correlationId: string;
  impactDetail: string;
  impactScope: string;
  urgency: string;
  attachments: BugUploadFile[];
};

export function BugForm({ projectId }: { projectId: string }) {
  const t = useTranslations("Bugs");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const copy = useBugCopy();
  const { createBug } = usePortal();
  const router = useRouter();
  const mounted = useMounted();
  const [step, setStep] = useState<"describe" | "review">("describe");
  const required = portal("required");
  const form = useForm<BugFormValues>({
    initialValues: {
      title: "",
      happened: "",
      steps: "",
      expected: "",
      environment: "",
      pageUrl: "",
      correlationId: "",
      impactDetail: "",
      impactScope: "",
      urgency: "",
      attachments: [],
    },
    validate: {
      title: (value) => (value.trim() ? null : required),
      happened: (value) => (value.trim() ? null : required),
      steps: (value) => (value.trim() ? null : required),
      expected: (value) => (value.trim() ? null : required),
      environment: (value) => (value.trim() ? null : required),
      pageUrl: (value) =>
        !value.trim() || isPageUrl(value.trim()) ? null : t("pageUrlInvalid"),
      impactScope: (value) => (isImpactScope(value) ? null : required),
      urgency: (value) => (isUrgency(value) ? null : required),
      attachments: (value) => {
        const accepted = acceptBugFiles(value.map((item) => item.file));
        return "error" in accepted
          ? bugAttachmentMessage(accepted.error, attachmentCopy(t))
          : null;
      },
    },
  });

  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;
  const base = `/projects/${projectId}/support/bugs`;
  const scope = form.values.impactScope;
  const urgency = form.values.urgency;
  const severity =
    isImpactScope(scope) && isUrgency(urgency)
      ? bugSeverity(scope, urgency)
      : null;
  const reviewing =
    step === "review" &&
    severity !== null &&
    isImpactScope(scope) &&
    isUrgency(urgency);

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
      <Box
        component="form"
        maw={960}
        noValidate
        onSubmit={form.onSubmit(
          (values) => {
            const accepted = acceptBugFiles(
              values.attachments.map((item) => item.file),
            );
            if ("error" in accepted) {
              setStep("describe");
              return;
            }
            if (step === "describe") {
              setStep("review");
              return;
            }
            const created = createBug({
              projectId,
              title: values.title,
              happened: values.happened,
              steps: values.steps,
              expected: values.expected,
              environment: values.environment,
              pageUrl: values.pageUrl,
              correlationId: values.correlationId,
              impactDetail: values.impactDetail,
              impactScope: values.impactScope,
              urgency: values.urgency,
              attachments: accepted.attachments.map((attachment, index) => {
                const previewUrl = values.attachments[index]?.previewUrl;
                return previewUrl ? { ...attachment, previewUrl } : attachment;
              }),
            });
            if (created) router.push(`${base}/${created.id}`);
          },
          () => setStep("describe"),
        )}
      >
        {reviewing && isImpactScope(scope) && isUrgency(urgency) ? (
          <Stack gap="md">
            <RecordFields
              fields={[
                { label: portal("severity"), value: copy.severity(severity) },
                { label: t("titleField"), value: form.values.title.trim() },
                { label: t("happened"), value: form.values.happened.trim() },
                { label: t("expected"), value: form.values.expected.trim() },
                { label: t("steps"), value: form.values.steps.trim() },
                {
                  label: t("environment"),
                  value: form.values.environment.trim(),
                },
                { label: t("pageUrl"), value: form.values.pageUrl.trim() },
                { label: t("impactScope"), value: copy.impact(scope) },
                { label: t("urgency"), value: copy.urgency(urgency) },
                {
                  label: t("correlation"),
                  value: form.values.correlationId.trim(),
                },
                {
                  label: t("impactDetail"),
                  value: form.values.impactDetail.trim(),
                },
              ].filter((field) => field.value.length > 0)}
            />
            {form.values.attachments.length > 0 ? (
              <BugUpload files={form.values.attachments} readOnly />
            ) : null}
            <Group justify="flex-end">
              <Button
                type="button"
                variant="default"
                onClick={() => setStep("describe")}
              >
                {t("edit")}
              </Button>
              <Button type="submit" disabled={!mounted}>
                {t("create")}
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap="md">
            <TextInput
              label={t("titleField")}
              required
              {...form.getInputProps("title")}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Textarea
                label={t("happened")}
                required
                autosize
                minRows={2}
                maxRows={6}
                {...form.getInputProps("happened")}
              />
              <Textarea
                label={t("expected")}
                required
                autosize
                minRows={2}
                maxRows={6}
                {...form.getInputProps("expected")}
              />
            </SimpleGrid>
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing="md"
              style={{ alignItems: "start" }}
            >
              <Textarea
                label={t("steps")}
                required
                autosize
                minRows={3}
                maxRows={8}
                placeholder={t("stepsPlaceholder")}
                {...form.getInputProps("steps")}
              />
              <Stack gap="sm">
                <TextInput
                  label={t("environment")}
                  required
                  placeholder={t("environmentPlaceholder")}
                  {...form.getInputProps("environment")}
                />
                <TextInput
                  type="url"
                  inputMode="url"
                  label={t("pageUrl")}
                  placeholder="https://"
                  {...form.getInputProps("pageUrl")}
                />
              </Stack>
            </SimpleGrid>
            <BugUpload
              files={form.values.attachments}
              error={form.errors.attachments}
              onChange={(next, issue) => {
                form.setFieldValue("attachments", next);
                if (issue) {
                  form.setFieldError(
                    "attachments",
                    bugAttachmentMessage(issue, attachmentCopy(t)),
                  );
                  return;
                }
                form.clearFieldError("attachments");
              }}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <ChoiceField
                label={t("impactScope")}
                options={copy.impactOptions}
                {...form.getInputProps("impactScope")}
              />
              <ChoiceField
                label={t("urgency")}
                options={copy.urgencyOptions}
                {...form.getInputProps("urgency")}
              />
            </SimpleGrid>
            <Group gap="xs">
              {severity ? (
                <Badge variant="light">{copy.severity(severity)}</Badge>
              ) : null}
              <Text size="sm" c="dimmed">
                {t("severityFrom")}
              </Text>
            </Group>
            <Accordion order={2}>
              <Accordion.Item value="more">
                <Accordion.Control>{t("moreDetail")}</Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="sm">
                    <TextInput
                      label={t("correlation")}
                      {...form.getInputProps("correlationId")}
                    />
                    <Textarea
                      label={t("impactDetail")}
                      autosize
                      minRows={2}
                      maxRows={6}
                      placeholder={t("impactDetailPlaceholder")}
                      {...form.getInputProps("impactDetail")}
                    />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Group justify="flex-end">
              <Button type="submit">{t("review")}</Button>
            </Group>
          </Stack>
        )}
      </Box>
    </PageFrame>
  );
}

function ChoiceField({
  label,
  options,
  value,
  onChange,
  ...input
}: {
  label: string;
  options: { value: string; label: string }[];
} & GetInputPropsReturnType) {
  const t = useTranslations("Bugs");
  return (
    <Select
      label={label}
      required
      allowDeselect={false}
      placeholder={t("choose")}
      data={options}
      value={typeof value === "string" && value.length > 0 ? value : null}
      onChange={(next) => onChange(next ?? "")}
      {...input}
    />
  );
}

function attachmentCopy(t: ReturnType<typeof useTranslations<"Bugs">>) {
  return {
    type: t("attachmentType"),
    size: t("attachmentSize"),
    count: t("attachmentCount"),
  };
}
