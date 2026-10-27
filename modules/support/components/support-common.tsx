"use client";

import { Anchor, Badge, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

import {
  DEFAULT_PROJECT_ID,
  getApplication,
  projectSupportPath,
} from "@/modules/projects/lib/applications";

import {
  supportProjectId,
  supportStatusColor,
  type SupportStatus,
} from "../lib/fixtures";

export const supportBasePath = `/projects/${supportProjectId}/support`;

export function supportPath(applicationId: string | null) {
  return projectSupportPath(applicationId ?? DEFAULT_PROJECT_ID);
}

export function SupportIntro({
  title,
  applicationId = "beacon-portal",
}: {
  title: string;
  applicationId?: string | null;
}) {
  const projectName = applicationId
    ? getApplication(applicationId)?.name
    : undefined;
  return (
    <Stack gap={6}>
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          {projectName ? `${projectName} / Support` : "Support"}
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
