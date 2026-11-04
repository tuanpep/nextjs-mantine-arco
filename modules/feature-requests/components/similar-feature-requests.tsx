"use client";

import { Anchor, Badge, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";

import { findSimilarFeatures } from "../lib/similar";
import { useFeatureCopy } from "./use-feature-copy";

export function SimilarFeatureRequests({
  projectId,
  title,
}: {
  projectId: string;
  title: string;
}) {
  const { features } = usePortal();
  const t = useTranslations("Features");
  const copy = useFeatureCopy();
  const matches = findSimilarFeatures(features, projectId, title);
  if (!matches.length) return null;

  return (
    <Stack component="section" aria-label={t("similar")} gap="xs">
      <Text fw={600} size="sm">
        {t("similar")}
      </Text>
      <Text size="xs" c="dimmed">
        {t("newTabLimitation")}
      </Text>
      {matches.map((item) => (
        <Group key={item.id} justify="space-between" align="flex-start">
          <Anchor
            component={Link}
            href={`/projects/${projectId}/ideas/features/${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.title} · {item.id} · {t("newTab")}
          </Anchor>
          <Badge variant="light">{copy.status(item.status)}</Badge>
        </Group>
      ))}
    </Stack>
  );
}
