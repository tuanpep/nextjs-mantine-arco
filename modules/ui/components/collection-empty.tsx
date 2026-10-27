"use client";

import { Box, Button, Stack, ThemeIcon, Title } from "@mantine/core";
import type { ReactNode } from "react";

export type CollectionEmptyProps = {
  icon: ReactNode;
  title: string;
  actionLabel: string;
  onAction: () => void;
};

export function CollectionEmpty({
  icon,
  title,
  actionLabel,
  onAction,
}: CollectionEmptyProps) {
  return (
    <Box p="xl">
      <Stack align="center">
        <ThemeIcon size="xl" variant="light">
          {icon}
        </ThemeIcon>
        <Title order={2} size="h3">
          {title}
        </Title>
        <Button variant="light" onClick={onAction}>
          {actionLabel}
        </Button>
      </Stack>
    </Box>
  );
}
