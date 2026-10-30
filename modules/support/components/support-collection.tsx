"use client";

import {
  Box,
  Button,
  Group,
  Menu,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconChevronDown, IconLifebuoy, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";

import { getApplication } from "@/modules/projects/lib/applications";
import { CollectionEmpty } from "@/modules/ui/components/collection-empty";
import { CollectionToolbar } from "@/modules/ui/components/collection-toolbar";
import { ModuleTabs } from "@/modules/ui/components/module-tabs";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { supportStatuses, supportStatusLabels } from "../lib/fixtures";
import {
  requestCatalogCards,
  requestTypeShortLabels,
} from "../lib/request-catalog";
import { supportSearchParams, type SupportView } from "../lib/search-params";
import { filterSupport } from "../lib/support-state";
import {
  SupportPriorityBadge,
  SupportStatusBadge,
  SupportUnavailable,
  supportAttention,
  supportPath,
} from "./support-common";
import { useSupport } from "./support-provider";

export function SupportCollection({ projectId }: { projectId?: string }) {
  const { requests } = useSupport();
  const [filters, setFilters] = useQueryStates(supportSearchParams);
  if (projectId && !getApplication(projectId)) {
    return (
      <PageFrame>
        <SupportUnavailable />
      </PageFrame>
    );
  }
  const basePath = supportPath(projectId ?? null);
  const overviewHref = projectId ? `/projects/${projectId}` : undefined;
  const scoped = requests.filter(
    (item) => !projectId || item.applicationId === projectId,
  );
  const openCount = scoped.filter((item) => item.status !== "Resolved").length;
  const closedCount = scoped.filter(
    (item) => item.status === "Resolved",
  ).length;
  const items = filterSupport(
    scoped,
    filters.q,
    filters.view === "closed" ? "all" : filters.status,
    filters.view,
  );
  const openStatuses = supportStatuses.filter(
    (status) => status !== "Resolved",
  );
  const waitingOnYouCount = items.filter(
    (item) => item.nextActor === "Sender" && item.status !== "Resolved",
  ).length;

  return (
    <PageFrame
      header={
        <PageHeader
          title="Hỗ trợ"
          description="Theo dõi yêu cầu cần phản hồi, kiểm tra lại hoặc người xử lý."
          breadcrumbs={[
            ...(overviewHref
              ? [{ title: "Tổng quan", href: overviewHref }]
              : []),
            { title: "Hỗ trợ", href: basePath },
          ]}
          actions={
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <Button
                  leftSection={<IconPlus size={16} aria-hidden />}
                  rightSection={<IconChevronDown size={14} aria-hidden />}
                >
                  Tạo yêu cầu
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Loại yêu cầu</Menu.Label>
                {requestCatalogCards.map((card) => (
                  <Menu.Item
                    key={card.type}
                    component={Link}
                    href={`${basePath}/new?type=${card.type}`}
                  >
                    <Text size="sm" fw={card.primary ? 600 : 400}>
                      {card.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {card.description}
                    </Text>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          }
        >
          <ModuleTabs
            ariaLabel="Chế độ xem hỗ trợ"
            value={filters.view}
            onChange={(value) => {
              const view = supportSearchParams.view.parse(value) as SupportView;
              void setFilters({
                view: view ?? "open",
                status: value === "closed" ? "all" : filters.status,
              });
            }}
            items={[
              { value: "open", label: "Đang mở", count: openCount },
              { value: "closed", label: "Đã đóng", count: closedCount },
              {
                value: "needs-action",
                label: "Cần bạn phản hồi",
                count: scoped.filter(
                  (item) =>
                    item.nextActor === "Sender" && item.status !== "Resolved",
                ).length,
              },
            ]}
          />
        </PageHeader>
      }
    >
      <Paper withBorder style={{ overflow: "hidden" }}>
        <CollectionToolbar
          searchLabel="Tìm yêu cầu"
          searchPlaceholder="Tìm theo tóm tắt hoặc mã yêu cầu"
          searchValue={filters.q}
          onSearchChange={(value) => void setFilters({ q: value })}
          statusLabel={filters.view === "open" ? "Trạng thái" : undefined}
          statusValue={filters.status}
          statusOptions={
            filters.view === "open"
              ? [
                  { value: "all", label: "Tất cả trạng thái đang mở" },
                  ...openStatuses.map((status) => ({
                    value: status,
                    label: supportStatusLabels[status],
                  })),
                ]
              : undefined
          }
          onStatusChange={
            filters.view === "open"
              ? (value) => {
                  const status = supportSearchParams.status.parse(value);
                  void setFilters({ status: status ?? "all" });
                }
              : undefined
          }
          countLabel={
            waitingOnYouCount > 0
              ? `${items.length} yêu cầu phù hợp · ${waitingOnYouCount} chờ bạn phản hồi`
              : `${items.length} yêu cầu phù hợp`
          }
        />
        {items.length === 0 ? (
          <CollectionEmpty
            icon={<IconLifebuoy />}
            title="Không có yêu cầu phù hợp"
            actionLabel="Xóa bộ lọc"
            onAction={() =>
              void setFilters({ q: "", status: "all", view: filters.view })
            }
          />
        ) : (
          items.map((item) => {
            const attention = supportAttention(item);
            return (
              <Box
                key={item.id}
                component={Link}
                href={`${supportPath(item.applicationId)}/${item.id}`}
                px="md"
                py="sm"
                display="block"
                c="inherit"
                td="none"
                style={{
                  borderTop: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Group justify="space-between" align="flex-start" gap="sm">
                  <Text size="xs" c="dimmed">
                    {item.id}
                  </Text>
                  <Group gap="xs">
                    <SupportPriorityBadge priority={item.priority} />
                    <SupportStatusBadge status={item.status} />
                  </Group>
                </Group>
                <Title
                  order={2}
                  size="sm"
                  mt={4}
                  style={{ overflowWrap: "anywhere" }}
                >
                  {item.summary}
                </Title>
                <Group gap="xs" mt={6} wrap="wrap">
                  <Text size="xs" c="dimmed">
                    {requestTypeShortLabels[item.requestType]}
                  </Text>
                  <Text size="xs" c="dimmed" aria-hidden>
                    ·
                  </Text>
                  <Text
                    size="xs"
                    fw={attention.waitingOnYou ? 600 : 400}
                    c={attention.waitingOnYou ? "orange" : "dimmed"}
                  >
                    {attention.label}
                  </Text>
                </Group>
                {attention.detail ? (
                  <Tooltip label={attention.detail} multiline maw={360}>
                    <Text size="sm" mt={4} lineClamp={1}>
                      {attention.detail}
                    </Text>
                  </Tooltip>
                ) : null}
              </Box>
            );
          })
        )}
      </Paper>
    </PageFrame>
  );
}
