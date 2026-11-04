"use client";

import { Anchor, Badge, Box, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { bugSearchMatch } from "../lib/queue";
import type { BugReport } from "../lib/state";
import { useBugCopy } from "./use-bug-copy";

export function BugQueueRow({
  bug,
  href,
  query,
}: {
  bug: BugReport;
  href: string;
  query: string;
}) {
  const t = useTranslations("Bugs");
  const portal = useTranslations("Portal");
  const copy = useBugCopy();
  const match = bugSearchMatch(bug, query);
  const matchLabel = match
    ? {
        happened: t("happened"),
        expected: t("expected"),
        steps: t("steps"),
        environment: t("environment"),
        correlationId: t("correlation"),
        impactDetail: t("impactDetail"),
        pageUrl: t("pageUrl"),
        message: t("message"),
        note: portal("note"),
      }[match.field]
    : null;
  return (
    <Box
      component="li"
      p="md"
      style={{
        borderBottom: "1px solid var(--mantine-color-default-border)",
        overflowWrap: "anywhere",
      }}
    >
      <Group justify="space-between" align="flex-start" gap="xs">
        <Anchor component={Link} href={href} fw={600}>
          {bug.title}
        </Anchor>
        <Group gap="xs">
          <Badge
            variant="light"
            color={
              bug.severity === "Critical"
                ? "red"
                : bug.severity === "High"
                  ? "orange"
                  : "gray"
            }
          >
            {copy.severity(bug.severity)}
          </Badge>
          <Badge variant="outline" color="gray">
            {copy.status(bug.status)}
          </Badge>
        </Group>
      </Group>
      <Stack gap={4} mt={4}>
        <Text size="xs" c="dimmed">
          {bug.id}
          {bug.environment ? ` · ${bug.environment}` : ""}
        </Text>
        <Text size="sm" c="dimmed" lineClamp={2}>
          {match ? `${matchLabel}: ${match.text}` : bug.happened}
        </Text>
      </Stack>
    </Box>
  );
}
