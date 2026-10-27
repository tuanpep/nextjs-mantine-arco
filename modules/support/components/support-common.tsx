"use client";

import { Anchor, Badge, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

import {
  DEFAULT_PROJECT_ID,
  projectSupportPath,
} from "@/modules/projects/lib/applications";

import {
  supportProjectId,
  supportStatusColor,
  type SupportRequest,
  type SupportStatus,
} from "../lib/fixtures";
import { priorityColor, type Priority } from "../lib/priority";

export const supportBasePath = `/projects/${supportProjectId}/support`;

export function supportPath(applicationId: string | null) {
  return projectSupportPath(applicationId ?? DEFAULT_PROJECT_ID);
}

export function SupportUnavailable() {
  return (
    <Stack align="flex-start" py="xl">
      <Title order={1}>Support unavailable</Title>
      <Text c="dimmed">
        This destination is not available. It may not exist or you may not have
        access.
      </Text>
      <Anchor component={Link} href={projectSupportPath(DEFAULT_PROJECT_ID)}>
        Back to Support
      </Anchor>
    </Stack>
  );
}

export function SupportStatusBadge({ status }: { status: SupportStatus }) {
  return (
    <Badge variant="light" color={supportStatusColor[status]}>
      {status}
    </Badge>
  );
}

export function SupportPriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="light" color={priorityColor[priority]}>
      {priority}
    </Badge>
  );
}

/** One-line ownership signal for collection scanning. */
export function supportAttention(item: SupportRequest): {
  label: string;
  waitingOnYou: boolean;
  detail: string | null;
} {
  if (item.nextActor === "Sender") {
    return {
      label: "Waiting on you",
      waitingOnYou: true,
      detail: item.nextAction,
    };
  }
  if (item.status === "Unclaimed") {
    return {
      label: "Unclaimed",
      waitingOnYou: false,
      detail: null,
    };
  }
  if (item.handler) {
    return {
      label: item.handler,
      waitingOnYou: false,
      detail: null,
    };
  }
  return {
    label: item.responsibleTeam,
    waitingOnYou: false,
    detail: null,
  };
}
