"use client";

import { useTranslations } from "next-intl";

import {
  impactScopes,
  urgencies,
  type ImpactScope,
  type Urgency,
} from "../lib/intake";
import type { BugSeverity, BugStatus } from "../lib/state";

export function useBugCopy() {
  const bugs = useTranslations("Bugs");
  const portal = useTranslations("Portal");

  return {
    bugs,
    portal,
    severity: (value: BugSeverity) => severityLabel(value, portal),
    status: (value: BugStatus) => statusLabel(value, portal, bugs),
    impact: (value: ImpactScope) => impactLabel(value, bugs),
    urgency: (value: Urgency) => urgencyLabel(value, bugs),
    impactOptions: impactScopes.map((value) => ({
      value,
      label: impactLabel(value, bugs),
    })),
    urgencyOptions: urgencies.map((value) => ({
      value,
      label: urgencyLabel(value, bugs),
    })),
  };
}

function severityLabel(
  value: BugSeverity,
  portal: ReturnType<typeof useTranslations<"Portal">>,
) {
  switch (value) {
    case "Low":
      return portal("severityLow");
    case "Medium":
      return portal("severityMedium");
    case "High":
      return portal("severityHigh");
    case "Critical":
      return portal("severityCritical");
    default: {
      const neverSeverity: never = value;
      return neverSeverity;
    }
  }
}

function statusLabel(
  value: BugStatus,
  portal: ReturnType<typeof useTranslations<"Portal">>,
  bugs: ReturnType<typeof useTranslations<"Bugs">>,
) {
  switch (value) {
    case "Open":
      return portal("statusOpen");
    case "In progress":
      return portal("statusInProgress");
    case "Resolved":
      return portal("statusResolved");
    case "Waiting for reporter":
      return bugs("statusWaiting");
    default: {
      const neverStatus: never = value;
      return neverStatus;
    }
  }
}

function impactLabel(
  value: ImpactScope,
  bugs: ReturnType<typeof useTranslations<"Bugs">>,
) {
  switch (value) {
    case "only-me":
      return bugs("impactOnlyMe");
    case "my-team":
      return bugs("impactMyTeam");
    case "several-teams":
      return bugs("impactSeveralTeams");
    case "whole-project":
      return bugs("impactWholeProject");
    case "unsure":
      return bugs("impactUnsure");
    default: {
      const neverScope: never = value;
      return neverScope;
    }
  }
}

function urgencyLabel(
  value: Urgency,
  bugs: ReturnType<typeof useTranslations<"Bugs">>,
) {
  switch (value) {
    case "can-wait":
      return bugs("urgencyCanWait");
    case "this-week":
      return bugs("urgencyThisWeek");
    case "today":
      return bugs("urgencyToday");
    case "stopped-now":
      return bugs("urgencyStoppedNow");
    case "unsure":
      return bugs("urgencyUnsure");
    default: {
      const neverUrgency: never = value;
      return neverUrgency;
    }
  }
}
