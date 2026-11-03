"use client";

import { useQueryStates } from "nuqs";
import { useTranslations } from "next-intl";

import { forProject, includesQuery } from "@/modules/portal/lib/search";
import { usePortal } from "@/modules/portal/components/portal-provider";
import { getApplication } from "@/modules/projects/lib/applications";
import { recordTrail } from "@/modules/projects/lib/record-trail";
import { ProjectUnavailable } from "@/modules/ui/components/project-unavailable";
import { RecordCollection } from "@/modules/ui/components/record-collection";

import {
  bugSearchParams,
  bugSeverityFilters,
  bugSeverityOperators,
  bugViews,
  type BugSeverityFilter,
  type BugSeverityOperator,
  type BugView,
} from "../lib/search-params";
import {
  bugInView,
  bugMatchesSeverity,
  bugSeverities,
  compareBugSeverity,
} from "../lib/state";

import { useBugCopy } from "./use-bug-copy";

export function BugList({ projectId }: { projectId: string }) {
  const t = useTranslations("Bugs");
  const nav = useTranslations("Workspace");
  const copy = useBugCopy();
  const { bugs } = usePortal();
  const [{ q, view, severity, severityOp }, setQuery] =
    useQueryStates(bugSearchParams);
  const application = getApplication(projectId);
  if (!application) return <ProjectUnavailable />;

  const mine = forProject(bugs, projectId);
  const base = `/projects/${projectId}/support/bugs`;
  const rows = mine
    .filter(
      (item) =>
        bugInView(item, view) &&
        matchesSeverity(item, severity, severityOp) &&
        includesQuery(q, [
          item.title,
          item.happened,
          item.steps,
          item.environment,
          item.correlationId,
          item.pageUrl,
          item.id,
        ]),
    )
    .sort(compareBugSeverity);

  return (
    <RecordCollection
      title={t("title")}
      breadcrumbs={recordTrail(application, nav("projects"), [
        { title: t("title"), href: base },
      ])}
      createHref={`${base}/new`}
      createLabel={t("new")}
      query={q}
      onQueryChange={(value) => void setQuery({ q: value })}
      filterLabel={copy.portal("severity")}
      filterValue={severity}
      filterOperator={severityOp}
      filterOptions={[
        { value: "all", label: t("severityAll") },
        ...bugSeverities.map((item) => ({
          value: item,
          label: copy.severity(item),
        })),
      ]}
      onFilterChange={(value, operator) => {
        if (!isBugSeverityFilter(value) || value === "all") {
          void setQuery({ severity: "all", severityOp: "is" });
          return;
        }
        if (!isBugSeverityOperator(operator)) return;
        void setQuery({ severity: value, severityOp: operator });
      }}
      filterActive={severity !== "all"}
      onClearFilters={() =>
        void setQuery({ q: "", severity: "all", severityOp: "is" })
      }
      narrowActionLabel={severity !== "all" ? t("clearFilter") : undefined}
      views={[
        {
          value: "open",
          label: t("tabOpen"),
          count: mine.filter((item) => bugInView(item, "open")).length,
        },
        {
          value: "resolved",
          label: t("tabResolved"),
          count: mine.filter((item) => bugInView(item, "resolved")).length,
        },
      ]}
      view={view}
      onViewChange={(value) => {
        if (isBugView(value)) void setQuery({ view: value });
      }}
      rows={rows.map((item) => ({
        id: item.id,
        href: `${base}/${item.id}`,
        title: item.title,
        meta: `${item.id} · ${copy.severity(item.severity)}`,
        status: copy.status(item.status),
      }))}
      emptyTitle={view === "resolved" ? t("emptyResolved") : t("emptyOpen")}
      emptyActionLabel={t("new")}
    />
  );
}

function matchesSeverity(
  bug: Parameters<typeof bugMatchesSeverity>[0],
  severity: BugSeverityFilter,
  operator: BugSeverityOperator,
) {
  if (severity === "all") return true;
  const same = bugMatchesSeverity(bug, severity);
  switch (operator) {
    case "is":
      return same;
    case "isNot":
      return !same;
    default: {
      const neverOperator: never = operator;
      return neverOperator;
    }
  }
}

function isBugView(value: string): value is BugView {
  return (bugViews as readonly string[]).includes(value);
}

function isBugSeverityOperator(value: string): value is BugSeverityOperator {
  return (bugSeverityOperators as readonly string[]).includes(value);
}

function isBugSeverityFilter(value: string): value is BugSeverityFilter {
  return (bugSeverityFilters as readonly string[]).includes(value);
}
