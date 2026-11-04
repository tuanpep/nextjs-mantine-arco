"use client";

import { Anchor, Badge, Box, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import type { FeatureRequest } from "../lib/state";
import { useFeatureCopy } from "./use-feature-copy";

export function FeatureQueueRow({
  feature,
  href,
}: {
  feature: FeatureRequest;
  href: string;
}) {
  const copy = useFeatureCopy();
  return (
    <Box
      component="li"
      px="md"
      py="sm"
      style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Anchor component={Link} href={href} fw={600}>
            {feature.title}
          </Anchor>
          <Text size="xs" c="dimmed">
            {feature.id}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {feature.problem}
          </Text>
        </Stack>
        <Badge variant="light" style={{ flexShrink: 0 }}>
          {copy.status(feature.status)}
        </Badge>
      </Group>
    </Box>
  );
}
