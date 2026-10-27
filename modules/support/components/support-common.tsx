"use client";

import { Anchor, Badge, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { getApplication } from "@/modules/projects/lib/applications";

import {
  supportProjectId,
  supportStatusColor,
  type SupportStatus,
} from "../lib/fixtures";

export const supportBasePath = `/projects/${supportProjectId}/support`;
export function supportPath(applicationId: string | null) {
  return applicationId === null ? "/support" : `/projects/${applicationId}/support`;
}

export function SupportIntro({ title, applicationId = "beacon-portal" }: { title: string; applicationId?: string | null }) {
  return (
    <Stack gap={6}>
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          {applicationId ? `Applications / ${getApplication(applicationId)?.name} / Support` : "Digital services / Support"}
        </Text>
        <Badge variant="light" color="gray">
          Support
        </Badge>
      </Group>
      <Title order={1} size="h2">
        {title}
      </Title>
    </Stack>
  );
}

export function SupportUnavailable() {
  return (
    <Stack align="flex-start" py="xl">
      <Title order={1}>Support unavailable</Title>
      <Text c="dimmed">
        This destination is not available. It may not exist or you may not have
        access.
      </Text>
      <Anchor component={Link} href="/projects">
        Back to projects
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
