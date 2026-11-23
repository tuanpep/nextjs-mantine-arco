"use client";

import {
  Button,
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";

export interface TransferProps {
  items: { value: string; label: string; disabled?: boolean }[];
  value: string[];
  onChange: (value: string[]) => void;
  labels: {
    source: string;
    target: string;
    search: string;
    moveToTarget: string;
    moveToSource: string;
  };
}

export function Transfer({ items, value, onChange, labels }: TransferProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const target = new Set(value);
  const sourceSelected = items.filter(
    (item) =>
      !item.disabled &&
      !target.has(item.value) &&
      selected.includes(item.value),
  );
  const targetSelected = items.filter(
    (item) =>
      !item.disabled && target.has(item.value) && selected.includes(item.value),
  );

  function move(toTarget: boolean) {
    const moving = toTarget ? sourceSelected : targetSelected;
    const ids = new Set(moving.map((item) => item.value));
    onChange(
      toTarget ? [...value, ...ids] : value.filter((id) => !ids.has(id)),
    );
    setSelected((current) => current.filter((id) => !ids.has(id)));
  }

  function list(
    isTarget: boolean,
    search: string,
    setSearch: (value: string) => void,
  ) {
    const title = isTarget ? labels.target : labels.source;
    return (
      <Paper withBorder p="sm" style={{ flex: "1 1 200px", minWidth: 0 }}>
        <Stack gap="sm">
          <Text fw={500}>{title}</Text>
          <TextInput
            aria-label={`${labels.search} ${title}`}
            placeholder={labels.search}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Stack gap="xs" role="group" aria-label={title}>
            {items
              .filter(
                (item) =>
                  target.has(item.value) === isTarget &&
                  item.label
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase()),
              )
              .map((item) => (
                <Checkbox
                  key={item.value}
                  label={item.label}
                  disabled={item.disabled}
                  checked={!item.disabled && selected.includes(item.value)}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setSelected((current) =>
                      checked
                        ? [...current, item.value]
                        : current.filter((id) => id !== item.value),
                    );
                  }}
                />
              ))}
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Group align="stretch">
      {list(false, sourceSearch, setSourceSearch)}
      <Stack justify="center" gap="xs">
        <Button
          type="button"
          disabled={!sourceSelected.length}
          onClick={() => move(true)}
        >
          {labels.moveToTarget}
        </Button>
        <Button
          type="button"
          disabled={!targetSelected.length}
          onClick={() => move(false)}
        >
          {labels.moveToSource}
        </Button>
      </Stack>
      {list(true, targetSearch, setTargetSearch)}
    </Group>
  );
}
