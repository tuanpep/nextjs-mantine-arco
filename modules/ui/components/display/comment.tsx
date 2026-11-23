import { Box, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

type CommentProps = {
  author: ReactNode;
  content: ReactNode;
  avatar?: ReactNode;
  timestamp?: { dateTime: string; label: string };
  actions?: ReactNode;
  children?: ReactNode;
};

export function Comment({
  author,
  content,
  avatar,
  timestamp,
  actions,
  children,
}: CommentProps) {
  return (
    <Group component="article" align="flex-start" wrap="nowrap" gap="sm">
      {avatar && <Box style={{ flexShrink: 0 }}>{avatar}</Box>}
      <Stack gap="xs" miw={0} style={{ flex: 1, overflowWrap: "anywhere" }}>
        <Group gap="xs">
          <Text component="span" fw={500}>
            {author}
          </Text>
          {timestamp && (
            <Text
              component="time"
              dateTime={timestamp.dateTime}
              c="dimmed"
              size="xs"
            >
              {timestamp.label}
            </Text>
          )}
        </Group>
        <Box>{content}</Box>
        {actions && <Group gap="xs">{actions}</Group>}
        {children}
      </Stack>
    </Group>
  );
}
