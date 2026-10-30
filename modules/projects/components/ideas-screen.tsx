"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { IconBulb, IconPlus, IconThumbUp } from "@tabler/icons-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useState } from "react";

import { CollectionEmpty } from "@/modules/ui/components/collection-empty";
import { CollectionToolbar } from "@/modules/ui/components/collection-toolbar";
import { ModuleTabs } from "@/modules/ui/components/module-tabs";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { seedIdeas, type Idea } from "../lib/idea-fixtures";
import { ideaSearchParams } from "../lib/idea-search-params";

const positionLabels: Record<Idea["position"], string> = {
  "Under review": "Đang xem xét",
  Received: "Đã tiếp nhận",
};

function matchesIdeaView(idea: Idea, view: string) {
  if (view === "under-review") return idea.position === "Under review";
  if (view === "voted") return idea.votedByMe;
  return true;
}

export function IdeasScreen({ projectId }: { projectId: string }) {
  const mounted = useMounted();
  const [filters, setFilters] = useQueryStates(ideaSearchParams);
  const [ideas, setIdeas] = useState<Idea[]>(seedIdeas);
  const underReviewCount = ideas.filter(
    (idea) => idea.position === "Under review",
  ).length;
  const votedCount = ideas.filter((idea) => idea.votedByMe).length;
  const visible = ideas.filter(
    (idea) =>
      matchesIdeaView(idea, filters.view) &&
      `${idea.title} ${idea.problem} ${idea.outcome}`
        .toLowerCase()
        .includes(filters.q.trim().toLowerCase()),
  );

  function toggleVote(id: string) {
    setIdeas((current) =>
      current.map((idea) => {
        if (idea.id !== id) return idea;
        if (idea.votedByMe) {
          return {
            ...idea,
            votedByMe: false,
            votes: Math.max(0, idea.votes - 1),
          };
        }
        return { ...idea, votedByMe: true, votes: idea.votes + 1 };
      }),
    );
  }

  return (
    <PageFrame
      header={
        <PageHeader
          title="Ý tưởng"
          breadcrumbs={[
            { title: "Tổng quan", href: `/projects/${projectId}` },
            { title: "Ý tưởng", href: `/projects/${projectId}/ideas` },
          ]}
          actions={
            <Button
              component={Link}
              href={`/projects/${projectId}/ideas/new`}
              leftSection={<IconPlus size={16} />}
            >
              Đề xuất ý tưởng
            </Button>
          }
        >
          <ModuleTabs
            ariaLabel="Chế độ xem ý tưởng"
            value={filters.view}
            onChange={(value) => {
              const view = ideaSearchParams.view.parse(value);
              void setFilters({ view: view ?? "all" });
            }}
            items={[
              { value: "all", label: "Tất cả", count: ideas.length },
              {
                value: "under-review",
                label: "Đang xem xét",
                count: underReviewCount,
              },
              { value: "voted", label: "Tôi đã bình chọn", count: votedCount },
            ]}
          />
        </PageHeader>
      }
    >
      <Paper withBorder style={{ overflow: "hidden" }}>
        <CollectionToolbar
          searchLabel="Tìm ý tưởng"
          searchPlaceholder="Tìm theo tiêu đề hoặc vấn đề"
          searchValue={filters.q}
          onSearchChange={(value) => void setFilters({ q: value })}
          countLabel={`${visible.length} ý tưởng`}
        />
        {visible.length === 0 ? (
          <CollectionEmpty
            icon={<IconBulb />}
            title="Không có ý tưởng phù hợp"
            actionLabel="Xóa tìm kiếm"
            onAction={() => void setFilters({ q: "" })}
          />
        ) : (
          visible.map((idea) => (
            <Box
              key={idea.id}
              px="md"
              py="sm"
              style={{
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Group justify="space-between" align="flex-start">
                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">
                      {idea.id}
                    </Text>
                    <Badge variant="light" color="violet">
                      {positionLabels[idea.position]}
                    </Badge>
                  </Group>
                  <Title order={2} size="sm">
                    {idea.title}
                  </Title>
                </Stack>
                <Stack gap="xs" align="flex-end">
                  <Text size="sm" fw={600}>
                    {idea.votes}
                  </Text>
                  <Tooltip
                    label={
                      idea.votedByMe
                        ? "Bỏ bình chọn"
                        : "Ý tưởng này hữu ích với tôi"
                    }
                  >
                    <ActionIcon
                      variant={idea.votedByMe ? "filled" : "light"}
                      aria-label={
                        idea.votedByMe
                          ? "Bỏ bình chọn"
                          : "Ý tưởng này hữu ích với tôi"
                      }
                      disabled={!mounted}
                      onClick={() => toggleVote(idea.id)}
                    >
                      <IconThumbUp size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Stack>
              </Group>
            </Box>
          ))
        )}
      </Paper>
    </PageFrame>
  );
}
