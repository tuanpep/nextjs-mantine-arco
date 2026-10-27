"use client";

import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useState } from "react";

import { DetailsReadout } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { feedbackItems, type FeedbackDisposition } from "../lib/fixtures";
import { feedbackReadoutRows } from "../lib/intake-fields";

export function FeedbackDetails({
  projectId,
  feedbackId,
}: {
  projectId: string;
  feedbackId: string;
}) {
  const mounted = useMounted();
  const application = getApplication(projectId);
  const item = feedbackItems.find(
    (entry) => entry.id === feedbackId && entry.projectId === projectId,
  );
  const [disposition, setDisposition] = useState<FeedbackDisposition>(
    item?.disposition ?? "Not reviewed",
  );
  const [reason, setReason] = useState(item?.reason ?? "");
  const [notice, setNotice] = useState("");

  if (!application || !item) {
    return (
      <PageFrame>
        <DestinationUnavailable
          backHref={`/projects/${projectId}/feedback`}
          backLabel="Back to Feedback"
        />
      </PageFrame>
    );
  }

  const metadataPane = (
    <Stack gap="sm">
      <Badge variant="light" color="gray" style={{ alignSelf: "flex-start" }}>
        {disposition}
      </Badge>
      <Text size="sm">Next actor: {item.nextActor}</Text>
    </Stack>
  );

  return (
    <PageFrame
      pane={metadataPane}
      paneLabel="Feedback details"
      paneNarrow="sheet"
      header={
        <PageHeader
          title={item.title}
          description={`${item.id} · ${application.name}`}
          breadcrumbs={[
            { title: "Feedback", href: `/projects/${projectId}/feedback` },
            { title: item.id },
          ]}
        />
      }
    >
      <Stack gap="lg">
        {notice && (
          <Alert role="status" color="teal">
            {notice}
          </Alert>
        )}
        <DetailsReadout
          rows={feedbackReadoutRows({
            observation: item.observation,
            context: item.context,
            nextActor: item.nextActor,
          })}
        />
        <Divider />
        <Stack gap="md">
          <Title order={2} size="h3">
            Reviewer disposition
          </Title>
          <Alert color="blue">
            Acknowledgement is not a promise to change the product.
          </Alert>
          <Group gap="sm">
            {(
              [
                "Acknowledged",
                "Needs clarification",
                "Noted",
              ] as FeedbackDisposition[]
            ).map((value) => (
              <Button
                key={value}
                size="xs"
                variant={disposition === value ? "filled" : "default"}
                disabled={!mounted}
                onClick={() => setDisposition(value)}
              >
                {value}
              </Button>
            ))}
          </Group>
          <Textarea
            disabled={!mounted}
            label="Reason the sender can read"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.currentTarget.value)}
          />
          <Button
            style={{ alignSelf: "flex-start" }}
            disabled={!mounted || !reason.trim()}
            onClick={() => setNotice(`Disposition recorded as ${disposition}.`)}
          >
            Record disposition
          </Button>
        </Stack>
      </Stack>
    </PageFrame>
  );
}
