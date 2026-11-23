"use client";

import { Box, Paper, Text, Textarea, UnstyledButton } from "@mantine/core";
import { useId, useLayoutEffect, useRef, useState } from "react";

export interface MentionsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: { value: string; label: string }[];
  nothingFoundMessage?: string;
}

export function Mentions({
  label,
  value,
  onChange,
  suggestions,
  nothingFoundMessage,
}: MentionsProps) {
  const id = useId();
  const input = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<{ value: string; position: number } | null>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(0);

  const before = value.slice(0, selection.start);
  const match =
    selection.start === selection.end
      ? /(?:^|\s)@([^\s@]*)$/.exec(before)
      : null;
  const query = match?.[1];
  const matches =
    query === undefined
      ? []
      : suggestions.filter(
          (item) =>
            item.label
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()) ||
            item.value.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        );
  const open =
    focused &&
    !dismissed &&
    query !== undefined &&
    (matches.length > 0 || Boolean(nothingFoundMessage));
  const activeIndex = Math.min(active, Math.max(0, matches.length - 1));

  useLayoutEffect(() => {
    const pending = pendingCaret.current;
    if (pending && pending.value === value && input.current) {
      input.current.focus();
      input.current.setSelectionRange(pending.position, pending.position);
      pendingCaret.current = null;
    }
  }, [value]);

  function updateSelection(element: HTMLTextAreaElement, changed = false) {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    if (!changed && start === selection.start && end === selection.end) return;
    setSelection({ start, end });
    setDismissed(false);
    setActive(0);
  }

  function insert(item: { value: string }) {
    if (query === undefined) return;
    const start = selection.start - query.length - 1;
    // Replace the rest of the current mention too when editing in its middle.
    const suffix = value.slice(selection.end);
    const tail = /^[^\s@]*/.exec(suffix)?.[0] ?? "";
    const replacement = `@${item.value}`;
    const next =
      value.slice(0, start) + replacement + suffix.slice(tail.length);
    const position = start + replacement.length;
    pendingCaret.current = { value: next, position };
    setSelection({ start: position, end: position });
    setDismissed(true);
    if (next === value && input.current) {
      input.current.focus();
      input.current.setSelectionRange(position, position);
      pendingCaret.current = null;
    }
    onChange(next);
  }

  return (
    <Box>
      <Textarea
        ref={input}
        label={label}
        value={value}
        aria-autocomplete="list"
        aria-controls={open ? id : undefined}
        aria-activedescendant={
          open && matches.length ? `${id}-${activeIndex}` : undefined
        }
        onFocus={(event) => {
          setFocused(true);
          updateSelection(event.currentTarget, true);
        }}
        onBlur={() => setFocused(false)}
        onSelect={(event) => updateSelection(event.currentTarget)}
        onChange={(event) => {
          updateSelection(event.currentTarget, true);
          onChange(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (!open) return;
          if (event.key === "Escape") {
            event.preventDefault();
            setDismissed(true);
          } else if (event.key === "ArrowDown" && matches.length) {
            event.preventDefault();
            setActive((activeIndex + 1) % matches.length);
          } else if (event.key === "ArrowUp" && matches.length) {
            event.preventDefault();
            setActive((activeIndex - 1 + matches.length) % matches.length);
          } else if (event.key === "Enter" && matches[activeIndex]) {
            event.preventDefault();
            insert(matches[activeIndex]);
          }
        }}
      />
      {open && (
        <Paper withBorder mt={4} p="xs">
          <Box id={id} role="listbox" aria-label={label}>
            {matches.map((item, index) => (
              <UnstyledButton
                key={item.value}
                id={`${id}-${index}`}
                role="option"
                tabIndex={-1}
                aria-selected={index === activeIndex}
                display="block"
                w="100%"
                p="xs"
                bg={
                  index === activeIndex
                    ? "var(--mantine-color-default-hover)"
                    : undefined
                }
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insert(item)}
              >
                {item.label}
              </UnstyledButton>
            ))}
          </Box>
          {!matches.length && <Text size="sm">{nothingFoundMessage}</Text>}
        </Paper>
      )}
    </Box>
  );
}
