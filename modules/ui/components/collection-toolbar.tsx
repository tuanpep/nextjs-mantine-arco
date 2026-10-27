"use client";

import { Box, Group, Select, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import type { ReactNode } from "react";

export type CollectionStatusOption = {
  value: string;
  label: string;
};

export type CollectionToolbarProps = {
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusLabel?: string;
  statusValue?: string;
  statusOptions?: CollectionStatusOption[];
  onStatusChange?: (value: string) => void;
  countLabel: ReactNode;
};

export function CollectionToolbar({
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  statusLabel,
  statusValue,
  statusOptions,
  onStatusChange,
  countLabel,
}: CollectionToolbarProps) {
  const hasStatus =
    Boolean(statusLabel) &&
    Boolean(statusOptions) &&
    typeof onStatusChange === "function";

  return (
    <>
      <Group
        align="flex-end"
        p="sm"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <TextInput
          style={{ flex: "1 1 260px" }}
          aria-label={searchLabel}
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
        />
        {hasStatus ? (
          <Select
            style={{ flex: "0 1 220px" }}
            aria-label={statusLabel}
            value={statusValue}
            allowDeselect={false}
            data={statusOptions}
            onChange={(value) => onStatusChange?.(value ?? statusValue ?? "")}
          />
        ) : null}
      </Group>
      <Box
        px="md"
        py="xs"
        bg="var(--mantine-color-default-hover)"
        aria-live="polite"
      >
        <Text size="xs" c="dimmed">
          {countLabel}
        </Text>
      </Box>
    </>
  );
}
