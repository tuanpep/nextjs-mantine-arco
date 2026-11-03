"use client";

import { Stack, Text } from "@mantine/core";

export function RecordFields({
  fields,
}: {
  fields: { label: string; value: string }[];
}) {
  return (
    <Stack gap="md">
      {fields.map((field) => (
        <Stack key={field.label} gap={4}>
          <Text size="sm" fw={600}>
            {field.label}
          </Text>
          <Text style={{ whiteSpace: "pre-wrap" }}>{field.value}</Text>
        </Stack>
      ))}
    </Stack>
  );
}
