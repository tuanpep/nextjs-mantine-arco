import { Group, Paper, Text } from "@mantine/core";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

const tones = {
  info: [IconInfoCircle, "var(--mantine-primary-color-light-color)"],
  success: [IconCircleCheck, "var(--mantine-color-success)"],
  warning: [IconAlertCircle, "var(--mantine-color-orange-text)"],
  error: [IconCircleX, "var(--mantine-color-error)"],
} satisfies Record<string, [typeof IconInfoCircle, string]>;

export function Message({
  tone = "info",
  children,
}: {
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  const [Icon, color] = tones[tone];
  return (
    <Paper
      withBorder
      radius="sm"
      shadow="md"
      px="sm"
      py="xs"
      role={tone === "error" ? "alert" : "status"}
    >
      <Group gap="xs" wrap="nowrap">
        <Icon size={18} color={color} aria-hidden style={{ flexShrink: 0 }} />
        <Text>{children}</Text>
      </Group>
    </Paper>
  );
}
