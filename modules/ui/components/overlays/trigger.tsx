"use client";

import { Popover } from "@mantine/core";
import {
  cloneElement,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";

/** Click-activated, non-modal popup. The child must forward its ref to a focusable element. */
export function Trigger({
  children,
  content,
  label,
}: {
  children: ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  }>;
  content: ReactNode;
  label: string;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <Popover opened={opened} onChange={setOpened} returnFocus>
      <Popover.Target>
        {cloneElement(children, {
          onClick: (event) => {
            children.props.onClick?.(event);
            if (!event.defaultPrevented) setOpened((current) => !current);
          },
          onKeyDown: (event) => {
            children.props.onKeyDown?.(event);
            if (!event.defaultPrevented && event.key === "Escape" && opened) {
              event.preventDefault();
              setOpened(false);
            }
          },
        })}
      </Popover.Target>
      <Popover.Dropdown aria-label={label}>{content}</Popover.Dropdown>
    </Popover>
  );
}
