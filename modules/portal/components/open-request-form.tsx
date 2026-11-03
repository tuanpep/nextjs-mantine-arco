"use client";

import {
  Anchor,
  Button,
  Collapse,
  NativeSelect,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useMounted } from "@mantine/hooks";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  BugUpload,
  type BugUploadFile,
} from "@/modules/bug-reports/components/bug-upload";
import { useBugCopy } from "@/modules/bug-reports/components/use-bug-copy";
import {
  acceptBugFiles,
  bugAttachmentMessage,
} from "@/modules/bug-reports/lib/attachments";
import { isImpactScope, isUrgency } from "@/modules/bug-reports/lib/intake";
import { isPageUrl } from "@/modules/bug-reports/lib/state";

import {
  createOpenRequest,
  openRequestKinds,
  openRequestUsesTitle,
  type CreatedOpenRequest,
  type OpenRequestKind,
} from "../lib/create-open-request";

import { usePortal } from "./portal-provider";

export type ProjectOption = {
  value: string;
  label: string;
};

export function OpenRequestForm({
  defaultProjectId,
  projectOptions,
  onClose,
}: {
  defaultProjectId: string;
  projectOptions: ProjectOption[];
  onClose: () => void;
}) {
  const portal = useTranslations("Portal");
  const workspace = useTranslations("Workspace");
  const bugs = useTranslations("Bugs");
  const help = useTranslations("HelpRequests");
  const features = useTranslations("Features");
  const feedback = useTranslations("Feedback");
  const copy = useBugCopy();
  const [more, { toggle: toggleMore }] = useDisclosure(false);
  const [files, setFiles] = useState<BugUploadFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const { createBug, createHelp, createFeature, createFeedback } = usePortal();
  const mounted = useMounted();
  const required = portal("required");
  const [created, setCreated] = useState<CreatedOpenRequest | null>(null);
  const form = useForm({
    initialValues: {
      projectId: defaultProjectId,
      kind: "bug" as OpenRequestKind,
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
      question: "",
      tried: "",
      problem: "",
      outcome: "",
      observation: "",
    },
    validate: {
      projectId: (value) => (value ? null : required),
      title: (value, values) =>
        openRequestUsesTitle(values.kind) && !value.trim() ? required : null,
      happened: (value, values) =>
        values.kind === "bug" && !value.trim() ? required : null,
      steps: (value, values) =>
        values.kind === "bug" && !value.trim() ? required : null,
      expected: (value, values) =>
        values.kind === "bug" && !value.trim() ? required : null,
      environment: (value, values) =>
        values.kind === "bug" && !value.trim() ? required : null,
      pageUrl: (value, values) =>
        values.kind === "bug" && value.trim() && !isPageUrl(value.trim())
          ? bugs("pageUrlInvalid")
          : null,
      impactScope: (value, values) =>
        values.kind === "bug" && !isImpactScope(value) ? required : null,
      urgency: (value, values) =>
        values.kind === "bug" && !isUrgency(value) ? required : null,
      question: (value, values) =>
        values.kind === "help" && !value.trim() ? required : null,
      tried: (value, values) =>
        values.kind === "help" && !value.trim() ? required : null,
      problem: (value, values) =>
        values.kind === "feature" && !value.trim() ? required : null,
      outcome: (value, values) =>
        values.kind === "feature" && !value.trim() ? required : null,
      observation: (value, values) =>
        values.kind === "feedback" && !value.trim() ? required : null,
    },
  });

  if (created) {
    return (
      <Stack gap="sm">
        <Text size="sm">{portal("savedRecord", { id: created.id })}</Text>
        <Anchor component={Link} href={created.href} onClick={onClose}>
          {created.title}
        </Anchor>
        <Button type="button" variant="default" onClick={onClose}>
          {portal("close")}
        </Button>
      </Stack>
    );
  }

  const kind = form.values.kind;

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        const accepted =
          values.kind === "bug"
            ? acceptBugFiles(files.map((item) => item.file))
            : { attachments: [] };
        if ("error" in accepted) {
          setFileError(
            bugAttachmentMessage(accepted.error, {
              type: bugs("attachmentType"),
              size: bugs("attachmentSize"),
              count: bugs("attachmentCount"),
            }),
          );
          return;
        }
        const record = createOpenRequest(
          values,
          accepted.attachments.map((attachment, index) => {
            const previewUrl = files[index]?.previewUrl;
            return previewUrl ? { ...attachment, previewUrl } : attachment;
          }),
          {
            createBug,
            createHelp,
            createFeature,
            createFeedback,
          },
        );
        if (record) setCreated(record);
      })}
    >
      <Stack gap="sm">
        <NativeSelect
          label={workspace("project")}
          required
          data={[
            { value: "", label: workspace("chooseProject"), disabled: true },
            ...projectOptions,
          ]}
          {...form.getInputProps("projectId")}
        />
        <NativeSelect
          label={portal("requestType")}
          required
          data={openRequestKinds.map((item) => ({
            value: item,
            label: kindLabel(item, { bugs, help, features, feedback }),
          }))}
          {...form.getInputProps("kind")}
        />
        {kind === "bug" ? (
          <>
            <TextInput
              label={bugs("titleField")}
              required
              {...form.getInputProps("title")}
            />
            <Textarea
              label={bugs("happened")}
              required
              minRows={2}
              {...form.getInputProps("happened")}
            />
            <Textarea
              label={bugs("steps")}
              required
              minRows={2}
              {...form.getInputProps("steps")}
            />
            <Textarea
              label={bugs("expected")}
              required
              minRows={2}
              {...form.getInputProps("expected")}
            />
            <TextInput
              label={bugs("environment")}
              required
              placeholder={bugs("environmentPlaceholder")}
              {...form.getInputProps("environment")}
            />
            <TextInput
              label={bugs("pageUrl")}
              placeholder="https://"
              {...form.getInputProps("pageUrl")}
            />
            <BugUpload
              files={files}
              error={fileError}
              onChange={(next, issue) => {
                setFiles(next);
                setFileError(
                  issue
                    ? bugAttachmentMessage(issue, {
                        type: bugs("attachmentType"),
                        size: bugs("attachmentSize"),
                        count: bugs("attachmentCount"),
                      })
                    : null,
                );
              }}
            />
            <NativeSelect
              label={bugs("impactScope")}
              required
              data={[
                { value: "", label: bugs("choose"), disabled: true },
                ...copy.impactOptions,
              ]}
              {...form.getInputProps("impactScope")}
            />
            <NativeSelect
              label={bugs("urgency")}
              required
              data={[
                { value: "", label: bugs("choose"), disabled: true },
                ...copy.urgencyOptions,
              ]}
              {...form.getInputProps("urgency")}
            />
            <Text size="sm" c="dimmed">
              {bugs("severityFrom")}
            </Text>
            <div>
              <Button
                type="button"
                variant="subtle"
                px={0}
                onClick={toggleMore}
              >
                {bugs("moreDetail")}
              </Button>
              <Collapse expanded={more}>
                <Stack gap="sm" mt="sm">
                  <TextInput
                    label={bugs("correlation")}
                    {...form.getInputProps("correlationId")}
                  />
                  <Textarea
                    label={bugs("impactDetail")}
                    minRows={2}
                    {...form.getInputProps("impactDetail")}
                  />
                </Stack>
              </Collapse>
            </div>
          </>
        ) : null}
        {kind === "help" ? (
          <>
            <Textarea
              label={help("question")}
              required
              minRows={2}
              {...form.getInputProps("question")}
            />
            <Textarea
              label={help("tried")}
              required
              minRows={2}
              {...form.getInputProps("tried")}
            />
          </>
        ) : null}
        {kind === "feature" ? (
          <>
            <TextInput
              label={features("titleField")}
              required
              {...form.getInputProps("title")}
            />
            <Textarea
              label={features("problem")}
              required
              minRows={2}
              {...form.getInputProps("problem")}
            />
            <Textarea
              label={features("outcome")}
              required
              minRows={2}
              {...form.getInputProps("outcome")}
            />
          </>
        ) : null}
        {kind === "feedback" ? (
          <>
            <TextInput
              label={feedback("titleField")}
              required
              {...form.getInputProps("title")}
            />
            <Textarea
              label={feedback("observation")}
              required
              minRows={2}
              {...form.getInputProps("observation")}
            />
          </>
        ) : null}
        <Button type="submit" disabled={!mounted}>
          {submitLabel(kind, { bugs, help, features, feedback })}
        </Button>
      </Stack>
    </form>
  );
}

function kindLabel(
  kind: OpenRequestKind,
  labels: {
    bugs: (key: "title") => string;
    help: (key: "title") => string;
    features: (key: "title") => string;
    feedback: (key: "title") => string;
  },
) {
  switch (kind) {
    case "bug":
      return labels.bugs("title");
    case "help":
      return labels.help("title");
    case "feature":
      return labels.features("title");
    case "feedback":
      return labels.feedback("title");
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}

function submitLabel(
  kind: OpenRequestKind,
  labels: {
    bugs: (key: "create") => string;
    help: (key: "create") => string;
    features: (key: "create") => string;
    feedback: (key: "create") => string;
  },
) {
  switch (kind) {
    case "bug":
      return labels.bugs("create");
    case "help":
      return labels.help("create");
    case "feature":
      return labels.features("create");
    case "feedback":
      return labels.feedback("create");
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}
