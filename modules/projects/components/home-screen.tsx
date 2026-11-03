"use client";

import {
  Anchor,
  Avatar,
  Box,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import {
  sessionRows,
  type SessionKind,
} from "@/modules/portal/lib/session-rows";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { applicationPath, applications } from "../lib/applications";

export function HomeScreen() {
  const t = useTranslations("Workspace");
  const portal = usePortal();
  const groups = applications
    .map((project) => ({
      project,
      rows: sessionRows(project.id, {
        bugs: portal.bugs,
        help: portal.help.map((item) => ({
          id: item.id,
          projectId: item.projectId,
          title: item.question,
        })),
        features: portal.features,
        feedback: portal.feedback,
        guides: portal.guides,
        discussions: portal.discussions,
      }),
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <PageFrame header={<PageHeader title={t("projects")} />}>
      <Stack gap="xl">
        <Paper withBorder style={{ overflow: "hidden" }}>
          <Text
            size="xs"
            c="dimmed"
            px="md"
            py="xs"
            bg="var(--mantine-color-default-hover)"
          >
            {t("projectCount", { count: applications.length })}
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
                <IconChevronRight
                  size={16}
                  color="var(--mantine-color-dimmed)"
                />
              </Group>
            </Box>
          ))}
        </Paper>
        <Stack gap="md">
          <Title order={2} size="h4">
            {t("thisSession")}
          </Title>
          {groups.map((group) => (
            <Stack key={group.project.id} gap={4}>
              <Text size="sm" fw={600}>
                {group.project.name}
              </Text>
              {group.rows.map((row) => (
                <Anchor key={row.id} component={Link} href={row.href} size="sm">
                  {row.title}
                  <Text span c="dimmed">
                    {" "}
                    · {kindLabel(row.kind, t)}
                  </Text>
                </Anchor>
              ))}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </PageFrame>
  );
}

function kindLabel(
  kind: SessionKind,
  t: ReturnType<typeof useTranslations<"Workspace">>,
) {
  switch (kind) {
    case "bug":
      return t("bugReports");
    case "help":
      return t("help");
    case "feature":
      return t("featureRequests");
    case "feedback":
      return t("feedback");
    case "guide":
      return t("guides");
    case "discussion":
      return t("discussions");
    default: {
      const neverKind: never = kind;
      return neverKind;
    }
  }
}
