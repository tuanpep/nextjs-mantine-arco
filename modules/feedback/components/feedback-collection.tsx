"use client";

import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconMessageCircle, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";

import { getApplication } from "@/modules/projects/lib/applications";
import { CollectionEmpty } from "@/modules/ui/components/collection-empty";
import { CollectionToolbar } from "@/modules/ui/components/collection-toolbar";
import { DestinationUnavailable } from "@/modules/ui/components/destination-unavailable";
import { ModuleTabs } from "@/modules/ui/components/module-tabs";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { feedbackItems, type FeedbackDisposition } from "../lib/fixtures";
import { feedbackSearchParams, type FeedbackView } from "../lib/search-params";

const needsReview: FeedbackDisposition[] = [
  "Not reviewed",
  "Needs clarification",
];
const acknowledged: FeedbackDisposition[] = ["Acknowledged", "Noted"];

function matchesView(disposition: FeedbackDisposition, view: FeedbackView) {
  if (view === "all") return true;
  if (view === "needs-review") return needsReview.includes(disposition);
  return acknowledged.includes(disposition);
}

export function FeedbackCollection({ projectId }: { projectId: string }) {
  const application = getApplication(projectId);
  const [filters, setFilters] = useQueryStates(feedbackSearchParams);

  if (!application) {
    return (
      <PageFrame>
        <DestinationUnavailable backHref="/" backLabel="Back to projects" />
      </PageFrame>
    );
  }

  const scoped = feedbackItems.filter((item) => item.projectId === projectId);
  const needsReviewCount = scoped.filter((item) =>
    needsReview.includes(item.disposition),
  ).length;
  const acknowledgedCount = scoped.filter((item) =>
    acknowledged.includes(item.disposition),
  ).length;
  const visible = scoped.filter(
    (item) =>
      matchesView(item.disposition, filters.view) &&
      `${item.title} ${item.observation}`
        .toLowerCase()
        .includes(filters.q.trim().toLowerCase()),
  );

  return (
    <PageFrame
      header={
        <PageHeader
          title="Feedback"
          breadcrumbs={[
            { title: "Overview", href: `/projects/${projectId}` },
            { title: "Feedback", href: `/projects/${projectId}/feedback` },
          ]}
          actions={
            <Button
              component={Link}
              href={`/projects/${projectId}/feedback/new`}
              leftSection={<IconPlus size={16} />}
            >
              Share feedback
            </Button>
          }
        >
          <ModuleTabs
            ariaLabel="Feedback views"
            value={filters.view}
            onChange={(value) => {
              const view = feedbackSearchParams.view.parse(value);
              void setFilters({ view: view ?? "needs-review" });
            }}
            items={[
              {
                value: "needs-review",
                label: "Needs review",
                count: needsReviewCount,
              },
              {
                value: "acknowledged",
                label: "Acknowledged",
                count: acknowledgedCount,
              },
              { value: "all", label: "All", count: scoped.length },
            ]}
          />
        </PageHeader>
      }
    >
      <Paper withBorder style={{ overflow: "hidden" }}>
        <CollectionToolbar
          searchLabel="Search feedback"
          searchPlaceholder="Search by title or observation"
          searchValue={filters.q}
          onSearchChange={(value) => void setFilters({ q: value })}
          countLabel={`${visible.length} observations`}
        />
        {visible.length === 0 ? (
          <CollectionEmpty
            icon={<IconMessageCircle />}
            title="No matching feedback"
            actionLabel="Clear search"
            onAction={() => void setFilters({ q: "" })}
          />
        ) : (
          visible.map((item) => (
            <Box
              key={item.id}
              component={Link}
              href={`/projects/${projectId}/feedback/${item.id}`}
              px="md"
              py="sm"
              display="block"
              c="inherit"
              td="none"
              style={{
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {item.id}
                </Text>
                <Badge variant="light" color="gray">
                  {item.disposition}
                </Badge>
              </Group>
              <Title order={2} size="sm" mt={4}>
                {item.title}
              </Title>
              <Tooltip label={item.observation} multiline maw={360}>
                <Text size="sm" mt={4} lineClamp={2}>
                  {item.observation}
                </Text>
              </Tooltip>
              <Text size="xs" c="dimmed" mt={6}>
                Next actor: {item.nextActor}
              </Text>
            </Box>
          ))
        )}
      </Paper>
    </PageFrame>
  );
}
