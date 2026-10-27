"use client";

import {
  Accordion,
  ActionIcon,
  Alert,
  Anchor,
  Button,
  FileButton,
  Group,
  Select,
  Stack,
  Stepper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { IconCheck, IconPaperclip, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DetailsFormFields, DetailsReadout } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import {
  advanceEvidenceStatus,
  evidencePolicy,
  formatFileSize,
  validateEvidenceFile,
  type EvidenceAttachment,
} from "../lib/attachments";
import { type SupportContext } from "../lib/fixtures";
import {
  intakeCopy,
  intakeFormSections,
  intakeHint,
  intakeReadoutRows,
  validateIntake,
} from "../lib/intake-fields";
import { calculatePriority } from "../lib/priority";
import {
  parseRequestType,
  requestTypeLabels,
  type RequestType,
} from "../lib/request-catalog";
import { SupportUnavailable, supportPath } from "./support-common";
import { useSupport } from "./support-provider";

export function SupportForm({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const { create } = useSupport();
  const [step, setStep] = useState<"write" | "review" | "created">("write");
  const [createdId, setCreatedId] = useState("");
  const [attachments, setAttachments] = useState<EvidenceAttachment[]>([]);
  const application = getApplication(projectId);
  const basePath = supportPath(projectId);
  const initialType = parseRequestType(searchParams.get("type"));
  const form = useForm<Omit<SupportContext, "attachments">>({
    initialValues: {
      summary: "",
      situation: "",
      expected: "",
      impact: "",
      environment: "",
      reproSteps: "",
      correlationId: "",
      requestType: initialType,
      impactScope: "",
      urgency: "",
    },
    validate: (values) => validateIntake(values),
  });

  useEffect(() => {
    form.setFieldValue("requestType", initialType);
    // Intentionally sync catalog deep-link only when the query type changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form identity is stable enough for this demo sync
  }, [initialType]);

  if (!application) {
    return (
      <PageFrame>
        <SupportUnavailable />
      </PageFrame>
    );
  }

  const copy = intakeCopy(form.values.requestType);
  const sections = intakeFormSections(form.values.requestType);
  const suggestedPriority = calculatePriority(
    form.values.impactScope,
    form.values.urgency,
  );
  const title = requestTypeLabels[form.values.requestType];
  const hint = intakeHint(form.values.requestType);
  const contextValues = (): SupportContext => ({
    ...form.values,
    expected: copy.expectedVisible ? form.values.expected : "",
    reproSteps: copy.reproVisible ? form.values.reproSteps : "",
    correlationId: copy.correlationVisible ? form.values.correlationId : "",
    attachments,
  });

  function bumpAttachment(id: string) {
    setAttachments((current) =>
      current.map((file) =>
        file.id === id
          ? { ...file, status: advanceEvidenceStatus(file.status) }
          : file,
      ),
    );
  }

  function addFiles(files: File[]) {
    setAttachments((current) => {
      const room = 5 - current.length;
      if (room <= 0) return current;
      const next: EvidenceAttachment[] = [];
      for (const file of files.slice(0, room)) {
        const error = validateEvidenceFile(file);
        const attachment: EvidenceAttachment = {
          id: crypto.randomUUID(),
          name: file.name,
          sizeLabel: formatFileSize(file.size),
          status: error ? "Rejected" : "Selected",
        };
        next.push(attachment);
        if (!error) {
          window.setTimeout(() => bumpAttachment(attachment.id), 400);
          window.setTimeout(() => bumpAttachment(attachment.id), 900);
          window.setTimeout(() => bumpAttachment(attachment.id), 1400);
        }
      }
      return [...current, ...next];
    });
  }

  function setRequestType(type: RequestType) {
    form.setFieldValue("requestType", type);
    form.clearErrors();
  }

  const reviewRows = [
    ...intakeReadoutRows(form.values, { includeSummary: true }),
    {
      label: "Suggested priority",
      value: suggestedPriority,
    },
    {
      label: "Evidence",
      value:
        attachments.length === 0
          ? "None"
          : attachments
              .map((file) => `${file.name} · ${file.status}`)
              .join("\n"),
    },
  ];

  return (
    <PageFrame
      header={
        <PageHeader
          title={title}
          description={`${application.name} · ${hint}`}
          breadcrumbs={[
            { title: "Support", href: basePath },
            { title: "New request" },
          ]}
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue">
          Do not include passwords or confidential data.
        </Alert>
        {form.values.requestType === "access" && (
          <Alert color="orange">
            Sending does not grant access. An approved access path is still
            required.
          </Alert>
        )}
        {form.values.requestType === "general" && (
          <Accordion variant="contained">
            <Accordion.Item value="wrong-place">
              <Accordion.Control>Wrong place?</Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">
                  Product wishes go to{" "}
                  <Anchor
                    component={Link}
                    href={`/projects/${projectId}/ideas`}
                  >
                    Ideas
                  </Anchor>
                  . Praise or friction without a broken flow goes to{" "}
                  <Anchor
                    component={Link}
                    href={`/projects/${projectId}/feedback`}
                  >
                    Feedback
                  </Anchor>
                  . Pre-release defects go to{" "}
                  <Anchor component={Link} href={`/projects/${projectId}/uat`}>
                    UAT
                  </Anchor>
                  .
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
        <Stepper
          active={step === "write" ? 0 : step === "review" ? 1 : 2}
          size="sm"
        >
          <Stepper.Step label="Describe" />
          <Stepper.Step label="Review" />
          <Stepper.Step label="Done" />
        </Stepper>
        {step === "created" ? (
          <Stack gap="md">
            <Group>
              <IconCheck size={24} aria-hidden />
              <Title order={2}>Request created</Title>
            </Group>
            <Text size="sm">
              Responsible team: {application.owner} · Handler: Unclaimed ·
              Priority: {suggestedPriority}
            </Text>
            <Button
              component={Link}
              href={`${basePath}/${createdId}`}
              style={{ alignSelf: "flex-start" }}
            >
              View request
            </Button>
          </Stack>
        ) : step === "review" ? (
          <Stack gap="lg">
            <Title order={2}>Review your request</Title>
            <Text size="sm" c="dimmed">
              Project: {application.name} · Sender: Jo Lee · Type:{" "}
              {requestTypeLabels[form.values.requestType]}
            </Text>
            <DetailsReadout rows={reviewRows} />
            <Group justify="space-between">
              <Button variant="default" onClick={() => setStep("write")}>
                Back to edit
              </Button>
              <Button
                onClick={() => {
                  setCreatedId(create(contextValues(), projectId));
                  setStep("created");
                }}
              >
                Confirm creation
              </Button>
            </Group>
          </Stack>
        ) : (
          <form onSubmit={form.onSubmit(() => setStep("review"))}>
            <Stack gap="md">
              <Select
                disabled={!mounted}
                label="Type"
                data={(
                  Object.entries(requestTypeLabels) as [RequestType, string][]
                ).map(([value, label]) => ({ value, label }))}
                value={form.values.requestType}
                allowDeselect={false}
                onChange={(value) => setRequestType(parseRequestType(value))}
              />
              <DetailsFormFields
                fields={sections.primary}
                disabled={!mounted}
                getInputProps={(key) => form.getInputProps(key)}
                getSelectValue={(key) => {
                  const value = form.values[key];
                  return typeof value === "string" && value ? value : null;
                }}
                onSelectChange={(key, value) =>
                  form.setFieldValue(key, value as SupportContext[typeof key])
                }
                afterField={(key) =>
                  key === "urgency" ? (
                    <Text size="sm" mt="xs" c="dimmed">
                      Suggested priority:{" "}
                      <Text span fw={600} c="var(--mantine-color-text)">
                        {suggestedPriority}
                      </Text>
                    </Text>
                  ) : null
                }
              />
              <Accordion variant="contained" multiple defaultValue={[]}>
                <Accordion.Item value="optional">
                  <Accordion.Control>
                    Optional details
                    {attachments.length > 0
                      ? ` · ${attachments.length} file${attachments.length === 1 ? "" : "s"}`
                      : ""}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      {sections.optional.length > 0 ? (
                        <DetailsFormFields
                          fields={sections.optional}
                          disabled={!mounted}
                          getInputProps={(key) => form.getInputProps(key)}
                          getSelectValue={(key) => {
                            const value = form.values[key];
                            return typeof value === "string" && value
                              ? value
                              : null;
                          }}
                          onSelectChange={(key, value) =>
                            form.setFieldValue(
                              key,
                              value as SupportContext[typeof key],
                            )
                          }
                        />
                      ) : null}
                      <Stack gap="xs">
                        <Text size="sm" fw={600}>
                          Evidence
                        </Text>
                        <Group gap="xs">
                          <FileButton
                            disabled={!mounted || attachments.length >= 5}
                            multiple
                            accept="image/png,image/jpeg,application/pdf"
                            onChange={(files) => addFiles(files)}
                          >
                            {(props) => (
                              <Tooltip label={evidencePolicy}>
                                <Button
                                  {...props}
                                  variant="light"
                                  disabled={!mounted}
                                  leftSection={
                                    <IconPaperclip size={16} aria-hidden />
                                  }
                                >
                                  Choose files
                                </Button>
                              </Tooltip>
                            )}
                          </FileButton>
                        </Group>
                        {attachments.map((file) => (
                          <Group key={file.id} justify="space-between">
                            <Text size="sm">
                              {file.name} · {file.sizeLabel} · {file.status}
                            </Text>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label={`Remove ${file.name}`}
                              onClick={() =>
                                setAttachments((current) =>
                                  current.filter((item) => item.id !== file.id),
                                )
                              }
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        ))}
                      </Stack>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              <Group justify="flex-end">
                <Button type="submit" disabled={!mounted}>
                  Review request
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Stack>
    </PageFrame>
  );
}
