"use client";

import { Accordion, Alert, Button, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMounted } from "@mantine/hooks";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

import { DetailsFormFields } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import {
  ideaOptionalFields,
  ideaRequiredFields,
} from "../lib/idea-intake-fields";

export function IdeasForm({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const router = useRouter();
  const application = getApplication(projectId);
  const [notice, setNotice] = useState("");
  const form = useForm({
    initialValues: {
      title: "",
      problem: "",
      outcome: "",
      suggestedChange: "",
      sponsorCandidate: "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Enter a short title."),
      problem: (value) =>
        value.trim() ? null : "Describe the problem in plain language.",
      outcome: (value) =>
        value.trim() ? null : "Describe the desired outcome.",
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
          title="Suggest an idea"
          breadcrumbs={[
            { title: "Ideas", href: `/projects/${projectId}/ideas` },
            { title: "New idea" },
          ]}
        />
      }
    >
      <Stack gap="md">
        <Alert color="blue" title="Not a delivery commitment">
          Sending an idea does not put work on a plan.
        </Alert>
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <form
          onSubmit={form.onSubmit(() => {
            setNotice("IDE-DEMO saved. Your vote was counted once.");
            router.push(`/projects/${projectId}/ideas`);
          })}
        >
          <Stack gap="md">
            <DetailsFormFields
              fields={ideaRequiredFields}
              disabled={!mounted}
              getInputProps={(key) => form.getInputProps(key)}
            />
            <Accordion variant="contained">
              <Accordion.Item value="optional">
                <Accordion.Control>Optional details</Accordion.Control>
                <Accordion.Panel>
                  <DetailsFormFields
                    fields={ideaOptionalFields}
                    disabled={!mounted}
                    getInputProps={(key) => form.getInputProps(key)}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Group justify="flex-end">
              <Button type="submit" disabled={!mounted}>
                Send idea
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </PageFrame>
  );
}
