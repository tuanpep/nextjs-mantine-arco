"use client";

import { Avatar, Box, Group, Paper, Text, Tooltip } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { applicationPath, applications } from "../lib/applications";

export function HomeScreen() {
  return (
    <PageFrame header={<PageHeader title="Dự án" />}>
      <Paper withBorder style={{ overflow: "hidden" }}>
        <Text
          size="xs"
          c="dimmed"
          px="md"
          py="xs"
          bg="var(--mantine-color-default-hover)"
        >
          {applications.length} dự án
        </Text>
        {applications.map((application) => (
          <Box
            key={application.id}
            component={Link}
            href={applicationPath(application.id)}
            px="md"
            py="sm"
            display="block"
            c="inherit"
            td="none"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
            }}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                <Avatar color="blue" size={36}>
                  {application.initials}
                </Avatar>
                <Box style={{ minWidth: 0 }}>
                  <Tooltip label={application.name}>
                    <Text fw={600} size="sm" truncate>
                      {application.name}
                    </Text>
                  </Tooltip>
                  <Tooltip
                    label={`${application.description} - ${application.owner}`}
                    multiline
                    maw={360}
                  >
                    <Text size="xs" c="dimmed" truncate>
                      {application.description} - {application.owner}
                    </Text>
                  </Tooltip>
                </Box>
              </Group>
              <IconChevronRight size={16} color="var(--mantine-color-dimmed)" />
            </Group>
          </Box>
        ))}
      </Paper>
    </PageFrame>
  );
}
