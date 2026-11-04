import { bugInView, compareBugSeverity } from "@/modules/bug-reports/lib/state";
import { featureInView } from "@/modules/feature-requests/lib/state";
import { feedbackInView } from "@/modules/feedback/lib/state";
import { helpInView } from "@/modules/help/lib/state";

import type { PortalState } from "./seed";
import {
  sessionKinds,
  sessionRows,
  type SessionKind,
  type SessionRow,
} from "./session-rows";

export type ProjectSummary = {
  kind: SessionKind;
  count: number;
  href: string;
  records: SessionRow[];
};

export function projectAttention(
  projectId: string,
  source: PortalState,
  locale: string,
) {
  const collator = new Intl.Collator(locale);
  const bugs = source.bugs
    .filter((bug) => bug.projectId === projectId && bugInView(bug, "open"))
    .sort(
      (a, b) =>
        compareBugSeverity(a, b) ||
        collator.compare(a.title, b.title) ||
        a.id.localeCompare(b.id, "en"),
    );
  return {
    bugs: bugs.slice(0, 5).map(({ id, title, severity, status }) => ({
      id,
      title,
      href: `/projects/${projectId}/support/bugs/${id}`,
      severity,
      status,
    })),
    bugCount: bugs.length,
    helpCount: source.help.filter(
      (item) => item.projectId === projectId && helpInView(item, "open"),
    ).length,
    featureCount: source.features.filter(
      (item) => item.projectId === projectId && featureInView(item, "open"),
    ).length,
    feedbackCount: source.feedback.filter(
      (item) => item.projectId === projectId && feedbackInView(item, "open"),
    ).length,
  };
}

export function projectSummaries(
  projectId: string,
  source: PortalState,
  locale: string,
): ProjectSummary[] {
  const rows = sessionRows(projectId, source);
  const base = `/projects/${projectId}`;
  const paths: Record<SessionKind, string> = {
    bug: "support/bugs?view=open",
    help: "support/help?view=open",
    feature: "ideas/features?view=open",
    feedback: "ideas/feedback?view=open",
    guide: "guides",
    discussion: "discussions",
  };
  const collator = new Intl.Collator(locale);
  return sessionKinds.map((kind) => {
    const records = rows.filter(
      (row) => row.kind === kind && (!("active" in row) || row.active),
    );
    records.sort(
      (a, b) =>
        collator.compare(a.title, b.title) || a.id.localeCompare(b.id, "en"),
    );
    return {
      kind,
      count: records.length,
      href: `${base}/${paths[kind]}`,
      records: records.slice(0, 3),
    };
  });
}
