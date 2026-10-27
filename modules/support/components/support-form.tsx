"use client";

import {
  Anchor,
  Alert,
  Button,
  Card,
  Group,
  NativeSelect,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { type SupportContext } from "../lib/fixtures";
import {
  applications,
  getApplication,
} from "@/modules/projects/lib/applications";
import {
  SupportIntro,
  SupportUnavailable,
  supportPath,
} from "./support-common";
import { useSupport } from "./support-provider";

export function SupportForm({ projectId }: { projectId?: string }) {
  const mounted = useMounted();
  const { create } = useSupport();
  const [step, setStep] = useState<"write" | "review" | "created">("write");
  const [createdId, setCreatedId] = useState("");
  const [applicationId, setApplicationId] = useState(projectId ?? "");
  const application = getApplication(applicationId);
  const basePath = supportPath(applicationId || null);
  const form = useForm<SupportContext>({
    initialValues: {
      summary: "",
      situation: "",
      expected: "",
      impact: "",
      environment: "",
    },
    validate: {
      summary: (value) => (value.trim() ? null : "Enter a brief summary."),
      situation: (value) =>
        value.trim()
          ? null
          : "Describe what you were trying to do and what happened.",
    },
  });
  if (projectId && !getApplication(projectId)) return <SupportUnavailable />;

  return (
    <Stack gap="md">
      <Anchor component={Link} href={projectId ? basePath : "/support"}>
        <Group gap={6}>
          <IconArrowLeft size={16} />
          All support requests
        </Group>
      </Anchor>
      <SupportIntro title="Ask for support" applicationId={projectId ?? null} />
      <Alert color="blue" title="Production support">
        Describe the symptom, even if you do not know its cause. Check{" "}
        <Anchor component={Link} href="/status">
          known issues
        </Anchor>{" "}
        first. For pre-release testing, use{" "}
        <Anchor component={Link} href="/uat">
          UAT campaigns
        </Anchor>
        . Do not include passwords or confidential data.
      </Alert>
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
              Responsible team: {application?.owner ?? "DX triage"} · Handler:
              Unclaimed
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
              Application: {application?.name ?? "Not sure, route to DX triage"}{" "}
              · Sender: Jo Lee
            </Text>
            {[
              ["Summary", form.values.summary],
              ["Situation", form.values.situation],
              ["Expected behavior", form.values.expected],
              ["Impact", form.values.impact],
              ["Version or environment", form.values.environment],
            ].map(([label, value]) => (
              <div key={label}>
                <Text fw={600} size="sm">
                  {label}
                </Text>
                <Text
                  style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                >
                  {value?.trim() || "Not provided"}
                </Text>
              </div>
            ))}
            <Group justify="space-between">
              <Button variant="default" onClick={() => setStep("write")}>
                Back to edit
              </Button>
              <Button
                onClick={() => {
                  setCreatedId(create(form.values, applicationId || null));
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
                Submitting as Jo Lee ·{" "}
                {application?.name ?? "Application not identified"}
              </Text>
              {!projectId && (
                <NativeSelect
                  label="Affected application"
                  description="If you are not sure, DX triage will help identify the responsible team."
                  value={applicationId}
                  onChange={(event) =>
                    setApplicationId(event.currentTarget.value)
                  }
                  data={[
                    { value: "", label: "I'm not sure" },
                    ...applications.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })),
                  ]}
                />
              )}
              <TextInput
                disabled={!mounted}
                label="Brief summary"
                required
                {...form.getInputProps("summary")}
              />
              <Textarea
                disabled={!mounted}
                label="Situation"
                required
                rows={4}
                {...form.getInputProps("situation")}
              />
              <Textarea
                disabled={!mounted}
                label="Expected behavior"
                rows={2}
                {...form.getInputProps("expected")}
              />
              <Textarea
                disabled={!mounted}
                label="Impact"
                description="Which work is blocked, how many people are affected, and is there a deadline or workaround?"
                rows={2}
                {...form.getInputProps("impact")}
              />
              <TextInput
                disabled={!mounted}
                label="Version or environment"
                description="For example: production, browser version, and when the issue occurred. Report UAT defects in the UAT area."
                {...form.getInputProps("environment")}
              />
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
