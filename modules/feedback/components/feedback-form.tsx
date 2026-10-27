"use client";

import {
  Alert,
  Anchor,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import { DetailsFormFields } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";

import { feedbackIntakeFields } from "../lib/intake-fields";

export function FeedbackForm({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const router = useRouter();
  const application = getApplication(projectId);
  const [notice, setNotice] = useState("");
  const form = useForm({
    initialValues: {
      title: "",
      observation: "",
      context: "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Enter a short title."),
      observation: (value) =>
        value.trim() ? null : "Describe what you observed.",
    },
  });

  if (!application) {
    return (
      <Alert color="red" title="This destination is not available">
        It may not be available to your account.
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <Anchor component={Link} href={`/projects/${projectId}/feedback`}>
        <Group gap={6}>
          <IconArrowLeft size={16} />
          All feedback
        </Group>
      </Anchor>
      <div>
        <Title order={1} size="h2">
          Share feedback
        </Title>
        <Text size="sm" c="dimmed">
          {application.name} · An observation is not a support ticket or an
          idea.
        </Text>
      </div>
      <Alert color="blue" title="No product promise">
        Recording feedback does not commit a change. There is no convert action
        in this release.
      </Alert>
      {notice && (
        <Alert role="status" color="teal" title="Saved in this demo">
          {notice}
        </Alert>
      )}
      <Card withBorder p="md" radius="sm">
        <form
          onSubmit={form.onSubmit(() => {
            setNotice(
              "Feedback FB-DEMO saved in this browser session only. Lan Vo is the next actor for review.",
            );
            router.push(`/projects/${projectId}/feedback`);
          })}
        >
          <Stack gap="md">
            <DetailsFormFields
              fields={feedbackIntakeFields}
              disabled={!mounted}
              getInputProps={(key) => form.getInputProps(key)}
            />
            <Group justify="flex-end">
              <Button type="submit" disabled={!mounted}>
                Send feedback in demo
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
