"use client";

import {
  Alert,
  Anchor,
  Avatar,
  Badge,
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

import { DetailsReadout } from "@/lib/form-details";
import {
  triageDispositionLabels,
  type SupportRequest,
} from "../lib/fixtures";
import {
  intakeReadoutRows,
  misrouteTargetLabels,
} from "../lib/intake-fields";
import { priorities, type Priority } from "../lib/priority";
import { requestTypeLabels } from "../lib/request-catalog";
import { getApplication } from "@/modules/projects/lib/applications";
import {
  SupportIntro,
  SupportStatusBadge,
  SupportUnavailable,
  supportPath,
} from "./support-common";
import { SupportHandlerTriage } from "./support-handler-triage";
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
  const item = requests.find(
    (request) =>
      request.id === supportId &&
      (!projectId || request.applicationId === projectId),
  );
  if (!item) return <SupportUnavailable />;
  return <SupportDetailContent key={item.id} item={item} />;
}

function SupportDetailContent({ item }: { item: SupportRequest }) {
  const mounted = useMounted();
  const { respond, handle } = useSupport();
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
      <Group gap="sm">
        <Text size="sm" c="dimmed">
          {item.id} · Submitted by {item.sender}
        </Text>
        <Badge variant="light">{requestTypeLabels[item.requestType]}</Badge>
        <Badge variant="light" color="grape">
          Priority {item.priority}
        </Badge>
        {item.lastDisposition && (
          <Badge variant="outline">
            {triageDispositionLabels[item.lastDisposition]}
          </Badge>
        )}
        {item.autoClosePaused && (
          <Badge variant="outline" color="orange">
            Auto-close paused
          </Badge>
        )}
      </Group>
      <Text size="xs" c="dimmed">
        Priority comes from impact and urgency. Submitters do not pick it.
        Handlers may adjust it. Linked engineering work pauses demo auto-close.
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
            <div>
              <Text size="sm" c="dimmed">
                Priority
              </Text>
              <Text fw={600}>{item.priority}</Text>
            </div>
            {item.engTrackerId && (
              <div>
                <Text size="sm" c="dimmed">
                  Engineering tracker
                </Text>
                <Text fw={600}>{item.engTrackerId}</Text>
              </div>
            )}
            {item.relatedRequestId && (
              <div>
                <Text size="sm" c="dimmed">
                  Related request
                </Text>
                <Text fw={600}>{item.relatedRequestId}</Text>
              </div>
            )}
            {item.misrouteTarget && (
              <div>
                <Text size="sm" c="dimmed">
                  Redirected to
                </Text>
                <Text fw={600}>
                  {misrouteTargetLabels[item.misrouteTarget]}
                </Text>
              </div>
            )}
          </Group>
          <div>
            <Text size="sm" fw={600}>
              Next action
            </Text>
            <Text size="sm">{item.nextAction}</Text>
          </div>
          {item.status !== "Resolved" && (
            <Select
              disabled={!mounted}
              label="Demo handler: adjust priority"
              description="Visible to the requester as read-only priority above."
              data={priorities.map((value) => ({ value, label: value }))}
              value={item.priority}
              allowDeselect={false}
              onChange={(value) => {
                if (!value) return;
                handle(item.id, {
                  kind: "set-priority",
                  priority: value as Priority,
                });
                setNotice(`Priority set to ${value} in this demo.`);
              }}
            />
          )}
        </Stack>
      </Card>
      {notice && (
        <Alert role="status" color="teal" title="Local change confirmed">
          {notice}
        </Alert>
      )}
      <SupportHandlerTriage item={item} onNotice={setNotice} />
      <Stack gap="md">
        <Card withBorder p="md" radius="sm">
          <Stack gap="md">
            <Title order={2} size="h3">
              Initial context
            </Title>
            <DetailsReadout rows={intakeReadoutRows(item)} />
            <div>
              <Text fw={600} size="sm">
                Evidence
              </Text>
              {item.attachments.length === 0 ? (
                <Text size="sm" c="dimmed">
                  None attached
                </Text>
              ) : (
                item.attachments.map((file) => (
                  <Text key={file.id} size="sm">
                    {file.name} · {file.sizeLabel} · {file.status}
                    {file.status !== "Ready" ? " · not downloadable" : ""}
                  </Text>
                ))
              )}
            </div>
          </Stack>
        </Card>
        {item.status === "Resolved" && (
          <Card withBorder p="md" radius="sm">
            <Stack gap="sm">
              <Title order={2} size="h3">
                How was the help you received?
              </Title>
              <Text size="sm" c="dimmed">
                Optional. A low score does not reopen the ticket or create a new
                one.
              </Text>
              {item.csat === null ? (
                <Group>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      variant="light"
                      disabled={!mounted}
                      onClick={() => {
                        respond(item.id, { kind: "csat", score });
                        setNotice(
                          `Thanks. Score ${score} saved in this demo only.`,
                        );
                      }}
                    >
                      {score}
                    </Button>
                  ))}
                </Group>
              ) : (
                <Text size="sm">You rated this {item.csat} out of 5.</Text>
              )}
            </Stack>
          </Card>
        )}
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
