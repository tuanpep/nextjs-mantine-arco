"use client";

import { Anchor, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export type DestinationUnavailableProps = {
  title?: string;
  description?: string;
  backHref: string;
  backLabel: string;
};

export function DestinationUnavailable({
  title = "This destination is not available",
  description = "It may not exist or you may not have access.",
  backHref,
  backLabel,
}: DestinationUnavailableProps) {
  return (
    <Stack align="flex-start" py="xl">
      <Title order={1}>{title}</Title>
      <Text c="dimmed">{description}</Text>
      <Anchor component={Link} href={backHref}>
        {backLabel}
      </Anchor>
    </Stack>
  );
}
