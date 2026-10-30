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
  supportStatusLabels,
  type SupportRequest,
  type SupportStatus,
} from "../lib/fixtures";
import { priorityColor, priorityLabels, type Priority } from "../lib/priority";

export const supportBasePath = `/projects/${supportProjectId}/support`;

export function supportPath(applicationId: string | null) {
  return projectSupportPath(applicationId ?? DEFAULT_PROJECT_ID);
}

export function SupportUnavailable() {
  return (
    <Stack align="flex-start" py="xl">
      <Title order={1}>Không thể truy cập hỗ trợ</Title>
      <Text c="dimmed">
        Không thể truy cập nội dung này. Nội dung có thể không tồn tại hoặc bạn
        không có quyền truy cập.
      </Text>
      <Anchor component={Link} href={projectSupportPath(DEFAULT_PROJECT_ID)}>
        Quay lại hỗ trợ
      </Anchor>
    </Stack>
  );
}

export function SupportStatusBadge({ status }: { status: SupportStatus }) {
  return (
    <Badge variant="light" color={supportStatusColor[status]}>
      {supportStatusLabels[status]}
    </Badge>
  );
}

export function SupportPriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="light" color={priorityColor[priority]}>
      {priorityLabels[priority]}
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
      label: "Chờ bạn phản hồi",
      waitingOnYou: true,
      detail: item.nextAction,
    };
  }
  if (item.status === "Unclaimed") {
    return {
      label: "Chưa tiếp nhận",
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
