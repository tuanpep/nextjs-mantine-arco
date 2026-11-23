"use client";

import { Card, Stack, Title } from "@mantine/core";
import type { ReactNode } from "react";

import { useCustomPreviews } from "./component-book-custom";
import { useMantinePreviews } from "./component-book-mantine";
import type { ComponentName } from "./component-catalog";

export function ComponentBookPreview({ name }: { name: ComponentName }) {
  const mantine = useMantinePreviews();
  const custom = useCustomPreviews();
  const previews = { ...mantine, ...custom } satisfies Record<
    ComponentName,
    ReactNode
  >;

  return (
    <Stack gap="lg">
      <Title id={`preview-${name}`}>{name}</Title>
      <Card
        withBorder
        padding="lg"
        component="article"
        aria-labelledby={`preview-${name}`}
      >
        {previews[name]}
      </Card>
    </Stack>
  );
}
