"use client";

import {
  Anchor,
  Button,
  Checkbox,
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
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";

import {
  BugUpload,
  type BugUploadFile,
} from "@/modules/bug-reports/components/bug-upload";
import { SimilarBugReports } from "@/modules/bug-reports/components/similar-bug-reports";
import { useBugCopy } from "@/modules/bug-reports/components/use-bug-copy";
import {
  acceptBugFiles,
  bugAttachmentMessage,
} from "@/modules/bug-reports/lib/attachments";
import { isImpactScope, isUrgency } from "@/modules/bug-reports/lib/intake";
import {
  bugTextLimits,
  validateBugText,
  isPageUrl,
} from "@/modules/bug-reports/lib/state";
import { useUnsavedDraft } from "@/modules/ui/components/use-unsaved-draft";
import { SimilarFeatureRequests } from "@/modules/feature-requests/components/similar-feature-requests";
import {
  FEATURE_TITLE_MAX_LENGTH,
  FEATURE_TEXT_MAX_LENGTH,
  validateFeatureText,
} from "@/modules/feature-requests/lib/state";
import {
  FEEDBACK_TITLE_MAX_LENGTH,
  FEEDBACK_TEXT_MAX_LENGTH,
  validateFeedbackText,
} from "@/modules/feedback/lib/state";

import {
  createOpenRequest,
  openRequestKinds,
  openRequestUsesTitle,
  type CreatedOpenRequest,
  type OpenRequestKind,
  type OpenRequestValues,
} from "../lib/create-open-request";

import { usePortal } from "./portal-provider";

export type ProjectOption = {
  value: string;
  label: string;
};

export type OpenRequestHandle = { canClose: () => boolean };

export function OpenRequestForm({
  defaultProjectId,
  projectOptions,
  onClose,
  ref,
}: {
  defaultProjectId: string;
  projectOptions: ProjectOption[];
  onClose: () => void;
  ref?: Ref<OpenRequestHandle>;
}) {
  const portal = useTranslations("Portal");
  const workspace = useTranslations("Workspace");
  const bugs = useTranslations("Bugs");
  const help = useTranslations("HelpRequests");
  const features = useTranslations("Features");
  const feedback = useTranslations("Feedback");
  const copy = useBugCopy();
  const [more, { toggle: toggleMore, open: openMore }] = useDisclosure(false);
  const [files, setFiles] = useState<BugUploadFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const { createBug, createHelp, createFeature, createFeedback } = usePortal();
  const mounted = useMounted();
  const required = portal("required");
  const [created, setCreated] = useState<CreatedOpenRequest | null>(null);
  const [bugError, setBugError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [featureError, setFeatureError] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);
  const validateBug = (value: string, limit: number, requiredField = true) => {
    const issue = validateBugText(value, limit, requiredField);
    return issue === "required"
      ? required
      : issue === "tooLong"
        ? bugs("tooLong", { limit })
        : null;
  };
  const validateFeedback = (
    value: string,
    limit: number,
    field: "titleTooLong" | "observationTooLong",
  ) => {
    const issue = validateFeedbackText(value, limit);
    return issue === "required"
      ? required
      : issue === "tooLong"
        ? feedback(field, { limit })
        : null;
  };
  const validateFeature = (value: string, limit: number) => {
    const issue = validateFeatureText(value, limit);
    return issue === "required"
      ? required
      : issue === "tooLong"
        ? features("tooLong", { limit })
        : null;
  };
  const stagedPreviews = useRef<BugUploadFile[]>([]);
  useEffect(
    () => () => {
      stagedPreviews.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    },
    [],
  );
  const form = useForm<OpenRequestValues>({
    initialValues: {
      projectId: defaultProjectId,
      kind: "bug",
      title: "",
      happened: "",
      steps: "",
      reproduction: "known",
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
        values.kind === "bug"
          ? validateBug(value, bugTextLimits.title)
          : values.kind === "feature"
            ? validateFeature(value, FEATURE_TITLE_MAX_LENGTH)
            : values.kind === "feedback"
              ? validateFeedback(
                  value,
                  FEEDBACK_TITLE_MAX_LENGTH,
                  "titleTooLong",
                )
              : openRequestUsesTitle(values.kind) && !value.trim()
                ? required
                : null,
      happened: (value, values) =>
        values.kind === "bug"
          ? validateBug(value, bugTextLimits.happened)
          : null,
      steps: (value, values) =>
        values.kind === "bug" && values.reproduction === "known"
          ? validateBug(value, bugTextLimits.steps)
          : null,
      expected: (value, values) =>
        values.kind === "bug"
          ? validateBug(value, bugTextLimits.expected)
          : null,
      environment: (value, values) =>
        values.kind === "bug"
          ? validateBug(value, bugTextLimits.environment, false)
          : null,
      correlationId: (value, values) =>
        values.kind === "bug"
          ? validateBug(value, bugTextLimits.correlationId, false)
          : null,
      impactDetail: (value, values) =>
        values.kind === "bug"
          ? validateBug(value, bugTextLimits.impactDetail, false)
          : null,
      pageUrl: (value, values) =>
        values.kind === "bug"
          ? validateBug(value, bugTextLimits.pageUrl, false) ||
            (value.trim() && !isPageUrl(value.trim())
              ? bugs("pageUrlInvalid")
              : null)
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
        values.kind === "feature"
          ? validateFeature(value, FEATURE_TEXT_MAX_LENGTH)
          : null,
      outcome: (value, values) =>
        values.kind === "feature"
          ? validateFeature(value, FEATURE_TEXT_MAX_LENGTH)
          : null,
      observation: (value, values) =>
        values.kind === "feedback"
          ? validateFeedback(
              value,
              FEEDBACK_TEXT_MAX_LENGTH,
              "observationTooLong",
            )
          : null,
    },
  });

  const dirty = !created && (form.isDirty() || files.length > 0);
  useUnsavedDraft(dirty, portal("discardDraft"));
  useImperativeHandle(
    ref,
    () => ({
      canClose: () => !dirty || window.confirm(portal("discardDraft")),
    }),
    [dirty, portal],
  );

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
      ref={formRef}
      noValidate
      onSubmit={(event) =>
        form.onSubmit(
          (values) => {
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
            if (record) {
              stagedPreviews.current = [];
              setCreated(record);
            } else if (values.kind === "bug") {
              setBugError(true);
            } else if (values.kind === "feature") {
              setFeatureError(true);
            } else if (values.kind === "feedback") {
              setFeedbackError(true);
            }
          },
          (errors) => {
            if (errors.correlationId || errors.impactDetail) openMore();
            setTimeout(
              () =>
                formRef.current
                  ?.querySelector<HTMLElement>("[aria-invalid=true]")
                  ?.focus(),
              100,
            );
          },
        )(event)
      }
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
            <SimilarBugReports
              projectId={form.values.projectId}
              title={form.values.title}
            />
            <Textarea
              label={bugs("happened")}
              required
              minRows={2}
              {...form.getInputProps("happened")}
            />
            <Checkbox
              label={bugs("stepsUnknown")}
              checked={form.values.reproduction === "unknown"}
              onChange={(event) => {
                form.setFieldValue(
                  "reproduction",
                  event.currentTarget.checked ? "unknown" : "known",
                );
                form.clearFieldError("steps");
              }}
            />
            {form.values.reproduction === "known" ? (
              <Textarea
                label={bugs("steps")}
                required
                minRows={2}
                {...form.getInputProps("steps")}
              />
            ) : null}
            <Textarea
              label={bugs("expected")}
              required
              minRows={2}
              {...form.getInputProps("expected")}
            />
            <TextInput
              label={bugs("environment")}
              placeholder={bugs("environmentPlaceholder")}
              {...form.getInputProps("environment")}
            />
            <TextInput
              label={bugs("pageUrl")}
              type="url"
              inputMode="url"
              placeholder="https://"
              {...form.getInputProps("pageUrl")}
            />
            <BugUpload
              files={files}
              error={fileError}
              onChange={(next, issue) => {
                stagedPreviews.current = next;
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
            {bugError ? (
              <Text c="red" role="alert">
                {bugs("createFailed")}
              </Text>
            ) : null}
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
            <SimilarFeatureRequests
              projectId={form.values.projectId}
              title={form.values.title}
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
            {featureError ? (
              <Text c="red" role="alert">
                {features("createFailed")}
              </Text>
            ) : null}
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
            {feedbackError ? (
              <Text c="red" role="alert">
                {feedback("createFailed")}
              </Text>
            ) : null}
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
