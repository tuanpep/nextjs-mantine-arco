"use client";

import {
  Anchor,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBulb,
  IconChecklist,
  IconLifebuoy,
  IconMessageCircle,
} from "@tabler/icons-react";
import Link from "next/link";

import { feedbackItems } from "@/modules/feedback/lib/fixtures";
import { useSupport } from "@/modules/support/components/support-provider";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { getApplication } from "../lib/applications";

const quickActions = [
  { label: "Tạo yêu cầu hỗ trợ", path: "support/new", icon: IconLifebuoy },
  { label: "Gửi phản hồi", path: "feedback/new", icon: IconMessageCircle },
  { label: "Đề xuất ý tưởng", path: "ideas/new", icon: IconBulb },
  { label: "Mở kiểm thử nghiệm thu", path: "uat", icon: IconChecklist },
] as const;

export function ProjectHub({ projectId }: { projectId: string }) {
  const application = getApplication(projectId);
  const { requests } = useSupport();

  if (!application) {
    return (
      <PageFrame>
        <DestinationUnavailable backHref="/" backLabel="Quay lại dự án" />
      </PageFrame>
    );
  }

  const basePath = `/projects/${projectId}`;
  const open = requests.filter(
    (item) => item.applicationId === projectId && item.status !== "Resolved",
  );
  const attention = open.filter((item) => item.nextActor === "Sender");
  const unreviewed = feedbackItems.filter(
    (item) =>
      item.projectId === projectId &&
      (item.disposition === "Not reviewed" ||
        item.disposition === "Needs clarification"),
  ).length;
  const stats = [
    {
      label: "Cần bạn phản hồi",
      value: attention.length,
      href: `${basePath}/support?view=needs-action`,
    },
    {
      label: "Hỗ trợ đang mở",
      value: open.length,
      href: `${basePath}/support`,
    },
    {
      label: "Phản hồi cần xem xét",
      value: unreviewed,
      href: `${basePath}/feedback?view=needs-review`,
    },
    {
      label: "Tiến độ UAT",
      value: "Chưa có dữ liệu",
      href: `${basePath}/uat`,
    },
  ];

  return (
    <PageFrame
      header={
        <PageHeader
          title="Tổng quan"
          description={application.name}
          breadcrumbs={[{ title: "Tổng quan", href: basePath }]}
        />
      }
    >
      <Stack gap="xl">
        <Text size="sm" c="dimmed">
          Dữ liệu minh họa, đặt lại khi tải lại ứng dụng. Không gửi thông báo
          thực.
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {stats.map((stat) => (
            <Paper
              key={stat.label}
              component="section"
              aria-label={stat.label}
              withBorder
              p="md"
            >
              <Stack gap="sm" h="100%">
                <Text size="sm" c="dimmed">
                  {stat.label}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
                <Anchor component={Link} href={stat.href} size="sm" mt="auto">
                  Xem {stat.label.toLowerCase()}
                </Anchor>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
        <Stack
          component="section"
          aria-labelledby="quick-actions-title"
          gap="sm"
        >
          <Title id="quick-actions-title" order={2} size="h3">
            Thao tác nhanh
          </Title>
          <Group gap="sm">
            {quickActions.map(({ label, path, icon: Icon }, index) => (
              <Button
                key={path}
                component={Link}
                href={`${basePath}/${path}`}
                variant={index === 0 ? "filled" : "default"}
                leftSection={<Icon size={18} aria-hidden />}
              >
                {label}
              </Button>
            ))}
          </Group>
        </Stack>
        <Stack component="section" aria-labelledby="attention-title" gap="sm">
          <Group justify="space-between">
            <Title id="attention-title" order={2} size="h3">
              Cần bạn thực hiện
            </Title>
            {attention.length > 0 && (
              <Anchor
                component={Link}
                href={`${basePath}/support?view=needs-action`}
                size="sm"
              >
                Xem tất cả ({attention.length})
              </Anchor>
            )}
          </Group>
          {attention.length === 0 ? (
            <Paper withBorder p="md">
              <Stack gap="xs">
                <Text fw={600}>
                  Hiện không có yêu cầu hỗ trợ chờ bạn phản hồi.
                </Text>
                <Anchor component={Link} href={`${basePath}/support`} size="sm">
                  Xem yêu cầu hỗ trợ
                </Anchor>
              </Stack>
            </Paper>
          ) : (
            attention.slice(0, 5).map((item) => (
              <Paper key={item.id} withBorder p="md">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4}>
                    <Text size="xs" c="dimmed">
                      {item.id}
                    </Text>
                    <Anchor
                      component={Link}
                      href={`${basePath}/support/${item.id}`}
                      fw={600}
                    >
                      {item.summary}
                    </Anchor>
                    <Text size="sm">
                      {item.status === "Waiting for retest"
                        ? "Ghi nhận kết quả kiểm tra lại"
                        : "Bổ sung thông tin"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {item.nextAction}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            ))
          )}
        </Stack>
      </Stack>
    </PageFrame>
  );
}
