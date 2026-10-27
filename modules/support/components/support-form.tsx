"use client";

import {
  Anchor,
  Alert,
  Badge,
  Button,
  Card,
  FileButton,
  Group,
  Select,
  Stack,
  Stepper,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { IconArrowLeft, IconCheck, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DetailsFormFields, DetailsReadout } from "@/lib/form-details";
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
  intakeReadoutRows,
  intakeTemplate,
  validateIntake,
} from "../lib/intake-fields";
import { calculatePriority } from "../lib/priority";
import {
  parseRequestType,
  requestTypeLabels,
  type RequestType,
} from "../lib/request-catalog";
import { getApplication } from "@/modules/projects/lib/applications";
import {
  SupportIntro,
  SupportUnavailable,
  supportPath,
} from "./support-common";
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

  if (!application) return <SupportUnavailable />;

  const copy = intakeCopy(form.values.requestType);
  const template = intakeTemplate(form.values.requestType);
  const suggestedPriority = calculatePriority(
    form.values.impactScope,
    form.values.urgency,
  );
  const title = requestTypeLabels[form.values.requestType];
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
      value: `${suggestedPriority} (you do not pick this)`,
    },
    {
      label: "Evidence",
      value: attachments.map((file) => `${file.name} · ${file.status}`).join("\n"),
    },
  ];

  return (
    <Stack gap="md">
      <Anchor component={Link} href={basePath}>
        <Group gap={6}>
          <IconArrowLeft size={16} />
          All support requests
        </Group>
      </Anchor>
      <SupportIntro title={title} applicationId={projectId} />
      <Alert color="blue" title="Ask for help">
        {copy.hint} You do not set priority—handlers use impact and urgency.
        Sending a request does not grant access or fulfill the ask. Do not
        include passwords or confidential data.
      </Alert>
      {form.values.requestType === "access" && (
        <Alert color="orange" title="Access is not granted here">
          This request does not change accounts or permissions. An approved
          access path is still required after the ticket is recorded.
        </Alert>
      )}
      {form.values.requestType === "general" && (
        <Alert color="gray" title="Wrong place?">
          Product wishes go to{" "}
          <Anchor component={Link} href={`/projects/${projectId}/ideas`}>
            Ideas
          </Anchor>
          . Praise or friction without a broken flow goes to{" "}
          <Anchor component={Link} href={`/projects/${projectId}/feedback`}>
            Feedback
          </Anchor>
          . Pre-release defects go to{" "}
          <Anchor component={Link} href={`/projects/${projectId}/uat`}>
            UAT campaigns
          </Anchor>
          .
        </Alert>
      )}
      <Stepper
        active={step === "write" ? 0 : step === "review" ? 1 : 2}
        size="sm"
      >
        <Stepper.Step label="Describe" />
        <Stepper.Step label="Review" />
        <Stepper.Step label="Created in demo" />
      </Stepper>
      {step === "created" ? (
        <Card withBorder p="md" radius="sm">
          <Stack>
            <Group>
              <IconCheck size={24} />
              <Title order={2}>Request created in this demo</Title>
            </Group>
            <Text size="sm">
              Responsible team: {application.owner} · Handler: Unclaimed ·
              Priority: {suggestedPriority} (from impact and urgency)
            </Text>
            <Button component={Link} href={`${basePath}/${createdId}`}>
              View request
            </Button>
          </Stack>
        </Card>
      ) : step === "review" ? (
        <Card withBorder p="md" radius="sm">
          <Stack gap="lg">
            <div>
              <Title order={2}>Review your request</Title>
            </div>
            <Text size="sm">
              Project: {application.name} · Sender: Jo Lee · Type:{" "}
              {requestTypeLabels[form.values.requestType]}
            </Text>
            <DetailsReadout rows={reviewRows} />
            <Text size="sm" c="dimmed">
              Sending does not grant access or promise a fix. Priority will be
              set from impact and urgency.
            </Text>
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
                Confirm creation in demo
              </Button>
            </Group>
          </Stack>
        </Card>
      ) : (
        <Card withBorder p="md" radius="sm">
          <form onSubmit={form.onSubmit(() => setStep("review"))}>
            <Stack gap="md">
              <Text size="sm" fw={500}>
                Submitting as Jo Lee · {application.name}
              </Text>
              <Group gap="xs">
                <Text size="sm" fw={600}>
                  Request type
                </Text>
                <Badge variant="light">{title}</Badge>
                <Button
                  component={Link}
                  href={basePath}
                  variant="subtle"
                  size="compact-sm"
                >
                  Change type
                </Button>
              </Group>
              <Select
                disabled={!mounted}
                label="Or switch type here"
                data={(
                  Object.entries(requestTypeLabels) as [RequestType, string][]
                ).map(([value, label]) => ({ value, label }))}
                value={form.values.requestType}
                allowDeselect={false}
                onChange={(value) =>
                  setRequestType(parseRequestType(value))
                }
              />
              <DetailsFormFields
                fields={template.fields}
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
                    <Text size="sm" mt="xs">
                      Suggested priority for handlers:{" "}
                      <Text span fw={600}>
                        {suggestedPriority}
                      </Text>
                    </Text>
                  ) : null
                }
              />
              <Stack gap="xs">
                <Text size="sm" fw={600}>
                  Evidence (optional)
                </Text>
                <Text size="xs" c="dimmed">
                  {evidencePolicy}
                </Text>
                <FileButton
                  disabled={!mounted || attachments.length >= 5}
                  multiple
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={(files) => addFiles(files)}
                >
                  {(props) => (
                    <Button {...props} variant="light" disabled={!mounted}>
                      Choose files
                    </Button>
                  )}
                </FileButton>
                {attachments.map((file) => (
                  <Group key={file.id} justify="space-between">
                    <Text size="sm">
                      {file.name} · {file.sizeLabel} · {file.status}
                    </Text>
                    <Button
                      variant="subtle"
                      color="red"
                      size="compact-sm"
                      leftSection={<IconTrash size={14} />}
                      onClick={() =>
                        setAttachments((current) =>
                          current.filter((item) => item.id !== file.id),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </Group>
                ))}
              </Stack>
              <Group justify="flex-end">
                <Button type="submit" disabled={!mounted}>
                  Review request
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      )}
    </Stack>
  );
}
