"use client";

import { Box, Group, Paper, Skeleton, Stack } from "@mantine/core";
import type { ReactNode } from "react";

import { PageFrame } from "./page-frame";

function PageHeaderSkeleton({
  withBreadcrumbs = true,
  withDescription = false,
  withAction = false,
  withTabs = false,
  tabCount = 2,
}: {
  withBreadcrumbs?: boolean;
  withDescription?: boolean;
  withAction?: boolean;
  withTabs?: boolean;
  tabCount?: number;
}) {
  return (
    <Stack gap="sm" mb="md">
      {withBreadcrumbs ? <Skeleton height={14} width={160} /> : null}
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
        <Box style={{ minWidth: 0, flex: 1 }}>
          <Skeleton height={28} width="40%" maw={280} />
          {withDescription ? (
            <Skeleton height={14} width="70%" maw={420} mt={8} />
          ) : null}
        </Box>
        {withAction ? (
          <Skeleton
            height={36}
            width={120}
            radius="sm"
            style={{ flexShrink: 0 }}
          />
        ) : null}
      </Group>
      {withTabs ? (
        <Group gap="md" mt={4}>
          {Array.from({ length: tabCount }, (_, index) => (
            <Skeleton key={index} height={28} width={72 + index * 12} />
          ))}
        </Group>
      ) : null}
    </Stack>
  );
}

function CollectionToolbarSkeleton() {
  return (
    <>
      <Group
        align="flex-end"
        p="sm"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Skeleton height={32} style={{ flex: "1 1 260px" }} radius="sm" />
        <Skeleton height={32} w={96} style={{ flex: "0 0 auto" }} radius="sm" />
      </Group>
      <Box px="md" py="xs" bg="var(--mantine-color-default-hover)">
        <Skeleton height={12} width={140} />
      </Box>
    </>
  );
}

function CollectionRowSkeleton() {
  return (
    <Box
      px="md"
      py="sm"
      style={{
        borderTop: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Group justify="space-between" align="flex-start" gap="sm">
        <Skeleton height={12} width={72} />
        <Group gap="xs">
          <Skeleton height={18} width={56} radius="xl" />
          <Skeleton height={18} width={72} radius="xl" />
        </Group>
      </Group>
      <Skeleton height={16} width="75%" mt={8} />
      <Skeleton height={12} width="45%" mt={8} />
    </Box>
  );
}

function ProjectRowSkeleton() {
  return (
    <Box
      px="md"
      py="sm"
      style={{
        borderTop: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <Skeleton height={36} width={36} circle />
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Skeleton height={14} width="55%" />
            <Skeleton height={12} width="80%" mt={6} />
          </Box>
        </Group>
        <Skeleton height={16} width={16} />
      </Group>
    </Box>
  );
}

function FormFieldSkeleton({ multiline = false }: { multiline?: boolean }) {
  return (
    <Stack gap={6}>
      <Skeleton height={12} width={100} />
      <Skeleton height={multiline ? 88 : 36} radius="sm" />
    </Stack>
  );
}

/** Projects home: header + bordered project rows. */
export function HomePageSkeleton() {
  return (
    <PageFrame header={<PageHeaderSkeleton withBreadcrumbs={false} />}>
      <div role="status" aria-label="Đang tải dự án">
        <Paper withBorder style={{ overflow: "hidden" }}>
          <Box px="md" py="xs" bg="var(--mantine-color-default-hover)">
            <Skeleton height={12} width={80} />
          </Box>
          {Array.from({ length: 4 }, (_, index) => (
            <ProjectRowSkeleton key={index} />
          ))}
        </Paper>
      </div>
    </PageFrame>
  );
}

/** Support / Feedback / Ideas collection: header, optional tabs, toolbar, rows. */
export function CollectionPageSkeleton({
  tabCount = 2,
  withDescription = true,
  withTabs = true,
}: {
  tabCount?: number;
  withDescription?: boolean;
  withTabs?: boolean;
} = {}) {
  return (
    <PageFrame
      header={
        <PageHeaderSkeleton
          withDescription={withDescription}
          withAction
          withTabs={withTabs}
          tabCount={tabCount}
        />
      }
    >
      <div role="status" aria-label="Đang tải danh sách">
        <Paper withBorder style={{ overflow: "hidden" }}>
          <CollectionToolbarSkeleton />
          {Array.from({ length: 5 }, (_, index) => (
            <CollectionRowSkeleton key={index} />
          ))}
        </Paper>
      </div>
    </PageFrame>
  );
}

/** Project overview hub: breadcrumbs, title, description, card grid. */
export function OverviewPageSkeleton() {
  return (
    <PageFrame
      header={
        <PageHeaderSkeleton
          withDescription
          withBreadcrumbs
          withAction={false}
        />
      }
    >
      <div role="status" aria-label="Đang tải tổng quan">
        <Group align="stretch" gap="md" wrap="wrap">
          {Array.from({ length: 6 }, (_, index) => (
            <Paper
              key={index}
              withBorder
              p="md"
              style={{ flex: "1 1 240px", maxWidth: 360 }}
            >
              <Stack gap="sm">
                <Skeleton height={12} width="45%" />
                <Skeleton height={28} width={48} />
                <Skeleton height={12} width="70%" />
                <Skeleton height={12} width={64} mt="sm" />
              </Stack>
            </Paper>
          ))}
        </Group>
      </div>
    </PageFrame>
  );
}

/** Support / Feedback detail: header + sheet pane + body sections. */
export function DetailPageSkeleton() {
  return (
    <PageFrame
      paneNarrow="sheet"
      paneLabel="Chi tiết"
      pane={
        <Stack gap="lg">
          <Stack gap="sm">
            <Skeleton height={22} width={90} radius="xl" />
            <Group gap="xs">
              <Skeleton height={22} width={72} radius="xl" />
              <Skeleton height={22} width={88} radius="xl" />
            </Group>
          </Stack>
          <Skeleton height={1} width="100%" />
          <Stack gap="sm">
            <Skeleton height={18} width="55%" />
            <Skeleton height={12} width="40%" />
            <Skeleton height={14} width="70%" />
            <Skeleton height={12} width="35%" />
            <Skeleton height={14} width="60%" />
          </Stack>
        </Stack>
      }
      header={<PageHeaderSkeleton withDescription withBreadcrumbs />}
    >
      <div role="status" aria-label="Đang tải chi tiết">
        <Stack gap="lg">
          <Stack gap="sm">
            <Skeleton height={20} width={140} />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="75%" />
            <Skeleton height={14} width="60%" />
          </Stack>
          <Skeleton height={1} width="100%" />
          <Stack gap="sm">
            <Skeleton height={20} width={160} />
            <Skeleton height={14} width="85%" />
            <Skeleton height={14} width="50%" />
          </Stack>
          <Skeleton height={1} width="100%" />
          <Stack gap="sm">
            <Skeleton height={20} width={120} />
            <Skeleton height={80} radius="sm" />
            <Skeleton height={36} width={110} radius="sm" />
          </Stack>
        </Stack>
      </div>
    </PageFrame>
  );
}

/** New request / feedback / idea forms. */
export function FormPageSkeleton({ fields = 5 }: { fields?: number } = {}) {
  return (
    <PageFrame header={<PageHeaderSkeleton withDescription />}>
      <div role="status" aria-label="Đang tải biểu mẫu">
        <Stack gap="md">
          <Skeleton height={52} radius="sm" />
          {Array.from({ length: fields }, (_, index) => (
            <FormFieldSkeleton
              key={index}
              multiline={index === 1 || index === 2}
            />
          ))}
          <Group justify="flex-end">
            <Skeleton height={36} width={120} radius="sm" />
          </Group>
        </Stack>
      </div>
    </PageFrame>
  );
}

/**
 * Fallback while WorkspaceShell itself suspends (rare).
 * Mirrors AppShell chrome: 48px header + 232px navbar + main.
 */
export function WorkspaceShellSkeleton({ children }: { children?: ReactNode }) {
  return (
    <Box role="status" aria-label="Đang tải không gian làm việc">
      <Group
        h={48}
        px="md"
        justify="space-between"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group gap="sm">
          <Skeleton height={28} width={28} radius="sm" />
          <Skeleton height={16} width={88} />
          <Box visibleFrom="lg">
            <Skeleton height={28} width={160} radius="sm" />
          </Box>
        </Group>
        <Group gap="sm">
          <Skeleton height={28} width={72} radius="sm" />
          <Skeleton height={28} width={28} circle />
          <Skeleton height={28} width={28} circle />
        </Group>
      </Group>
      <Group align="flex-start" gap={0} wrap="nowrap">
        <Box
          visibleFrom="lg"
          w={232}
          p="md"
          style={{
            borderInlineEnd: "1px solid var(--mantine-color-default-border)",
            minHeight: "calc(100vh - 48px)",
          }}
        >
          <Stack gap="xs">
            <Skeleton height={32} radius="sm" />
            <Skeleton height={32} radius="sm" />
            <Skeleton height={32} radius="sm" />
            <Skeleton height={32} radius="sm" />
            <Skeleton height={32} radius="sm" />
            <Skeleton height={32} radius="sm" mt="md" />
          </Stack>
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          {children ?? <HomePageSkeleton />}
        </Box>
      </Group>
    </Box>
  );
}
