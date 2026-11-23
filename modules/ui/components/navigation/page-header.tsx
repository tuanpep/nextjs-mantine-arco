import {
  ActionIcon,
  Group,
  Stack,
  Text,
  Title,
  type TitleOrder,
  type TitleProps,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  order?: TitleOrder;
  titleSize?: TitleProps["fz"];
  back?: { href: string; label: string };
};

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  footer,
  order = 1,
  titleSize,
  back,
}: PageHeaderProps) {
  return (
    <Stack component="header" gap="xs">
      {breadcrumb}
      <Group justify="space-between" align="flex-start" gap="sm">
        <Group align="flex-start" gap="xs" wrap="nowrap" miw={0}>
          {back && (
            <ActionIcon
              component="a"
              href={back.href}
              aria-label={back.label}
              variant="subtle"
            >
              <IconArrowLeft size={18} aria-hidden />
            </ActionIcon>
          )}
          <Stack gap={4} miw={0}>
            <Title
              order={order}
              fz={titleSize}
              style={{ overflowWrap: "anywhere" }}
            >
              {title}
            </Title>
            {subtitle && (
              <Text c="dimmed" size="sm" maw={720}>
                {subtitle}
              </Text>
            )}
          </Stack>
        </Group>
        {actions && <Group gap="xs">{actions}</Group>}
      </Group>
      {footer}
    </Stack>
  );
}
