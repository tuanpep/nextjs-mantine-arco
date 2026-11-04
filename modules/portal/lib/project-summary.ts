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
