"use client";

import { Anchor, Badge, Box, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type {
  SessionKind,
  SessionRow,
} from "@/modules/portal/lib/session-rows";

import { getApplication } from "../lib/applications";

const kindKeys = {
  bug: "bugReports",
  help: "help",
  feature: "featureRequests",
  feedback: "feedback",
  guide: "guides",
  discussion: "discussions",
} as const satisfies Record<SessionKind, string>;

const statusKeys = {
  Open: "statusOpen",
  "In progress": "statusInProgress",
  Resolved: "statusResolved",
  Answered: "statusAnswered",
  Submitted: "statusSubmitted",
  Accepted: "statusAccepted",
  Declined: "statusDeclined",
  New: "statusNew",
  Reviewed: "statusReviewed",
} as const;

export function SessionRecordList({ rows }: { rows: SessionRow[] }) {
  const t = useTranslations("Workspace");
  const portal = useTranslations("Portal");
  const bugs = useTranslations("Bugs");
  return (
    <Stack component="ul" gap={0} p={0} m={0} style={{ listStyle: "none" }}>
      {rows.map((row) => (
        <Box
          component="li"
          key={row.href}
          p="sm"
          style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        >
          <Group
            justify="space-between"
            align="flex-start"
            wrap="wrap"
            gap="xs"
          >
            <Stack gap={2} style={{ minWidth: 0, flex: "1 1 220px" }}>
              <Anchor
                component={Link}
                href={row.href}
                fw={600}
                size="sm"
                style={{ overflowWrap: "anywhere" }}
              >
                {row.title}
              </Anchor>
              <Text size="xs" c="dimmed">
                {getApplication(row.projectId)?.name} · {t(kindKeys[row.kind])}{" "}
                · {row.id}
              </Text>
            </Stack>
            {"status" in row && (
              <Badge variant="light">
                {row.status === "Waiting for reporter"
                  ? bugs("statusWaiting")
                  : portal(statusKeys[row.status])}
              </Badge>
            )}
          </Group>
        </Box>
      ))}
    </Stack>
  );
}
