"use client";

import {
  Anchor,
  Badge,
  Button,
  Group,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useFormatter, useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { ModuleTabs } from "@/modules/ui/components/module-tabs";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";

import { selectDiscussionQueue } from "../lib/queue";
import {
  discussionSearchParams,
  discussionSorts,
  discussionViews,
  serializeDiscussionQueue,
} from "../lib/search-params";
import { DEMO_AUTHOR } from "../lib/state";

export function DiscussionList({ projectId }: { projectId: string }) {
  const t = useTranslations("Discussions");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const format = useFormatter();
  const { discussions } = usePortal();
  const [query, setQuery] = useQueryStates(discussionSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;
  const base = `/projects/${projectId}/discussions`;
  const mine = discussions.filter((item) => item.projectId === projectId);
  const result = selectDiscussionQueue(discussions, projectId, query);
  const narrowed = Boolean(query.q.trim()) || query.view !== "all";
  const linkTo = (path: string) =>
    serializeDiscussionQueue(path, { ...query, page: result.page });

  return (
    <PageFrame
      header={
        <PageHeader
          title={t("title")}
          breadcrumbs={recordTrail(application, nav("projects"), [
            { title: t("title"), href: base },
          ])}
          actions={
            <Button component={Link} href={linkTo(`${base}/new`)}>
              {t("new")}
            </Button>
          }
        >
          <ModuleTabs
            ariaLabel={portal("views")}
            value={query.view}
            items={discussionViews.map((view) => ({
              value: view,
              label: t(view),
              count: mine.filter(
                (item) => view === "all" || item.replies.length === 0,
              ).length,
            }))}
            onChange={(value) => {
              const view = discussionViews.find((entry) => entry === value);
              if (view) void setQuery({ view, page: 1 });
            }}
          />
        </PageHeader>
      }
    >
      <Stack gap="md">
        <Group align="flex-end">
          <TextInput
            style={{ flex: 1, minWidth: 180 }}
            label={portal("search")}
            placeholder={t("searchPlaceholder")}
            leftSection={<IconSearch size={16} aria-hidden />}
            value={query.q}
            onChange={(event) =>
              void setQuery({ q: event.currentTarget.value, page: 1 })
            }
          />
          <Select
            label={t("sort")}
            value={query.sort}
            allowDeselect={false}
            data={discussionSorts.map((sort) => ({
              value: sort,
              label: t(sort),
            }))}
            onChange={(value) => {
              const sort = discussionSorts.find((entry) => entry === value);
              if (sort) void setQuery({ sort, page: 1 });
            }}
          />
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed" role="status">
            {t("resultCount", { count: result.total })}
          </Text>
          {narrowed && (
            <Button
              variant="subtle"
              size="compact-sm"
              onClick={() => void setQuery({ q: "", view: "all", page: 1 })}
            >
              {t("clearFilters")}
            </Button>
          )}
        </Group>
        {result.items.length ? (
          <Paper withBorder>
            <Stack component="ul" aria-label={t("title")} gap={0} m={0} p={0}>
              {result.items.map((item) => (
                <Stack
                  component="li"
                  key={item.id}
                  gap="xs"
                  p="md"
                  style={{
                    listStyle: "none",
                    borderBottom:
                      "1px solid var(--mantine-color-default-border)",
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Anchor
                      component={Link}
                      href={linkTo(`${base}/${item.id}`)}
                      fw={600}
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {item.title}
                    </Anchor>
                    <Badge
                      variant="light"
                      color={item.replies.length ? "gray" : "blue"}
                    >
                      {item.replies.length
                        ? t("replyCount", { count: item.replies.length })
                        : t("unanswered")}
                    </Badge>
                  </Group>
                  <Text
                    size="sm"
                    c="dimmed"
                    lineClamp={2}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {item.body}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {item.author === DEMO_AUTHOR ? portal("you") : item.author}{" "}
                    ·{" "}
                    {t("lastActivity", {
                      date: format.dateTime(new Date(item.updatedAt), {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }),
                    })}
                  </Text>
                </Stack>
              ))}
            </Stack>
          </Paper>
        ) : (
          <Paper withBorder p="xl">
            <Stack align="center">
              <Text fw={600}>{narrowed ? t("noMatches") : t("empty")}</Text>
              {narrowed ? (
                <Button
                  variant="light"
                  onClick={() => void setQuery({ q: "", view: "all", page: 1 })}
                >
                  {t("clearFilters")}
                </Button>
              ) : (
                <Button component={Link} href={`${base}/new`}>
                  {t("new")}
                </Button>
              )}
            </Stack>
          </Paper>
        )}
        {result.pages > 1 && (
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {t("pageOf", { page: result.page, pages: result.pages })}
            </Text>
            <Pagination
              total={result.pages}
              value={result.page}
              onChange={(page) => void setQuery({ page })}
              getControlProps={(control) => ({
                "aria-label": t(
                  control === "next"
                    ? "nextPage"
                    : control === "previous"
                      ? "previousPage"
                      : control === "first"
                        ? "firstPage"
                        : "lastPage",
                ),
              })}
            />
          </Group>
        )}
      </Stack>
    </PageFrame>
  );
}
