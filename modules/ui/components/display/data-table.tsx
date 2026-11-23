"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Button,
  Checkbox,
  Pagination,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Enables sorting with a caller-defined comparison. */
  compare?: (a: T, b: T) => number;
  /** Text used by the global client-side filter. */
  filterValue?: (row: T) => string;
}

export interface DataTableProps<T> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  /** Must return a stable, unique key for each row. */
  rowKey: (row: T) => string;
  label: string;
  filterLabel: string;
  selectRowLabel: (row: T) => string;
  selectPageLabel: string;
  pageSize?: number;
  onSelectionChange?: (keys: string[]) => void;
  emptyText?: string;
}

/** Client-side filtering, sorting and pagination. Rows are not virtualized or expandable. */
export function DataTable<T>({
  data,
  columns,
  rowKey,
  label,
  filterLabel,
  selectRowLabel,
  selectPageLabel,
  pageSize = 10,
  onSelectionChange,
  emptyText = "No results",
}: DataTableProps<T>) {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<{
    id: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const size = Number.isFinite(pageSize)
    ? Math.max(1, Math.floor(pageSize))
    : 10;
  const rows = useMemo(() => {
    const query = filter.trim().toLocaleLowerCase();
    const result = data.filter(
      (row) =>
        !query ||
        columns.some((column) =>
          column.filterValue?.(row).toLocaleLowerCase().includes(query),
        ),
    );
    const column = columns.find((entry) => entry.id === sort?.id);
    const compare = column?.compare;
    if (compare && sort)
      result.sort(
        (a, b) => (sort.direction === "ascending" ? 1 : -1) * compare(a, b),
      );
    return result;
  }, [data, columns, filter, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const currentPage = Math.min(page, pages);
  const visible = rows.slice((currentPage - 1) * size, currentPage * size);
  const keys = visible.map(rowKey);
  const selectedVisible = keys.filter((key) => selected.includes(key)).length;
  function changeSelection(next: string[]) {
    setSelected(next);
    onSelectionChange?.(next);
  }

  return (
    <Stack>
      <TextInput
        label={filterLabel}
        value={filter}
        onChange={(event) => {
          setFilter(event.currentTarget.value);
          setPage(1);
        }}
      />
      <ScrollArea>
        <Table aria-label={label}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  aria-label={selectPageLabel}
                  checked={keys.length > 0 && selectedVisible === keys.length}
                  indeterminate={
                    selectedVisible > 0 && selectedVisible < keys.length
                  }
                  disabled={keys.length === 0}
                  onChange={(event) =>
                    changeSelection(
                      event.currentTarget.checked
                        ? [...new Set([...selected, ...keys])]
                        : selected.filter((key) => !keys.includes(key)),
                    )
                  }
                />
              </Table.Th>
              {columns.map((column) => (
                <Table.Th
                  key={column.id}
                  scope="col"
                  aria-sort={
                    sort?.id === column.id ? sort.direction : undefined
                  }
                >
                  {column.compare ? (
                    <Button
                      variant="subtle"
                      onClick={() => {
                        setSort((current) => ({
                          id: column.id,
                          direction:
                            current?.id === column.id &&
                            current.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        }));
                        setPage(1);
                      }}
                    >
                      {column.header}
                      {sort?.id === column.id
                        ? sort.direction === "ascending"
                          ? " ↑"
                          : " ↓"
                        : ""}
                    </Button>
                  ) : (
                    column.header
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {visible.map((row) => {
              const key = rowKey(row);
              return (
                <Table.Tr key={key}>
                  <Table.Td>
                    <Checkbox
                      aria-label={selectRowLabel(row)}
                      checked={selected.includes(key)}
                      onChange={(event) =>
                        changeSelection(
                          event.currentTarget.checked
                            ? [...selected, key]
                            : selected.filter((id) => id !== key),
                        )
                      }
                    />
                  </Table.Td>
                  {columns.map((column) => (
                    <Table.Td key={column.id}>{column.render(row)}</Table.Td>
                  ))}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {rows.length === 0 && <Text>{emptyText}</Text>}
      {pages > 1 && (
        <Pagination value={currentPage} onChange={setPage} total={pages} />
      )}
    </Stack>
  );
}
