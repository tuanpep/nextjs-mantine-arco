"use client";

import { Avatar, Button, ComboboxPopover, Group, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

import { getApplication } from "../lib/applications";

export function ProjectSwitcher({
  value,
  options,
  disabled,
  label,
  nothingFound,
  placeholder,
  onChange,
  fullWidth,
}: {
  value: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  label: string;
  nothingFound: string;
  placeholder: string;
  onChange: (projectId: string) => void;
  fullWidth?: boolean;
}) {
  const selected = getApplication(value);

  return (
    <ComboboxPopover
      value={value}
      allowDeselect={false}
      nothingFoundMessage={nothingFound}
      data={options}
      comboboxProps={{ width: 280, position: "bottom-start" }}
      onChange={(next) => {
        if (typeof next !== "string" || next === value) return;
        onChange(next);
      }}
      renderOption={({ option }) => {
        const project = getApplication(option.value);
        return (
          <Group gap="xs" wrap="nowrap">
            <Avatar color="blue" size={22}>
              {project?.initials ?? option.label.slice(0, 2)}
            </Avatar>
            <Text size="sm">{option.label}</Text>
          </Group>
        );
      }}
    >
      <ComboboxPopover.Target>
        <Button
          variant="default"
          size="compact-xs"
          disabled={disabled}
          aria-label={label}
          fullWidth={fullWidth}
          justify="space-between"
          rightSection={<IconChevronDown size={14} aria-hidden />}
          maw={fullWidth ? undefined : 160}
        >
          <Text component="span" size="xs" truncate>
            {selected?.name ?? placeholder}
          </Text>
        </Button>
      </ComboboxPopover.Target>
    </ComboboxPopover>
  );
}
