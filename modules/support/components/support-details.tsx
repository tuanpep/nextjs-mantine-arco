"use client";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useMounted } from "@mantine/hooks";

import { DetailsReadout } from "@/lib/form-details";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { triageDispositionLabels, type SupportRequest } from "../lib/fixtures";
import { intakeReadoutRows, misrouteTargetLabels } from "../lib/intake-fields";
import { priorities, type Priority } from "../lib/priority";
import { requestTypeLabels } from "../lib/request-catalog";
import { getApplication } from "@/modules/projects/lib/applications";
import {
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
  if (projectId && !getApplication(projectId)) {
    return (
      <PageFrame>
        <SupportUnavailable />
      </PageFrame>
    );
  }
  const item = requests.find(
    (request) =>
      request.id === supportId &&
      (!projectId || request.applicationId === projectId),
  );
  if (!item) {
    return (
      <PageFrame>
        <SupportUnavailable />
      </PageFrame>
    );
  }
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
        `Reopened. The prior official outcome is retained below. ${item.handler} will review your reason.`,
      );
    } else if (item.status === "Waiting for retest") {
      respond(item.id, { kind: "retest", result, text });
      setNotice(
        "Retest result recorded. The handler has the next action. This does not resolve the request or approve UAT.",
      );
    } else if (item.status === "Waiting for sender") {
      respond(item.id, { kind: "reply", text });
      setNotice(
        "Reply added. The handler has the next action. Your reply is not a resolution.",
      );
    } else {
      respond(item.id, { kind: "comment", text });
      setNotice("Update added. The current responsibility has not changed.");
    }
    setText("");
    setError("");
  }

  const metadataPane = (
    <Stack gap="lg">
      <Stack gap="sm">
        <SupportStatusBadge status={item.status} />
        <Group gap="xs">
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
      </Stack>
      <Divider />
      <Stack gap="sm">
        <Title order={2} size="h4">
          Current responsibility
        </Title>
        <div>
          <Text size="sm" c="dimmed">
            Responsible team
          </Text>
          <Text fw={600} size="sm">
            {item.responsibleTeam}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            Individual handler
          </Text>
          <Text fw={600} size="sm">
            {item.handler ?? "Unclaimed"}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            Next actor
          </Text>
          <Text fw={600} size="sm">
            {item.nextActor}
          </Text>
        </div>
        {item.engTrackerId && (
          <div>
            <Text size="sm" c="dimmed">
              Engineering tracker
            </Text>
            <Text fw={600} size="sm">
              {item.engTrackerId}
            </Text>
          </div>
        )}
        {item.relatedRequestId && (
          <div>
            <Text size="sm" c="dimmed">
              Related request
            </Text>
            <Text fw={600} size="sm">
              {item.relatedRequestId}
            </Text>
          </div>
        )}
        {item.misrouteTarget && (
          <div>
            <Text size="sm" c="dimmed">
              Redirected to
            </Text>
            <Text fw={600} size="sm">
              {misrouteTargetLabels[item.misrouteTarget]}
            </Text>
          </div>
        )}
        <div>
          <Text size="sm" fw={600}>
            Next action
          </Text>
          <Text size="sm">{item.nextAction}</Text>
        </div>
        {item.status !== "Resolved" && (
          <Select
            disabled={!mounted}
            label="Adjust priority"
            data={priorities.map((value) => ({ value, label: value }))}
            value={item.priority}
            allowDeselect={false}
            onChange={(value) => {
              if (!value) return;
              handle(item.id, {
                kind: "set-priority",
                priority: value as Priority,
              });
              setNotice(`Priority set to ${value}.`);
            }}
          />
        )}
      </Stack>
    </Stack>
  );

  return (
    <PageFrame
      pane={metadataPane}
      paneLabel="Request details"
      paneNarrow="sheet"
      header={
        <PageHeader
          title={item.summary}
          description={`${item.id} · Submitted by ${item.sender}`}
          breadcrumbs={[
            { title: "Support", href: supportPath(item.applicationId) },
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
        <SupportHandlerTriage item={item} onNotice={setNotice} />
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
        {item.status === "Resolved" && (
          <>
            <Divider />
            <Stack gap="sm">
              <Title order={2} size="h3">
                Rating
              </Title>
              {item.csat === null ? (
                <Group>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      variant="light"
                      disabled={!mounted}
                      onClick={() => {
                        respond(item.id, { kind: "csat", score });
                        setNotice(`Thanks. Score ${score} saved.`);
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
          </>
        )}
        <Divider />
        <Stack gap="sm">
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
        <Divider />
        <Stack gap="sm">
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
        <Divider />
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
                ? "Reopen"
                : item.status === "Waiting for retest"
                  ? "Confirm retest"
                  : item.status === "Waiting for sender"
                    ? "Send reply"
                    : "Add update"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </PageFrame>
  );
}
