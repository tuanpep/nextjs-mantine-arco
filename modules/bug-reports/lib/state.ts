import { isImagePreviewUrl, type BugAttachment } from "./attachments";
import {
  bugSeverity,
  isImpactScope,
  isUrgency,
  type ImpactScope,
  type Urgency,
} from "./intake";

export const bugSeverities = ["Low", "Medium", "High", "Critical"] as const;
export type BugSeverity = (typeof bugSeverities)[number];
export const bugStatuses = [
  "Open",
  "In progress",
  "Waiting for reporter",
  "Resolved",
] as const;
export type BugStatus = (typeof bugStatuses)[number];
export type BugNoteAction = "start" | "resolve" | "reopen" | "wait" | "resume";

export const bugTextLimits = {
  title: 160,
  happened: 10000,
  steps: 10000,
  expected: 10000,
  environment: 500,
  correlationId: 500,
  impactDetail: 10000,
  pageUrl: 2048,
} as const;

export function validateBugText(
  value: string,
  limit: number,
  required = true,
): "required" | "tooLong" | null {
  const text = value.trim();
  if (!text && required) return "required";
  return text.length > limit ? "tooLong" : null;
}

export type BugReport = {
  id: string;
  projectId: string;
  title: string;
  happened: string;
  steps: string;
  reproduction: "known" | "unknown";
  expected: string;
  environment: string;
  correlationId: string;
  impactDetail: string;
  pageUrl: string;
  attachments: BugAttachment[];
  impactScope: ImpactScope;
  urgency: Urgency;
  severity: BugSeverity;
  status: BugStatus;
  notes: { action: BugNoteAction; text: string; order: number }[];
  messages: {
    id: string;
    text: string;
    order: number;
    resumedFromWaiting: boolean;
  }[];
};

export type BugDraft = {
  projectId: string;
  title: string;
  happened: string;
  steps: string;
  reproduction?: "known" | "unknown";
  expected: string;
  environment: string;
  correlationId: string;
  impactDetail: string;
  pageUrl: string;
  attachments: BugAttachment[];
  impactScope: string;
  urgency: string;
};

export type BugTransition =
  | { kind: "start"; note: string }
  | { kind: "resolve"; note: string }
  | { kind: "wait"; note: string }
  | { kind: "resume"; note: string }
  | { kind: "reopen"; note: string };

export function isBugSeverity(value: string): value is BugSeverity {
  return (bugSeverities as readonly string[]).includes(value);
}

export function createBugReport(id: string, draft: BugDraft): BugReport | null {
  const title = draft.title.trim();
  const happened = draft.happened.trim();
  const reproduction = draft.reproduction ?? "known";
  if (reproduction !== "known" && reproduction !== "unknown") return null;
  const steps = reproduction === "unknown" ? "" : draft.steps.trim();
  const expected = draft.expected.trim();
  const environment = draft.environment.trim();
  const pageUrl = draft.pageUrl.trim();
  if (
    validateBugText(title, bugTextLimits.title) ||
    validateBugText(happened, bugTextLimits.happened) ||
    validateBugText(steps, bugTextLimits.steps, reproduction === "known") ||
    validateBugText(expected, bugTextLimits.expected) ||
    validateBugText(environment, bugTextLimits.environment, false) ||
    validateBugText(draft.correlationId, bugTextLimits.correlationId, false) ||
    validateBugText(draft.impactDetail, bugTextLimits.impactDetail, false) ||
    validateBugText(pageUrl, bugTextLimits.pageUrl, false)
  )
    return null;
  if (pageUrl && !isPageUrl(pageUrl)) return null;
  if (!isImpactScope(draft.impactScope) || !isUrgency(draft.urgency))
    return null;
  if (draft.attachments.length > 5) return null;
  if (
    draft.attachments.some(
      (file) => !file.name.trim() || !file.sizeLabel.trim(),
    )
  )
    return null;
  return {
    id,
    projectId: draft.projectId,
    title,
    happened,
    steps,
    reproduction,
    expected,
    environment,
    correlationId: draft.correlationId.trim(),
    impactDetail: draft.impactDetail.trim(),
    pageUrl,
    attachments: draft.attachments.map((file) => keptAttachment(file)),
    impactScope: draft.impactScope,
    urgency: draft.urgency,
    severity: bugSeverity(draft.impactScope, draft.urgency),
    status: "Open",
    notes: [],
    messages: [],
  };
}

function keptAttachment(file: BugAttachment): BugAttachment {
  const attachment: BugAttachment = {
    name: file.name.trim(),
    sizeLabel: file.sizeLabel.trim(),
  };
  const previewUrl = file.previewUrl?.trim() ?? "";
  if (isImagePreviewUrl(previewUrl)) attachment.previewUrl = previewUrl;
  return attachment;
}

export function isPageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function addBugMessage(
  bug: BugReport,
  id: string,
  text: string,
): BugReport | null {
  const message = text.trim();
  if (validateBugText(message, 10000)) return null;
  const resumedFromWaiting = bug.status === "Waiting for reporter";
  return {
    ...bug,
    status: resumedFromWaiting ? "Open" : bug.status,
    messages: [
      ...bug.messages,
      { id, text: message, order: nextOrder(bug), resumedFromWaiting },
    ],
  };
}

export function bugActions(status: BugStatus): BugTransition["kind"][] {
  switch (status) {
    case "Open":
      return ["start", "wait", "resolve"];
    case "In progress":
      return ["wait", "resolve"];
    case "Waiting for reporter":
      return ["resume", "resolve"];
    case "Resolved":
      return ["reopen"];
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

export function bugInView(bug: BugReport, view: "open" | "resolved"): boolean {
  switch (view) {
    case "open":
      return bug.status !== "Resolved";
    case "resolved":
      return bug.status === "Resolved";
    default: {
      const neverView: never = view;
      return neverView;
    }
  }
}

export function bugMatchesSeverity(
  bug: BugReport,
  severity: BugSeverity | "all",
): boolean {
  switch (severity) {
    case "all":
      return true;
    case "Low":
    case "Medium":
    case "High":
    case "Critical":
      return bug.severity === severity;
    default: {
      const neverSeverity: never = severity;
      return neverSeverity;
    }
  }
}

/** Critical first, so the urgent reports stay at the top of a mixed list. */
export function compareBugSeverity(left: BugReport, right: BugReport): number {
  return severityRank(left.severity) - severityRank(right.severity);
}

function severityRank(severity: BugSeverity): number {
  switch (severity) {
    case "Critical":
      return 0;
    case "High":
      return 1;
    case "Medium":
      return 2;
    case "Low":
      return 3;
    default: {
      const neverSeverity: never = severity;
      return neverSeverity;
    }
  }
}

export function applyBugTransition(
  bug: BugReport,
  action: BugTransition,
): BugReport | null {
  const text = action.note.trim();
  if (validateBugText(text, 10000)) return null;
  switch (action.kind) {
    case "start":
      if (bug.status !== "Open") return null;
      return append(bug, "In progress", "start", text);
    case "resolve":
      if (bug.status === "Resolved") return null;
      return append(bug, "Resolved", "resolve", text);
    case "wait":
      if (bug.status !== "Open" && bug.status !== "In progress") return null;
      return append(bug, "Waiting for reporter", "wait", text);
    case "resume":
      if (bug.status !== "Waiting for reporter") return null;
      return append(bug, "Open", "resume", text);
    case "reopen":
      if (bug.status !== "Resolved") return null;
      return append(bug, "Open", "reopen", text);
    default: {
      const neverAction: never = action;
      return neverAction;
    }
  }
}

function append(
  bug: BugReport,
  status: BugStatus,
  action: BugNoteAction,
  text: string,
): BugReport {
  return {
    ...bug,
    status,
    notes: [...bug.notes, { action, text, order: nextOrder(bug) }],
  };
}

function nextOrder(bug: BugReport): number {
  return (
    Math.max(
      0,
      ...bug.notes.map((note) => note.order),
      ...bug.messages.map((message) => message.order),
    ) + 1
  );
}
