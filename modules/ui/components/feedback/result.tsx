import { Group, Stack, Text, Title } from "@mantine/core";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

const statuses = {
  success: [IconCircleCheck, "var(--mantine-color-success)"],
  error: [IconCircleX, "var(--mantine-color-error)"],
  warning: [IconAlertCircle, "var(--mantine-color-orange-text)"],
  info: [IconInfoCircle, "var(--mantine-primary-color-light-color)"],
} satisfies Record<string, [typeof IconCircleCheck, string]>;

type ResultProps = {
  status: keyof typeof statuses;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function Result({ status, title, description, actions }: ResultProps) {
  const [Icon, color] = statuses[status];
  return (
    <Stack align="center" gap="md" py="xl" ta="center">
      <Icon size={64} stroke={1.5} color={color} aria-hidden />
      <Title order={2}>{title}</Title>
      {description && (
        <Text c="dimmed" maw={440}>
          {description}
        </Text>
      )}
      {actions && <Group justify="center">{actions}</Group>}
    </Stack>
  );
}
