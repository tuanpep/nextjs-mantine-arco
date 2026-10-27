"use client";

import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { DetailsReadout } from "@/lib/form-details";
import { getApplication } from "@/modules/projects/lib/applications";

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
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="dimmed">
            {item.id} · {application.name}
          </Text>
          <Title order={1} size="h2">
            {item.title}
          </Title>
        </div>
        <Badge variant="light" color="gray">
          {disposition}
        </Badge>
      </Group>
      {notice && (
        <Alert role="status" color="teal" title="Local change confirmed">
          {notice}
        </Alert>
      )}
      <Card withBorder p="md" radius="sm">
        <DetailsReadout
          rows={feedbackReadoutRows({
            observation: item.observation,
            context: item.context,
            nextActor: item.nextActor,
          })}
        />
      </Card>
      <Card withBorder p="md" radius="sm">
        <Stack gap="md">
          <Title order={2} size="h3">
            Reviewer disposition
          </Title>
          <Text size="sm" c="dimmed">
            Acknowledgement is not a promise to change the product. There is no
            convert action.
          </Text>
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
            onClick={() =>
              setNotice(
                `Disposition recorded as ${disposition} in this demo. No product change was promised.`,
              )
            }
          >
            Record disposition in demo
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}
