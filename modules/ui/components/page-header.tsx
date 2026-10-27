"use client";

import {
  Anchor,
  Box,
  Breadcrumbs,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type PageBreadcrumb = {
  title: string;
  href?: string;
};

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: PageBreadcrumb[];
  /** @deprecated Prefer breadcrumbs. Kept during migration. */
  parentHref?: string;
  /** @deprecated Prefer breadcrumbs. Kept during migration. */
  parentLabel?: string;
  onParentClick?: () => void;
  children?: ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  parentHref,
  parentLabel,
  onParentClick,
  children,
}: PageHeaderProps) {
  const crumbTrail =
    breadcrumbs && breadcrumbs.length > 0 ? (
      <Breadcrumbs
        separator={<IconChevronRight size={14} aria-hidden />}
        separatorMargin={6}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          if (crumb.href) {
            return (
              <Anchor
                key={`${crumb.title}-${index}`}
                component={Link}
                href={crumb.href}
                size="sm"
                c={isLast ? undefined : "dimmed"}
                aria-current={isLast ? "page" : undefined}
              >
                {crumb.title}
              </Anchor>
            );
          }
          return (
            <Text
              key={`${crumb.title}-${index}`}
              size="sm"
              c={isLast ? undefined : "dimmed"}
              aria-current={isLast ? "page" : undefined}
            >
              {crumb.title}
            </Text>
          );
        })}
      </Breadcrumbs>
    ) : null;

  const parentInner = (
    <Group gap={6} wrap="nowrap">
      <IconArrowLeft size={16} aria-hidden />
      {parentLabel ?? "Back"}
    </Group>
  );
  const parentControl = !crumbTrail ? (
    parentHref ? (
      <Anchor
        component={Link}
        href={parentHref}
        size="sm"
        style={{ alignSelf: "flex-start" }}
      >
        {parentInner}
      </Anchor>
    ) : onParentClick ? (
      <Anchor
        component="button"
        type="button"
        onClick={onParentClick}
        size="sm"
        style={{ alignSelf: "flex-start" }}
      >
        {parentInner}
      </Anchor>
    ) : null
  ) : null;

  return (
    <Stack gap="sm" mb="md">
      {crumbTrail ?? parentControl}
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
        <Box style={{ minWidth: 0, flex: 1 }}>
          <Title order={1} size="h2">
            {title}
          </Title>
          {description ? (
            typeof description === "string" ? (
              <Text size="sm" c="dimmed" mt={4}>
                {description}
              </Text>
            ) : (
              <Box mt={4}>{description}</Box>
            )
          ) : null}
        </Box>
        {actions ? (
          <Group gap="sm" wrap="wrap" style={{ flexShrink: 0 }}>
            {actions}
          </Group>
        ) : null}
      </Group>
      {children}
    </Stack>
  );
}
