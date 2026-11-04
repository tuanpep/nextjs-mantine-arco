"use client";

import {
  Button,
  Group,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { forProject } from "@/modules/portal/lib/search";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { ModuleTabs } from "@/modules/ui/components/module-tabs";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";

import { bugMatchesView, selectBugQueue, statusFitsView } from "../lib/queue";
import {
  bugSearchParams,
  bugSeverityFilters,
  bugSorts,
  bugStatusFilters,
  bugViews,
  serializeBugQueue,
  type BugQueueQuery,
} from "../lib/search-params";
import { bugSeverities } from "../lib/state";
import { BugQueueRow } from "./bug-queue-row";
import { BugQueueEmpty } from "./bug-queue-empty";
import { useBugCopy } from "./use-bug-copy";

export function BugList({ projectId }: { projectId: string }) {
  const t = useTranslations("Bugs");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const copy = useBugCopy();
  const { bugs } = usePortal();
  const [query, setQuery] = useQueryStates(bugSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const mine = forProject(bugs, projectId);
  const base = `/projects/${projectId}/support/bugs`;
  const status = statusFitsView(query.status, query.view)
    ? query.status
    : "all";
  const effective = { ...query, status };
  const result = selectBugQueue(mine, effective);
  const narrowed =
    Boolean(query.q.trim()) || query.severity !== "all" || status !== "all";
  const returnTo = serializeBugQueue(base, { ...effective, page: result.page });
  const detailQuery = new URLSearchParams({ returnTo }).toString();
  const viewLabel = (view: BugQueueQuery["view"]) =>
    view === "open"
      ? t("tabOpen")
      : view === "resolved"
        ? t("tabResolved")
        : t("tabAll");
  const sortLabel = (sort: BugQueueQuery["sort"]) =>
    sort === "title"
      ? t("sortTitle")
      : sort === "severity-asc"
        ? t("sortSeverityAsc")
        : t("sortSeverityDesc");
  const update = (patch: Partial<BugQueueQuery>) =>
    void setQuery({ ...patch, page: 1 });

  return (
    <PageFrame
      header={
        <PageHeader
          title={t("title")}
          breadcrumbs={recordTrail(application, nav("projects"), [
            { title: t("title"), href: base },
          ])}
          actions={
            <Button component={Link} href={`${base}/new?${detailQuery}`}>
              {t("new")}
            </Button>
          }
        >
          <ModuleTabs
            ariaLabel={portal("views")}
            value={query.view}
            items={bugViews.map((view) => ({
              value: view,
              label: viewLabel(view),
              count: mine.filter((bug) => bugMatchesView(bug, view)).length,
            }))}
            onChange={(value) => {
              const view = bugViews.find((item) => item === value);
              if (view)
                update({
                  view,
                  status: statusFitsView(status, view) ? status : "all",
                });
            }}
          />
        </PageHeader>
      }
    >
      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm">
          <TextInput
            label={portal("search")}
            placeholder={t("searchPlaceholder")}
            leftSection={<IconSearch size={16} aria-hidden />}
            value={query.q}
            onChange={(event) => update({ q: event.currentTarget.value })}
          />
          <Select
            label={t("statusFilter")}
            value={status}
            allowDeselect={false}
            data={bugStatusFilters
              .filter((item) => statusFitsView(item, query.view))
              .map((value) => ({
                value,
                label: value === "all" ? t("statusAll") : copy.status(value),
              }))}
            onChange={(value) => {
              const next = bugStatusFilters.find((item) => item === value);
              if (next) update({ status: next });
            }}
          />
          <Select
            label={portal("severity")}
            value={query.severity}
            allowDeselect={false}
            data={[
              { value: "all", label: t("severityAll") },
              ...bugSeverities.map((value) => ({
                value,
                label: copy.severity(value),
              })),
            ]}
            onChange={(value) => {
              const severity = bugSeverityFilters.find(
                (item) => item === value,
              );
              if (severity) update({ severity, severityOp: "is" });
            }}
          />
          <Select
            label={t("sort")}
            value={query.sort}
            allowDeselect={false}
            data={bugSorts.map((value) => ({ value, label: sortLabel(value) }))}
            onChange={(value) => {
              const sort = bugSorts.find((item) => item === value);
              if (sort) update({ sort });
            }}
          />
        </SimpleGrid>
        {query.severity !== "all" && query.severityOp === "isNot" ? (
          <Text size="sm">
            {t("excludingSeverity", {
              severity: copy.severity(query.severity),
            })}
          </Text>
        ) : null}
        <Group justify="space-between" mih={30}>
          <Text size="sm" c="dimmed" role="status">
            {t("resultCount", { count: result.total })}
          </Text>
          {narrowed ? (
            <Button
              variant="subtle"
              size="compact-sm"
              onClick={() =>
                update({
                  q: "",
                  status: "all",
                  severity: "all",
                  severityOp: "is",
                })
              }
            >
              {t("clearFilter")}
            </Button>
          ) : null}
        </Group>
        {result.items.length ? (
          <Paper withBorder style={{ overflow: "hidden" }}>
            <Stack component="ul" gap={0} p={0} m={0} aria-label={t("title")}>
              {result.items.map((bug) => (
                <BugQueueRow
                  key={bug.id}
                  bug={bug}
                  query={query.q}
                  href={`${base}/${bug.id}?${detailQuery}`}
                />
              ))}
            </Stack>
          </Paper>
        ) : (
          <BugQueueEmpty
            view={query.view}
            narrowed={narrowed}
            hasReports={mine.length > 0}
            searching={Boolean(query.q.trim())}
            onClear={() =>
              update({
                q: "",
                status: "all",
                severity: "all",
                severityOp: "is",
              })
            }
            onView={(view) => update({ view, status: "all" })}
          />
        )}
        {result.pages > 1 ? (
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
        ) : null}
      </Stack>
    </PageFrame>
  );
}
