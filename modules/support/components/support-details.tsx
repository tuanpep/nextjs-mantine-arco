"use client";

import {
  Alert,
  Anchor,
  Avatar,
  Button,
  Card,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconMessageCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useMounted } from "@mantine/hooks";

import { type SupportRequest } from "../lib/fixtures";
import { getApplication } from "@/modules/projects/lib/applications";
import {
  SupportIntro,
  SupportStatusBadge,
  SupportUnavailable,
  supportPath,
} from "./support-common";
import { useSupport } from "./support-provider";

export function SupportDetails({
  projectId,
  supportId,
}: {
  projectId?: string;
  supportId: string;
}) {
  const { requests } = useSupport();
  if (projectId && !getApplication(projectId)) return <SupportUnavailable />;
  const item = requests.find((request) => request.id === supportId && (projectId ? request.applicationId === projectId : request.applicationId === null));
  if (!item) return <SupportUnavailable />;
  return <SupportDetailContent key={item.id} item={item} />;
}

function SupportDetailContent({ item }: { item: SupportRequest }) {
  const mounted = useMounted();
  const { respond } = useSupport();
  const [text, setText] = useState("");
  const [result, setResult] = useState<"Pass" | "Fail" | "Unable">("Pass");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const actionTitle =
    item.status === "Waiting for retest"
      ? "Report your retest result"
      : item.status === "Resolved"
        ? "Need to reopen this request?"
        : item.status === "Waiting for sender"
          ? "Reply to the team"
          : "Add an update";

  function submitResponse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !text.trim() &&
      (item.status !== "Waiting for retest" || result !== "Pass")
    ) {
      setError(
        item.status === "Resolved"
          ? "Explain why you need to reopen this request."
          : "Add a note before confirming.",
      );
      return;
    }
    if (item.status === "Resolved") {
      respond(item.id, { kind: "reopen", text });
      setNotice(
        `Reopened in this demo. The prior official outcome is retained below. ${item.handler} will review your reason.`,
      );
    } else if (item.status === "Waiting for retest") {
      respond(item.id, { kind: "retest", result, text });
      setNotice(
        "Retest result recorded in this demo. The handler has the next action. This does not resolve the request or approve UAT.",
      );
    } else if (item.status === "Waiting for sender") {
      respond(item.id, { kind: "reply", text });
      setNotice(
        "Reply added in this demo. The handler has the next action. Your reply is not a resolution.",
      );
    } else {
      respond(item.id, { kind: "comment", text });
      setNotice(
        "Update added in this demo. The current responsibility has not changed.",
      );
    }
    setText("");
    setError("");
  }

  return (
    <Stack gap="md">
      <Anchor component={Link} href={supportPath(item.applicationId)}>
        <Group gap={6}>
          <IconArrowLeft size={16} />
          All support requests
        </Group>
      </Anchor>
      <SupportIntro title={item.summary} applicationId={item.applicationId} />
      <Text size="sm" c="dimmed">
        {item.id} · Submitted by {item.sender}
      </Text>
      <Card withBorder p="md" radius="sm">
        <Stack>
          <Group justify="space-between">
            <Title order={2} size="h3">
              Current responsibility
            </Title>
            <SupportStatusBadge status={item.status} />
          </Group>
          <Group gap="xl" align="flex-start">
            <div>
              <Text size="sm" c="dimmed">
                Responsible team
              </Text>
              <Text fw={600}>{item.responsibleTeam}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Individual handler
              </Text>
              <Text fw={600}>{item.handler ?? "Unclaimed"}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Next actor
              </Text>
              <Text fw={600}>{item.nextActor}</Text>
            </div>
          </Group>
          <div>
            <Text size="sm" fw={600}>
              Next action
            </Text>
            <Text size="sm">{item.nextAction}</Text>
          </div>
        </Stack>
      </Card>
      {notice && (
        <Alert role="status" color="teal" title="Local change confirmed">
          {notice}
        </Alert>
      )}
      <Stack gap="md">
        <Card withBorder p="md" radius="sm">
          <Stack gap="md">
            <Title order={2} size="h3">
              Initial context
            </Title>
            {[
              ["Situation", item.situation],
              ["Expected behavior", item.expected],
              ["Impact", item.impact],
              ["Version or environment", item.environment],
            ].map(([label, value]) => (
              <div key={label}>
                <Text fw={600} size="sm">
                  {label}
                </Text>
                <Text
                  size="sm"
                  style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                >
                  {value?.trim() || "Not provided"}
                </Text>
              </div>
            ))}
          </Stack>
        </Card>
        <Card withBorder p="md" radius="sm">
          <Stack>
            <Title order={2} size="h3">
              Official outcome
            </Title>
            {item.outcomes.length === 0 ? (
              <Text c="dimmed" size="sm">
                No official outcome recorded.
              </Text>
            ) : (
              item.outcomes.map((outcome, index) => (
                <Stack key={index} gap="sm">
                  <Text fw={600}>
                    {outcome.superseded
                      ? "Prior outcome · superseded on reopening"
                      : "Current official outcome"}
                  </Text>
                  <Text>{outcome.summary}</Text>
                  <div>
                    <Text size="sm" fw={600}>
                      What was done
                    </Text>
                    <Text size="sm">{outcome.work}</Text>
                  </div>
                  <div>
                    <Text size="sm" fw={600}>
                      Limitations
                    </Text>
                    <Text size="sm">{outcome.limitations}</Text>
                  </div>
                </Stack>
              ))
            )}
          </Stack>
        </Card>
        <Card withBorder p="md" radius="sm">
          <Stack>
            <Group>
              <IconMessageCircle size={20} />
              <Title order={2} size="h3">
                Conversation
              </Title>
            </Group>
            {item.conversation.length === 0 ? (
              <Text c="dimmed">No replies yet.</Text>
            ) : (
              item.conversation.map((message, index) => (
                <Stack key={index} gap="xs">
                  <Divider />
                  <Group gap="sm">
                    <Avatar
                      size="sm"
                      radius="xl"
                      color={message.author === "Jo Lee" ? "blue" : "teal"}
                    >
                      {message.author
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </Avatar>
                    <Text size="sm" fw={600}>
                      {message.author}
                    </Text>
                  </Group>
                  <Text
                    size="sm"
                    style={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {message.text}
                  </Text>
                </Stack>
              ))
            )}
          </Stack>
        </Card>
        <Anchor component={Link} href="/operations">
          Open DX operations demo
        </Anchor>
        {
          <Card withBorder p="md" radius="sm">
            <form onSubmit={submitResponse}>
              <Stack>
                <Title order={2} size="h3">
                  {actionTitle}
                </Title>
                {item.status === "Waiting for retest" && (
                  <Select
                    label="Retest result"
                    allowDeselect={false}
                    data={["Pass", "Fail", "Unable"]}
                    value={result}
                    onChange={(value) => {
                      if (
                        value === "Pass" ||
                        value === "Fail" ||
                        value === "Unable"
                      )
                        setResult(value);
                    }}
                  />
                )}
                <Textarea
                  disabled={!mounted}
                  label={
                    item.status === "Resolved"
                      ? "Reason for reopening"
                      : item.status === "Waiting for retest"
                        ? "Retest note"
                        : item.status === "Waiting for sender"
                          ? "Your reply"
                          : "Your update"
                  }
                  required={
                    item.status !== "Waiting for retest" || result !== "Pass"
                  }
                  rows={3}
                  value={text}
                  onChange={(event) => {
                    setText(event.currentTarget.value);
                    setError("");
                  }}
                  error={error}
                />
                <Button type="submit" style={{ alignSelf: "flex-start" }}>
                  {item.status === "Resolved"
                    ? "Confirm reopening in demo"
                    : item.status === "Waiting for retest"
                      ? "Confirm retest result in demo"
                      : item.status === "Waiting for sender"
                        ? "Send reply in demo"
                        : "Add update in demo"}
                </Button>
              </Stack>
            </form>
          </Card>
        }
      </Stack>
    </Stack>
  );
}
