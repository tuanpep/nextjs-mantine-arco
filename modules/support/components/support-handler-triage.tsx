"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { useState } from "react";

import {
  triageDispositionLabels,
  triageDispositions,
  type SupportRequest,
  type TriageDisposition,
} from "../lib/fixtures";
import {
  misrouteTargetLabels,
  misrouteTargets,
  type MisrouteTarget,
} from "../lib/intake-fields";
import { useSupport } from "./support-provider";

export function SupportHandlerTriage({
  item,
  onNotice,
}: {
  item: SupportRequest;
  onNotice: (message: string) => void;
}) {
  const mounted = useMounted();
  const { handle } = useSupport();
  const [disposition, setDisposition] =
    useState<TriageDisposition>("needs-info");
  const [note, setNote] = useState("");
  const [relatedId, setRelatedId] = useState("");
  const [engId, setEngId] = useState(item.engTrackerId ?? "");
  const [misrouteTarget, setMisrouteTarget] =
    useState<MisrouteTarget>("feedback");
  const [keepOpen, setKeepOpen] = useState(true);
  const [error, setError] = useState("");

  if (item.status === "Resolved") return null;

  function applyTriage() {
    setError("");
    try {
      switch (disposition) {
        case "needs-info":
          handle(item.id, { kind: "needs-info", text: note });
          onNotice("Marked needs more info. The sender has the next action.");
          break;
        case "duplicate":
          handle(item.id, {
            kind: "duplicate",
            relatedRequestId: relatedId,
            text: note,
          });
          onNotice(
            `Marked duplicate of ${relatedId.trim().toUpperCase()} and resolved.`,
          );
          break;
        case "linked-eng":
          handle(item.id, {
            kind: "link-eng",
            engTrackerId: engId,
            text: note,
          });
          onNotice(
            `Linked ${engId.trim()}. Auto-close paused while engineering work is tracked.`,
          );
          break;
        case "workaround":
          handle(item.id, {
            kind: "workaround",
            text: note,
            keepOpen,
          });
          onNotice(
            keepOpen
              ? "Workaround shared. Waiting for the sender."
              : "Resolved with workaround.",
          );
          break;
        case "misroute":
          handle(item.id, {
            kind: "misroute",
            target: misrouteTarget,
            text: note,
          });
          onNotice(
            `Redirected to ${misrouteTargetLabels[misrouteTarget]} and closed this support request.`,
          );
          break;
        default: {
          const _exhaustive: never = disposition;
          return _exhaustive;
        }
      }
      setNote("");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not apply triage.",
      );
    }
  }

  return (
    <Card withBorder p="md">
      <Stack gap="sm">
        <Title order={2} size="h3">
          Triage
        </Title>
        {!item.handler && (
          <Alert color="blue">
            Applying triage will assign Demo DX operator first.
          </Alert>
        )}
        <Select
          disabled={!mounted}
          label="Disposition"
          allowDeselect={false}
          data={triageDispositions.map((value) => ({
            value,
            label: triageDispositionLabels[value],
          }))}
          value={disposition}
          onChange={(value) => {
            if (
              value === "needs-info" ||
              value === "duplicate" ||
              value === "linked-eng" ||
              value === "workaround" ||
              value === "misroute"
            ) {
              setDisposition(value);
              setError("");
            }
          }}
        />
        {disposition === "duplicate" && (
          <TextInput
            disabled={!mounted}
            label="Related request ID"
            placeholder="SUP116"
            value={relatedId}
            onChange={(event) => setRelatedId(event.currentTarget.value)}
          />
        )}
        {disposition === "linked-eng" && (
          <TextInput
            disabled={!mounted}
            label="Engineering tracker ID"
            placeholder="DEMO-4821"
            value={engId}
            onChange={(event) => setEngId(event.currentTarget.value)}
          />
        )}
        {disposition === "misroute" && (
          <Select
            disabled={!mounted}
            label="Send sender to"
            allowDeselect={false}
            data={misrouteTargets.map((value) => ({
              value,
              label: misrouteTargetLabels[value],
            }))}
            value={misrouteTarget}
            onChange={(value) => {
              if (
                value === "feedback" ||
                value === "ideas" ||
                value === "uat"
              ) {
                setMisrouteTarget(value);
              }
            }}
          />
        )}
        {disposition === "workaround" && (
          <Checkbox
            disabled={!mounted}
            label="Keep open and wait for the sender"
            checked={keepOpen}
            onChange={(event) => setKeepOpen(event.currentTarget.checked)}
          />
        )}
        <Textarea
          disabled={!mounted}
          label={
            disposition === "needs-info"
              ? "What do you still need from the sender?"
              : disposition === "workaround"
                ? "Workaround instructions"
                : "Note for the conversation"
          }
          required
          rows={3}
          value={note}
          error={error}
          onChange={(event) => {
            setNote(event.currentTarget.value);
            setError("");
          }}
        />
        <Group>
          <Button disabled={!mounted} onClick={applyTriage}>
            Apply
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
