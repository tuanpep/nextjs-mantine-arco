"use client";

import { Stack, Text } from "@mantine/core";

import type { DetailsReadoutRow } from "./types";

export function DetailsReadout({
  rows,
  emptyLabel = "Not provided",
  omitEmpty = false,
}: {
  rows: DetailsReadoutRow[];
  emptyLabel?: string;
  /** When true, skip rows whose value is blank. */
  omitEmpty?: boolean;
}) {
  const visible = omitEmpty
    ? rows.filter((row) => row.value.trim().length > 0)
    : rows;

  return (
    <Stack gap="md">
      {visible.map((row) => (
        <div key={row.label}>
          <Text fw={600} size="sm">
            {row.label}
          </Text>
          <Text
            size="sm"
            style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
          >
            {row.value.trim() || emptyLabel}
          </Text>
        </div>
      ))}
    </Stack>
  );
}
