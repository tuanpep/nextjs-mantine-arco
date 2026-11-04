"use client";

import { Anchor, Badge, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePortal } from "@/modules/portal/components/portal-provider";
import { findSimilarBugs } from "../lib/similar";
import { useBugCopy } from "./use-bug-copy";

export function SimilarBugReports({
  projectId,
  title,
}: {
  projectId: string;
  title: string;
}) {
  const { bugs } = usePortal();
  const t = useTranslations("Bugs");
  const copy = useBugCopy();
  const matches = findSimilarBugs(bugs, projectId, title);
  if (!matches.length) return null;
  return (
    <Stack component="section" aria-label={t("relatedReports")} gap="xs">
      <Text fw={600} size="sm">
        {t("relatedReports")}
      </Text>
      {matches.map((item) => (
        <Group key={item.id} justify="space-between" align="flex-start">
          <Anchor
            component={Link}
            href={`/projects/${projectId}/support/bugs/${item.id}`}
            style={{ overflowWrap: "anywhere" }}
          >
            {item.title} · {item.id}
          </Anchor>
          <Badge variant="light">{copy.status(item.status)}</Badge>
        </Group>
      ))}
    </Stack>
  );
}
