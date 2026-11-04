"use client";

import {
  Avatar,
  Box,
  Button,
  Group,
  NativeSelect,
  Pagination,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { usePortal } from "@/modules/portal/components/portal-provider";
import { sessionKinds, sessionRows } from "@/modules/portal/lib/session-rows";
import { CollectionEmpty } from "@/modules/ui/components/collection-empty";
import { CollectionToolbar } from "@/modules/ui/components/collection-toolbar";
import { PageFrame } from "@/modules/ui/components/page-frame";
import { PageHeader } from "@/modules/ui/components/page-header";

import { applicationPath, applications } from "../lib/applications";
import { workspaceSearchParams } from "../lib/search-params";
import { selectSessionRecords } from "../lib/session-records";

import { SessionRecordList } from "./session-record-list";

const kindKeys = {
  bug: "bugReports",
  help: "help",
  feature: "featureRequests",
  feedback: "feedback",
  guide: "guides",
  discussion: "discussions",
} as const;

export function HomeScreen() {
  const t = useTranslations("Workspace");
  const copy = useTranslations("Portal");
  const locale = useLocale();
  const portal = usePortal();
  const [query, setQuery] = useQueryStates(workspaceSearchParams, {
    history: "push",
  });
  const rows = applications.flatMap((project) =>
    sessionRows(project.id, portal),
  );
  const result = selectSessionRecords(rows, query, locale);
  const recent = portal.recentRecords.flatMap((reference) => {
    const row = rows.find(
      (item) =>
        item.projectId === reference.projectId &&
        item.kind === reference.kind &&
        item.id === reference.id,
    );
    return row ? [row] : [];
  });
  const filtered =
    Boolean(query.recordsQ.trim()) ||
    result.project !== "all" ||
    query.recordsKind !== "all";
  const clear = () => {
    void setQuery({
      recordsQ: "",
      recordsProject: "all",
      recordsKind: "all",
      recordsPage: 1,
    });
  };

  return (
    <PageFrame header={<PageHeader title={t("projects")} />}>
      <Stack gap="xl">
        <Paper withBorder style={{ overflow: "hidden" }}>
          {applications.map((application, index) => (
            <Box
              key={application.id}
              component={Link}
              href={applicationPath(application.id)}
              px="md"
              py="sm"
              display="block"
              c="inherit"
              td="none"
              style={{
                borderTop:
                  index > 0
                    ? "1px solid var(--mantine-color-default-border)"
                    : undefined,
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                  <Avatar color="blue" size={36}>
                    {application.initials}
                  </Avatar>
                  <Box style={{ minWidth: 0 }}>
                    <Text fw={600} size="sm" truncate>
                      {application.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {t(application.descriptionKey)} · {application.owner}
                    </Text>
                  </Box>
                </Group>
                <IconChevronRight
                  size={16}
                  aria-hidden
                  color="var(--mantine-color-dimmed)"
                />
              </Group>
            </Box>
          ))}
        </Paper>
        {recent.length > 0 && (
          <Stack
            component="section"
            aria-labelledby="recent-records-title"
            gap="sm"
          >
            <Title id="recent-records-title" order={2} size="h4">
              {t("recentlyOpened")}
            </Title>
            <Paper withBorder>
              <SessionRecordList rows={recent} />
            </Paper>
          </Stack>
        )}
        <Stack
          component="section"
          aria-labelledby="session-records-title"
          gap="sm"
        >
          <Title id="session-records-title" order={2} size="h4">
            {t("sessionRecords")}
          </Title>
          <Paper withBorder style={{ overflow: "hidden" }}>
            <CollectionToolbar
              searchLabel={t("recordSearch")}
              searchPlaceholder={t("recordSearch")}
              searchValue={query.recordsQ}
              onSearchChange={(value) => {
                void setQuery({ recordsQ: value, recordsPage: 1 });
              }}
              countLabel={copy("count", { count: result.count })}
            />
            <Group px="sm" py="xs" align="flex-end" gap="sm">
              <NativeSelect
                label={t("project")}
                value={result.project}
                data={[
                  { value: "all", label: t("allProjects") },
                  ...applications.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })),
                ]}
                onChange={(event) => {
                  void setQuery({
                    recordsProject: event.currentTarget.value,
                    recordsPage: 1,
                  });
                }}
              />
              <NativeSelect
                label={t("recordType")}
                value={query.recordsKind}
                data={[
                  { value: "all", label: t("allTypes") },
                  ...sessionKinds.map((kind) => ({
                    value: kind,
                    label: t(kindKeys[kind]),
                  })),
                ]}
                onChange={(event) => {
                  const kind =
                    sessionKinds.find(
                      (item) => item === event.currentTarget.value,
                    ) ?? "all";
                  void setQuery({ recordsKind: kind, recordsPage: 1 });
                }}
              />
              {filtered && result.count > 0 && (
                <Button variant="subtle" onClick={clear}>
                  {copy("filterClear")}
                </Button>
              )}
            </Group>
            {result.count > 0 ? (
              <SessionRecordList rows={result.rows} />
            ) : filtered ? (
              <CollectionEmpty
                icon={<IconSearch size={20} />}
                title={copy("noMatches")}
                actionLabel={copy("filterClear")}
                onAction={clear}
              />
            ) : (
              <Text c="dimmed" p="md" size="sm">
                {t("emptyRecords")}
              </Text>
            )}
            {result.pages > 1 && (
              <Pagination
                p="sm"
                aria-label={t("recordsPagination")}
                total={result.pages}
                value={result.page}
                getControlProps={(control) => ({
                  "aria-label": t(
                    control === "previous" ? "previousPage" : "nextPage",
                  ),
                })}
                getItemProps={(page) => ({
                  "aria-label": t("recordPage", { page }),
                })}
                onChange={(page) => {
                  void setQuery({ recordsPage: page });
                }}
              />
            )}
          </Paper>
        </Stack>
      </Stack>
    </PageFrame>
  );
}
