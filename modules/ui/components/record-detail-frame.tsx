"use client";

import { Badge, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

import { PageFrame } from "./page-frame";
import { PageHeader, type PageBreadcrumb } from "./page-header";

export function RecordDetailFrame({
  title,
  breadcrumbs,
  status,
  meta,
  pane,
  children,
}: {
  title: string;
  breadcrumbs: PageBreadcrumb[];
  status?: string;
  meta?: string;
  pane?: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageFrame
      pane={pane}
      paneNarrow="sheet"
      header={
        <PageHeader
          title={title}
          breadcrumbs={breadcrumbs}
          description={
            <Group gap="xs">
              {status ? <Badge variant="light">{status}</Badge> : null}
              {meta ? (
                <Text size="sm" c="dimmed">
                  {meta}
                </Text>
              ) : null}
            </Group>
          }
        />
      }
    >
      <Stack gap="lg">{children}</Stack>
    </PageFrame>
  );
}
