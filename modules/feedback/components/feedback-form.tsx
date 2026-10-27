"use client";

import { Alert, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import { DetailsFormFields } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

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
      <PageFrame>
        <DestinationUnavailable backHref="/" backLabel="Back to projects" />
      </PageFrame>
    );
  }

  return (
    <PageFrame
      header={
        <PageHeader
          title="Share feedback"
          breadcrumbs={[
            { title: "Feedback", href: `/projects/${projectId}/feedback` },
            { title: "New feedback" },
          ]}
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue" title="No product promise">
          Recording feedback does not commit a change.
        </Alert>
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <form
          onSubmit={form.onSubmit(() => {
            setNotice(
              "Feedback FB-DEMO saved. Lan Vo is the next actor for review.",
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
                Send feedback
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </PageFrame>
  );
}
