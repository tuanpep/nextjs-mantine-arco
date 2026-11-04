import { bugInView, type BugStatus } from "@/modules/bug-reports/lib/state";
import {
  featureInView,
  type FeatureStatus,
} from "@/modules/feature-requests/lib/state";
import {
  feedbackInView,
  type FeedbackStatus,
} from "@/modules/feedback/lib/state";
import { helpInView, type HelpStatus } from "@/modules/help/lib/state";

import type { PortalState } from "./seed";

export const sessionKinds = [
  "bug",
  "help",
  "feature",
  "feedback",
  "guide",
  "discussion",
] as const;

export type SessionKind = (typeof sessionKinds)[number];

type SessionRowBase = {
  id: string;
  projectId: string;
  title: string;
  href: string;
};

export type SessionRow = SessionRowBase &
  (
    | { kind: "bug"; status: BugStatus; active: boolean }
    | { kind: "help"; status: HelpStatus; active: boolean }
    | { kind: "feature"; status: FeatureStatus; active: boolean }
    | { kind: "feedback"; status: FeedbackStatus; active: boolean }
    | { kind: "guide" }
    | { kind: "discussion" }
  );

export function sessionRows(
  projectId: string,
  source: PortalState,
): SessionRow[] {
  const base = (
    record: { id: string; projectId: string },
    title: string,
    section: string,
  ) => ({
    id: record.id,
    projectId: record.projectId,
    title,
    href: `/projects/${projectId}/${section}/${record.id}`,
  });
  return [
    ...source.bugs
      .filter((item) => item.projectId === projectId)
      .map((item) => ({
        ...base(item, item.title, "support/bugs"),
        kind: "bug" as const,
        status: item.status,
        active: bugInView(item, "open"),
      })),
    ...source.help
      .filter((item) => item.projectId === projectId)
      .map((item) => ({
        ...base(item, item.question, "support/help"),
        kind: "help" as const,
        status: item.status,
        active: helpInView(item, "open"),
      })),
    ...source.features
      .filter((item) => item.projectId === projectId)
      .map((item) => ({
        ...base(item, item.title, "ideas/features"),
        kind: "feature" as const,
        status: item.status,
        active: featureInView(item, "open"),
      })),
    ...source.feedback
      .filter((item) => item.projectId === projectId)
      .map((item) => ({
        ...base(item, item.title, "ideas/feedback"),
        kind: "feedback" as const,
        status: item.status,
        active: feedbackInView(item, "open"),
      })),
    ...source.guides
      .filter((item) => item.projectId === projectId)
      .map((item) => ({
        ...base(item, item.title, "guides"),
        kind: "guide" as const,
      })),
    ...source.discussions
      .filter((item) => item.projectId === projectId)
      .map((item) => ({
        ...base(item, item.title, "discussions"),
        kind: "discussion" as const,
      })),
  ];
}
