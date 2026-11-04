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
import { useMounted } from "@mantine/hooks";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";
import { usePortal } from "@/modules/portal/components/portal-provider";
import { forProject } from "@/modules/portal/lib/search";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import {
  ModuleTabs,
  ModuleTabPanel,
} from "@/modules/ui/components/module-tabs";
import { useId } from "react";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { selectFeatureQueue, statusFitsView } from "../lib/queue";
import {
  featureSearchParams,
  featureViews,
  featureSorts,
  featureStatusFilters,
  serializeFeatureQueue,
  type FeatureQueueQuery,
} from "../lib/search-params";
import { featureInView } from "../lib/state";
import { FeatureQueueRow } from "./feature-queue-row";
import { useFeatureCopy } from "./use-feature-copy";

export function FeatureList({ projectId }: { projectId: string }) {
  const tabsId = useId();
  const t = useTranslations("Features");
  const portal = useTranslations("Portal");
  const nav = useTranslations("Workspace");
  const copy = useFeatureCopy();
  const mounted = useMounted();
  const { features } = usePortal();
  const [query, setQuery] = useQueryStates(featureSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const mine = forProject(features, projectId);
  const base = `/projects/${projectId}/ideas/features`;
  const status = statusFitsView(query.status, query.view)
    ? query.status
    : "all";
  const effective = { ...query, status };
  const result = selectFeatureQueue(features, effective, projectId);
  const narrowed = Boolean(query.q.trim()) || status !== "all";
  const returnTo = serializeFeatureQueue(base, {
    ...effective,
    page: result.page,
  });
  const detailQuery = new URLSearchParams({ returnTo }).toString();
  const update = (patch: Partial<FeatureQueueQuery>) =>
    void setQuery({ ...patch, page: 1 });
  const clear = () => update({ q: "", status: "all" });
  const viewLabel = (view: FeatureQueueQuery["view"]) =>
    view === "open"
      ? t("tabOpen")
      : view === "closed"
        ? t("tabClosed")
        : t("tabAll");

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
            id={tabsId}
            ariaLabel={portal("views")}
            value={query.view}
            items={featureViews.map((view) => ({
              value: view,
              label: viewLabel(view),
              count: mine.filter((item) => featureInView(item, view)).length,
            }))}
            onChange={(value) => {
              const view = featureViews.find((item) => item === value);
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
      <ModuleTabPanel id={tabsId} value={query.view}>
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
            <TextInput
              disabled={!mounted}
              label={portal("search")}
              placeholder={t("searchPlaceholder")}
              leftSection={<IconSearch size={16} aria-hidden />}
              value={query.q}
              onChange={(event) => update({ q: event.currentTarget.value })}
            />
            <Select
              disabled={!mounted}
              label={t("statusFilter")}
              value={status}
              allowDeselect={false}
              data={featureStatusFilters
                .filter((item) => statusFitsView(item, query.view))
                .map((value) => ({
                  value,
                  label: value === "all" ? t("statusAll") : copy.status(value),
                }))}
              onChange={(value) => {
                const next = featureStatusFilters.find(
                  (item) => item === value,
                );
                if (next) update({ status: next });
              }}
            />
            <Select
              disabled={!mounted}
              label={t("sort")}
              value={query.sort}
              allowDeselect={false}
              data={featureSorts.map((value) => ({
                value,
                label:
                  value === "title-asc"
                    ? t("sortTitleAsc")
                    : t("sortTitleDesc"),
              }))}
              onChange={(value) => {
                const sort = featureSorts.find((item) => item === value);
                if (sort) update({ sort });
              }}
            />
          </SimpleGrid>
          <Group justify="space-between" mih={30}>
            <Text size="sm" c="dimmed" role="status">
              {t("resultCount", { count: result.total })}
            </Text>
            {narrowed ? (
              <Button variant="subtle" size="compact-sm" onClick={clear}>
                {t("clearFilters")}
              </Button>
            ) : null}
          </Group>
          {result.items.length ? (
            <Paper withBorder style={{ overflow: "hidden" }}>
              <Stack component="ul" gap={0} p={0} m={0} aria-label={t("title")}>
                {result.items.map((feature) => (
                  <FeatureQueueRow
                    key={feature.id}
                    feature={feature}
                    href={`${base}/${feature.id}?${detailQuery}`}
                  />
                ))}
              </Stack>
            </Paper>
          ) : (
            <Paper withBorder p="xl">
              <Stack align="center" gap="sm">
                <Text>
                  {mine.length === 0
                    ? t("emptyAll")
                    : narrowed
                      ? t("noMatches")
                      : query.view === "closed"
                        ? t("emptyClosed")
                        : query.view === "open"
                          ? t("emptyOpen")
                          : t("emptyAll")}
                </Text>
                {mine.length === 0 ? (
                  <Button component={Link} href={`${base}/new?${detailQuery}`}>
                    {t("new")}
                  </Button>
                ) : narrowed ? (
                  <Button variant="default" onClick={clear}>
                    {t("clearFilters")}
                  </Button>
                ) : query.view !== "all" ? (
                  <Button
                    variant="default"
                    onClick={() => update({ view: "all", status: "all" })}
                  >
                    {t("viewAll")}
                  </Button>
                ) : null}
              </Stack>
            </Paper>
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
                  "aria-label":
                    control === "next"
                      ? t("nextPage")
                      : control === "previous"
                        ? t("previousPage")
                        : undefined,
                })}
              />
            </Group>
          ) : null}
        </Stack>
      </ModuleTabPanel>
    </PageFrame>
  );
}
