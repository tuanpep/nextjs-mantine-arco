"use client";

import {
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { CollectionEmpty } from "./collection-empty";
import { CollectionToolbar } from "./collection-toolbar";
import type { FilterOperator } from "./filtered-search";
import { ModuleTabs } from "./module-tabs";
import { PageFrame } from "./page-frame";
import { PageHeader, type PageBreadcrumb } from "./page-header";

export type RecordRow = {
  id: string;
  href: string;
  title: string;
  status?: string;
  meta?: string;
};

export type RecordView = {
  value: string;
  label: string;
  count: number;
};

export function RecordCollection({
  title,
  description,
  breadcrumbs,
  createHref,
  createLabel,
  query,
  onQueryChange,
  views,
  view,
  onViewChange,
  rows,
  emptyTitle,
  emptyActionLabel,
  filterLabel,
  filterValue,
  filterOperator,
  filterOptions,
  onFilterChange,
  filterActive = false,
  onClearFilters,
  narrowActionLabel,
  toolbarControls,
  footer,
  resultCount,
  onEmptyAction,
}: {
  title: string;
  description?: string;
  breadcrumbs: PageBreadcrumb[];
  createHref: string;
  createLabel: string;
  query: string;
  onQueryChange: (value: string) => void;
  views?: RecordView[];
  view?: string;
  onViewChange?: (value: string) => void;
  rows: RecordRow[];
  emptyTitle: string;
  emptyActionLabel: string;
  filterLabel?: string;
  filterValue?: string;
  filterOperator?: FilterOperator;
  filterOptions?: { value: string; label: string }[];
  onFilterChange?: (value: string, operator: FilterOperator) => void;
  filterActive?: boolean;
  onClearFilters?: () => void;
  narrowActionLabel?: string;
  toolbarControls?: ReactNode;
  footer?: ReactNode;
  resultCount?: number;
  onEmptyAction?: () => void;
}) {
  const t = useTranslations("Portal");
  const router = useRouter();
  const searching = query.trim().length > 0;
  const narrowed = rows.length === 0 && (searching || filterActive);

  return (
    <PageFrame
      header={
        <PageHeader
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
          actions={
            <Button component={Link} href={createHref}>
              {createLabel}
            </Button>
          }
        >
          {views && view && onViewChange ? (
            <ModuleTabs
              ariaLabel={t("views")}
              value={view}
              items={views}
              onChange={onViewChange}
            />
          ) : null}
        </PageHeader>
      }
    >
      <Stack gap="md">
        <Paper withBorder style={{ overflow: "hidden" }}>
          <CollectionToolbar
            searchLabel={t("search")}
            searchPlaceholder={t("searchPlaceholder")}
            searchValue={query}
            onSearchChange={onQueryChange}
            statusLabel={filterLabel}
            statusValue={filterValue}
            statusOperator={filterOperator}
            statusOptions={filterOptions}
            onStatusChange={onFilterChange}
            countLabel={t("count", { count: resultCount ?? rows.length })}
          />
          {toolbarControls}
          {rows.length === 0 ? (
            <CollectionEmpty
              icon={<IconSearch size={20} />}
              title={narrowed ? t("noMatches") : emptyTitle}
              actionLabel={
                narrowed
                  ? (narrowActionLabel ?? t("clearSearch"))
                  : emptyActionLabel
              }
              onAction={() => {
                if (!narrowed) {
                  if (onEmptyAction) onEmptyAction();
                  else router.push(createHref);
                  return;
                }
                if (onClearFilters) onClearFilters();
                else onQueryChange("");
              }}
            />
          ) : (
            <Stack component="ul" gap={0} p={0} m={0} aria-label={title}>
              {rows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </Stack>
          )}
        </Paper>
        {footer}
      </Stack>
    </PageFrame>
  );
}

function Row({ row }: { row: RecordRow }) {
  return (
    <Box
      component="li"
      px="md"
      py="sm"
      style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Anchor component={Link} href={row.href} fw={600}>
            {row.title}
          </Anchor>
          {row.meta ? (
            <Text size="xs" c="dimmed">
              {row.meta}
            </Text>
          ) : null}
        </Stack>
        {row.status ? (
          <Badge variant="light" style={{ flexShrink: 0 }}>
            {row.status}
          </Badge>
        ) : null}
      </Group>
    </Box>
  );
}
