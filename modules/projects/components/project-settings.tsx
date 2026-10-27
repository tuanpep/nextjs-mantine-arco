"use client";

import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useState } from "react";

import { getApplication } from "../lib/applications";

export function ProjectSettings({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const application = getApplication(projectId);
  const [owner, setOwner] = useState(application?.owner ?? "");
  const [supportHandler, setSupportHandler] = useState("Minh Pham");
  const [feedbackReviewer, setFeedbackReviewer] = useState("Lan Vo");
  const [ideaReviewer, setIdeaReviewer] = useState("Lan Vo");
  const [uatCoordinator, setUatCoordinator] = useState("Hoa Nguyen");
  const [notice, setNotice] = useState("");

  if (!application) {
    return (
      <Alert color="red" title="This destination is not available">
        It may not be available to your account.
      </Alert>
    );
  }

  const gaps = [
    !owner.trim() && "Accountable owner is missing",
    !supportHandler.trim() && "Default support handler is missing",
    !feedbackReviewer.trim() && "Feedback reviewer is missing",
    !ideaReviewer.trim() && "Idea reviewer is missing",
    !uatCoordinator.trim() && "UAT coordinator is missing",
  ].filter(Boolean) as string[];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1} size="h2">
            Project settings
          </Title>
          <Text size="sm" c="dimmed">
            {application.name} · Naming people here is not an access grant.
          </Text>
        </div>
        <Badge variant="light" color="gray">
          Manager demo
        </Badge>
      </Group>
      <Alert color="blue" title="Demo only">
        Saved names do not grant access, assign duties, or archive work.
      </Alert>
      {notice && (
        <Alert role="status" color="teal" title="Local change confirmed">
          {notice}
        </Alert>
      )}
      <Card withBorder p="md" radius="sm">
        <Stack gap="md">
          <Title order={2} size="h3">
            Identity
          </Title>
          <TextInput label="Project name" value={application.name} disabled />
          <TextInput
            disabled={!mounted}
            label="Accountable owner"
            description="A typed name is not an approved access grant."
            value={owner}
            onChange={(event) => setOwner(event.currentTarget.value)}
          />
        </Stack>
      </Card>
      <Card withBorder p="md" radius="sm">
        <Stack gap="md">
          <Title order={2} size="h3">
            Default responsibilities
          </Title>
          <TextInput
            disabled={!mounted}
            label="Support handler"
            value={supportHandler}
            onChange={(event) => setSupportHandler(event.currentTarget.value)}
          />
          <TextInput
            disabled={!mounted}
            label="Feedback reviewer"
            value={feedbackReviewer}
            onChange={(event) => setFeedbackReviewer(event.currentTarget.value)}
          />
          <TextInput
            disabled={!mounted}
            label="Idea reviewer"
            value={ideaReviewer}
            onChange={(event) => setIdeaReviewer(event.currentTarget.value)}
          />
          <TextInput
            disabled={!mounted}
            label="UAT coordinator"
            value={uatCoordinator}
            onChange={(event) => setUatCoordinator(event.currentTarget.value)}
          />
          <Button
            style={{ alignSelf: "flex-start" }}
            disabled={!mounted}
            onClick={() =>
              setNotice(
                "Names saved in this demo only. No access or duty was granted.",
              )
            }
          >
            Save names in demo
          </Button>
        </Stack>
      </Card>
      <Card withBorder p="md" radius="sm">
        <Stack gap="sm">
          <Title order={2} size="h3">
            Still missing
          </Title>
          {gaps.length === 0 ? (
            <Text size="sm">No gaps listed for this demo setup.</Text>
          ) : (
            gaps.map((gap) => (
              <Text key={gap} size="sm">
                · {gap}
              </Text>
            ))
          )}
        </Stack>
      </Card>
      <Card withBorder p="md" radius="sm">
        <Stack gap="sm">
          <Title order={2} size="h3">
            Archive this project
          </Title>
          <Text size="sm">
            Archive stays blocked until an owner decides what happens to open
            tickets, feedback, and campaigns.
          </Text>
          <Button disabled>Archive unavailable</Button>
        </Stack>
      </Card>
    </Stack>
  );
}
