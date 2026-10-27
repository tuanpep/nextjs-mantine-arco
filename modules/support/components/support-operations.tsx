"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Alert,
  Anchor,
  Button,
  Group,
  NativeSelect,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { type SupportRequest } from "../lib/fixtures";
import { filterSupport, type HandlerAction } from "../lib/support-state";
import { SupportStatusBadge, supportPath } from "./support-common";
import { useSupport } from "./support-provider";

export function SupportOperations() {
  const { requests } = useSupport();
  const [status, setStatus] = useState("open");
  const visible =
    status === "open"
      ? requests.filter((item) => item.status !== "Resolved")
      : filterSupport(requests, "", "all");
  const [selectedId, setSelectedId] = useState("");
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0];
  return (
    <Stack>
      <Title order={1}>Production issue queue</Title>
      <Alert title="Simulated staff workspace">
        Anyone can use these demo controls. No authentication, permission
        enforcement, notifications, or real fixes are provided. Changes reset on
        reload.
      </Alert>
      <NativeSelect
        label="Show issues"
        value={status}
        onChange={(event) => setStatus(event.currentTarget.value)}
        data={[
          { value: "open", label: "Open issues" },
          { value: "all", label: "All issues" },
        ]}
      />
      {!visible.length ? (
        <Text>No open issues. Choose All issues to review completed work.</Text>
      ) : (
        <>
          <NativeSelect
            label="Select issue"
            value={selected?.id ?? ""}
            onChange={(event) => setSelectedId(event.currentTarget.value)}
            data={visible.map((item) => ({
              value: item.id,
              label: `${item.summary} (${item.id})`,
            }))}
          />
          {selected && (
            <IssueControls
              key={`${selected.id}-${selected.status}-${selected.handler}`}
              item={selected}
            />
          )}
        </>
      )}
    </Stack>
  );
}

function IssueControls({ item }: { item: SupportRequest }) {
  const { handle } = useSupport();
  const [handler, setHandler] = useState(item.handler ?? "");
  const [action, setAction] = useState("update");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [work, setWork] = useState("");
  const [limitations, setLimitations] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function apply(command: HandlerAction) {
    try {
      handle(item.id, command);
      setError("");
      setText("");
      setNotice("Staff action recorded in this demo.");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not update issue.",
      );
    }
  }
  return (
    <Paper withBorder p="lg">
      <Stack>
        <Group justify="space-between">
          <Title order={2} size="h3">
            {item.summary}
          </Title>
          <SupportStatusBadge status={item.status} />
        </Group>
        <Text>{item.situation}</Text>
        <Text size="sm">Impact: {item.impact || "Not provided"}</Text>
        <Text size="sm">Handler: {item.handler ?? "Unclaimed"}</Text>
        <Text size="sm">Responsible team: {item.responsibleTeam}</Text>
        <Text size="sm">Next action: {item.nextAction}</Text>
        <Anchor component={Link} href={`${supportPath(item.applicationId)}/${item.id}`}>
          View employee conversation and outcome
        </Anchor>
        {item.conversation.map((message, index) => (
          <Text
            key={index}
            size="sm"
            style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
          >
            <strong>{message.author}:</strong> {message.text}
          </Text>
        ))}
        {error && (
          <Alert color="red" role="alert">
            {error}
          </Alert>
        )}
        {notice && (
          <Alert color="green" role="status">
            {notice}
          </Alert>
        )}
        {item.status === "Resolved" ? (
          <Text>
            This issue is resolved. The employee can reopen it from its detail
            page.
          </Text>
        ) : (
          <>
            <NativeSelect
              label="Issue handler"
              value={handler}
              onChange={(event) => setHandler(event.currentTarget.value)}
              data={[
                { value: "", label: "Choose a handler" },
                "Mai Tran",
                "Sam Rivera",
              ]}
            />
            <Button onClick={() => apply({ kind: "assign", handler })}>
              Assign issue handler
            </Button>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (action === "resolve")
                  apply({
                    kind: "resolve",
                    outcome: { summary, work, limitations },
                  });
                else if (
                  action === "update" ||
                  action === "clarify" ||
                  action === "retest"
                )
                  apply({ kind: action, text });
              }}
            >
              <Stack>
                <NativeSelect
                  label="Support action"
                  value={action}
                  onChange={(event) => setAction(event.currentTarget.value)}
                  data={
                    item.status === "Handling"
                      ? [
                          { value: "update", label: "Post progress update" },
                          {
                            value: "clarify",
                            label: "Ask employee for information",
                          },
                          { value: "retest", label: "Request employee retest" },
                          { value: "resolve", label: "Record resolution" },
                        ]
                      : [{ value: "update", label: "Post progress update" }]
                  }
                />
                {action === "resolve" ? (
                  <>
                    <Textarea
                      label="Outcome summary"
                      required
                      value={summary}
                      onChange={(event) =>
                        setSummary(event.currentTarget.value)
                      }
                    />
                    <Textarea
                      label="Work done and verification"
                      required
                      value={work}
                      onChange={(event) => setWork(event.currentTarget.value)}
                    />
                    <Textarea
                      label="Limitations"
                      required
                      value={limitations}
                      onChange={(event) =>
                        setLimitations(event.currentTarget.value)
                      }
                    />
                  </>
                ) : (
                  <Textarea
                    label="Progress note or employee instructions"
                    required
                    value={text}
                    onChange={(event) => setText(event.currentTarget.value)}
                  />
                )}
                <Button type="submit" disabled={!item.handler}>
                  Record support action in demo
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Stack>
    </Paper>
  );
}
