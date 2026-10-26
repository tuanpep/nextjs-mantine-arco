"use client";

import { Badge, NavLink, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

import { statusColor, type Issue } from "../lib/fixtures";

export function IssueListScreen({ issues }: { issues: Issue[] }) {
  return (
    <Stack gap="md">
      <Title order={1}>Issues</Title>
      {issues.length === 0 ? (
        <Text c="dimmed">No matching issues</Text>
      ) : (
        issues.map((issue) => (
          <NavLink
            key={issue.id}
            component={Link}
            href={`/issues/${issue.id}`}
            label={issue.title}
            description={`${issue.id} · ${issue.project}`}
            variant="subtle"
            rightSection={
              <Badge variant="light" color={statusColor[issue.status]}>
                {issue.status}
              </Badge>
            }
          />
        ))
      )}
    </Stack>
  );
}
