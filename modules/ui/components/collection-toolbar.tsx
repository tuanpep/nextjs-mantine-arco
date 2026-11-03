"use client";

import { Box, Group, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import {
  FilteredSearch,
  type FilterOperator,
  type FilterQuery,
} from "./filtered-search";

export type CollectionStatusOption = {
  value: string;
  label: string;
};

export type CollectionToolbarProps = {
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusLabel?: string;
  statusValue?: string;
  statusOperator?: FilterOperator;
  statusOptions?: CollectionStatusOption[];
  onStatusChange?: (value: string, operator: FilterOperator) => void;
  countLabel: ReactNode;
};

export function CollectionToolbar({
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  statusLabel,
  statusValue,
  statusOperator = "is",
  statusOptions,
  onStatusChange,
  countLabel,
}: CollectionToolbarProps) {
  const t = useTranslations("Portal");
  const hasStatus =
    Boolean(statusLabel) &&
    Boolean(statusOptions) &&
    typeof onStatusChange === "function";
  const options = (statusOptions ?? []).filter(
    (option) => option.value !== "all",
  );
  const queries: FilterQuery[] =
    hasStatus && statusValue && statusValue !== "all"
      ? [{ type: "status", operator: statusOperator, value: statusValue }]
      : [];

  return (
    <>
      <Group
        align="flex-start"
        p="sm"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <FilteredSearch
          fields={
            hasStatus
              ? [{ type: "status", title: statusLabel ?? "", options }]
              : []
          }
          queries={queries}
          onQueriesChange={(next) => {
            const status = next.find((query) => query.type === "status");
            if (!status) {
              onStatusChange?.("all", "is");
              return;
            }
            onStatusChange?.(status.value, status.operator);
          }}
          terms={searchValue}
          onTermsChange={onSearchChange}
          onSearch={() => undefined}
          inputLabel={searchLabel}
          placeholder={searchPlaceholder}
          searchLabel={searchLabel}
          clearLabel={t("filterClear")}
          emptyLabel={t("filterNoMatch")}
          operatorLabel={(operator) => {
            switch (operator) {
              case "is":
                return t("filterIs");
              case "isNot":
                return t("filterIsNot");
              default: {
                const neverOperator: never = operator;
                return neverOperator;
              }
            }
          }}
        />
      </Group>
      <Box
        px="md"
        py="xs"
        bg="var(--mantine-color-default-hover)"
        aria-live="polite"
      >
        <Text size="xs" c="dimmed">
          {countLabel}
        </Text>
      </Box>
    </>
  );
}
