"use client";

import { Button, Group, Popover, Stack, Text } from "@mantine/core";
import {
  cloneElement,
  useState,
  type MouseEvent,
  type ReactElement,
} from "react";

/** The child must forward its ref to a focusable element. */
export function Popconfirm({
  children,
  title,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: {
  children: ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  }>;
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover opened={opened} onChange={setOpened} returnFocus trapFocus>
      <Popover.Target>
        {cloneElement(children, {
          onClick: (event: MouseEvent<HTMLElement>) => {
            children.props.onClick?.(event);
            if (!event.defaultPrevented) setOpened((current) => !current);
          },
        })}
      </Popover.Target>
      <Popover.Dropdown aria-label={title}>
        <Stack gap="sm">
          <Text>{title}</Text>
          <Group justify="flex-end" gap="xs">
            <Button
              variant="default"
              size="xs"
              data-autofocus
              onClick={() => {
                setOpened(false);
                onCancel?.();
              }}
            >
              {cancelLabel}
            </Button>
            <Button
              size="xs"
              onClick={() => {
                setOpened(false);
                onConfirm();
              }}
            >
              {confirmLabel}
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
