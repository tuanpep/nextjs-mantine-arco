import {
  sender,
  type Outcome,
  type SupportContext,
  type SupportRequest,
  type TriageDisposition,
} from "./fixtures";
import { misrouteTargetLabels, type MisrouteTarget } from "./intake-fields";
import { calculatePriority, priorities, type Priority } from "./priority";
import { getApplication } from "@/modules/projects/lib/applications";

function prioritiesIncludes(value: string): value is Priority {
  return (priorities as readonly string[]).includes(value);
}

export type SenderAction =
  | { kind: "comment"; text: string }
  | { kind: "reply"; text: string }
  | { kind: "retest"; result: "Pass" | "Fail" | "Unable"; text: string }
  | { kind: "reopen"; text: string }
  | { kind: "csat"; score: number };

export function createSupportRequest(
  id: string,
  context: SupportContext,
  applicationId: string | null = "beacon-portal",
): SupportRequest {
  const application =
    applicationId === null ? undefined : getApplication(applicationId);
  if (applicationId !== null && !application)
    throw new Error("Unknown application.");
  return {
    ...context,
    applicationId,
    responsibleTeam: application?.owner ?? "DX triage",
    summary: context.summary.trim(),
    situation: context.situation.trim(),
    expected: context.expected.trim(),
    impact: context.impact.trim(),
    environment: context.environment.trim(),
    reproSteps: context.reproSteps.trim(),
    correlationId: context.correlationId.trim(),
    requestType: context.requestType,
    impactScope: context.impactScope,
    urgency: context.urgency,
    attachments: context.attachments
      .filter((file) => file.status === "Ready")
      .map((file) => ({ ...file, status: "Ready" as const })),
    id,
    sender,
    status: "Unclaimed",
    handler: null,
    nextActor: "Responsible team",
    nextAction:
      "An eligible handler needs to review this request and take responsibility.",
    conversation: [],
    outcomes: [],
    priority: calculatePriority(context.impactScope, context.urgency),
    csat: null,
    lastDisposition: null,
    relatedRequestId: null,
    engTrackerId: null,
    autoClosePaused: false,
    misrouteTarget: null,
  };
}

export function applySenderAction(
  item: SupportRequest,
  action: SenderAction,
): SupportRequest {
  if (item.sender !== sender) return item;
  if (action.kind === "csat") {
    if (item.status !== "Resolved" || item.csat !== null) return item;
    if (action.score < 1 || action.score > 5) return item;
    return { ...item, csat: action.score };
  }
  const text = action.text.trim();
  if (action.kind === "comment") {
    if (item.status === "Resolved" || !text) return item;
    return {
      ...item,
      conversation: [...item.conversation, { author: sender, text }],
    };
  }
  if (
    action.kind === "reply" &&
    (item.status !== "Waiting for sender" || !text)
  )
    return item;
  if (
    action.kind === "retest" &&
    (item.status !== "Waiting for retest" ||
      (action.result !== "Pass" && !text))
  )
    return item;
  if (
    action.kind === "reopen" &&
    (item.status !== "Resolved" || !text || !item.handler)
  )
    return item;
  const message =
    action.kind === "retest"
      ? `Retest: ${action.result}${text ? `. ${text}` : ""}`
      : action.kind === "reopen"
        ? `Reopen reason: ${text}`
        : text;
  return {
    ...item,
    status: "Handling",
    nextActor: "Handler",
    nextAction: `${item.handler} will review ${action.kind === "reopen" ? "the reopening reason" : action.kind === "retest" ? "the retest result" : "your reply"} and decide the next step.`,
    conversation: [...item.conversation, { author: sender, text: message }],
    outcomes:
      action.kind === "reopen"
        ? item.outcomes.map((outcome) => ({ ...outcome, superseded: true }))
        : item.outcomes,
  };
}

export function filterSupport(
  items: SupportRequest[],
  query: string,
  status: string,
  view: "open" | "closed" | "all" = "all",
) {
  const search = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesView =
      view === "all" ||
      (view === "closed"
        ? item.status === "Resolved"
        : item.status !== "Resolved");
    const matchesStatus = status === "all" || item.status === status;
    const matchesQuery = `${item.id} ${item.summary}`
      .toLowerCase()
      .includes(search);
    return matchesView && matchesStatus && matchesQuery;
  });
}

export type HandlerAction =
  | { kind: "route"; applicationId: string }
  | { kind: "assign"; handler: string }
  | { kind: "set-priority"; priority: Priority }
  | { kind: "update" | "clarify" | "retest"; text: string }
  | { kind: "needs-info"; text: string }
  | { kind: "duplicate"; relatedRequestId: string; text: string }
  | { kind: "link-eng"; engTrackerId: string; text: string }
  | { kind: "workaround"; text: string; keepOpen: boolean }
  | {
      kind: "misroute";
      target: MisrouteTarget;
      text: string;
    }
  | { kind: "resolve"; outcome: Omit<Outcome, "superseded"> };

function withDisposition(
  item: SupportRequest,
  disposition: TriageDisposition,
  patch: Partial<SupportRequest> = {},
): SupportRequest {
  return { ...item, lastDisposition: disposition, ...patch };
}

function requireHandler(item: SupportRequest): string {
  if (!item.handler) throw new Error("Assign a handler first.");
  return item.handler;
}

/** Demo triage may claim an unclaimed ticket in the same action. */
function ensureHandler(
  item: SupportRequest,
  fallback = "Demo DX operator",
): { item: SupportRequest; handler: string } {
  if (item.handler) return { item, handler: item.handler };
  return {
    item: {
      ...item,
      handler: fallback,
      status: item.status === "Unclaimed" ? "Handling" : item.status,
      nextActor: item.status === "Unclaimed" ? "Handler" : item.nextActor,
      conversation: [
        ...item.conversation,
        { author: "Demo DX operator", text: `Assigned to ${fallback}.` },
      ],
    },
    handler: fallback,
  };
}

function resolveWithOutcome(
  item: SupportRequest,
  handler: string,
  outcome: Omit<Outcome, "superseded">,
  conversationText: string,
  disposition: TriageDisposition | null,
  extra: Partial<SupportRequest> = {},
): SupportRequest {
  if (
    !outcome.summary.trim() ||
    !outcome.work.trim() ||
    !outcome.limitations.trim()
  )
    throw new Error("Record the outcome, work done, and limitations.");
  return {
    ...item,
    ...extra,
    status: "Resolved",
    nextActor: "Sender",
    nextAction:
      "Read the outcome. If the same issue returns, explain why you need to reopen it.",
    lastDisposition: disposition,
    outcomes: [
      ...item.outcomes,
      {
        summary: outcome.summary.trim(),
        work: outcome.work.trim(),
        limitations: outcome.limitations.trim(),
        superseded: false,
      },
    ],
    conversation: [
      ...item.conversation,
      { author: handler, text: conversationText },
    ],
  };
}

export function applyHandlerAction(
  item: SupportRequest,
  action: HandlerAction,
): SupportRequest {
  if (item.status === "Resolved")
    throw new Error("Reopen this issue before making changes.");
  if (action.kind === "set-priority") {
    if (!prioritiesIncludes(action.priority)) {
      throw new Error("Choose a valid priority.");
    }
    if (item.priority === action.priority) return item;
    return {
      ...item,
      priority: action.priority,
      conversation: [
        ...item.conversation,
        {
          author: item.handler ?? "Demo DX operator",
          text: `Priority set to ${action.priority}.`,
        },
      ],
    };
  }
  if (action.kind === "route") {
    const application = getApplication(action.applicationId);
    if (!application) throw new Error("Choose a known application.");
    if (item.applicationId !== null)
      throw new Error("Only unidentified requests can be routed from triage.");
    if (item.status !== "Unclaimed" || item.handler !== null)
      throw new Error("Identify the application before assigning a handler.");
    return {
      ...item,
      applicationId: application.id,
      responsibleTeam: application.owner,
      nextAction: `${application.owner} needs to review this request and assign a handler.`,
      conversation: [
        ...item.conversation,
        {
          author: "Demo DX operator",
          text: `Identified application: ${application.name}. Routed to ${application.owner}.`,
        },
      ],
    };
  }
  if (action.kind === "assign") {
    const handler = action.handler.trim();
    if (!handler) throw new Error("Choose a handler.");
    if (item.handler === handler)
      throw new Error("This handler is already assigned.");
    return {
      ...item,
      handler,
      status: item.status === "Unclaimed" ? "Handling" : item.status,
      nextActor: item.status === "Unclaimed" ? "Handler" : item.nextActor,
      nextAction:
        item.nextActor === "Sender"
          ? item.nextAction
          : `${handler} will investigate and share the next step.`,
      conversation: [
        ...item.conversation,
        { author: "Demo DX operator", text: `Assigned to ${handler}.` },
      ],
    };
  }

  if (action.kind === "needs-info" || action.kind === "clarify") {
    const text = action.text.trim();
    if (!text) throw new Error("Add a progress note or instructions.");
    const claimed = ensureHandler(item);
    if (claimed.item.status !== "Handling")
      throw new Error(
        "Wait for the employee's response before requesting another action.",
      );
    return withDisposition(
      {
        ...claimed.item,
        status: "Waiting for sender",
        nextActor: "Sender",
        nextAction: text,
        conversation: [
          ...claimed.item.conversation,
          { author: claimed.handler, text },
        ],
      },
      "needs-info",
    );
  }

  if (action.kind === "duplicate") {
    const relatedRequestId = action.relatedRequestId.trim().toUpperCase();
    const text = action.text.trim();
    if (!relatedRequestId)
      throw new Error("Enter the related support request ID.");
    if (!text) throw new Error("Explain why this is a duplicate.");
    const claimed = ensureHandler(item);
    if (
      claimed.item.status !== "Handling" &&
      claimed.item.status !== "Unclaimed"
    )
      throw new Error(
        "Mark duplicates while the request is still being handled.",
      );
    return resolveWithOutcome(
      claimed.item,
      claimed.handler,
      {
        summary: `Duplicate of ${relatedRequestId}`,
        work: text,
        limitations:
          "No separate fix on this ticket. Follow the related request for progress.",
      },
      `Marked duplicate of ${relatedRequestId}: ${text}`,
      "duplicate",
      { relatedRequestId, autoClosePaused: false },
    );
  }

  if (action.kind === "link-eng") {
    const engTrackerId = action.engTrackerId.trim();
    const text = action.text.trim();
    if (!engTrackerId) throw new Error("Enter an engineering tracker ID.");
    if (!text) throw new Error("Add a short note for the requester.");
    const claimed = ensureHandler(item);
    return withDisposition(
      {
        ...claimed.item,
        status:
          claimed.item.status === "Unclaimed"
            ? "Handling"
            : claimed.item.status,
        nextActor: "Handler",
        nextAction: text,
        engTrackerId,
        autoClosePaused: true,
        conversation: [
          ...claimed.item.conversation,
          {
            author: claimed.handler,
            text: `Linked engineering work ${engTrackerId}. Auto-close paused. ${text}`,
          },
        ],
      },
      "linked-eng",
    );
  }

  if (action.kind === "workaround") {
    const text = action.text.trim();
    if (!text) throw new Error("Describe the workaround.");
    const claimed = ensureHandler(item);
    if (action.keepOpen) {
      if (claimed.item.status !== "Handling")
        throw new Error(
          "Share a workaround while actively handling the request.",
        );
      return withDisposition(
        {
          ...claimed.item,
          nextActor: "Sender",
          nextAction: text,
          status: "Waiting for sender",
          conversation: [
            ...claimed.item.conversation,
            { author: claimed.handler, text: `Workaround: ${text}` },
          ],
        },
        "workaround",
      );
    }
    if (claimed.item.status !== "Handling")
      throw new Error(
        "Review the employee's response before resolving this issue.",
      );
    return resolveWithOutcome(
      claimed.item,
      claimed.handler,
      {
        summary: "Workaround provided",
        work: text,
        limitations:
          "Root cause may remain. Reopen if the workaround fails or the defect returns.",
      },
      `Resolved with workaround: ${text}`,
      "workaround",
    );
  }

  if (action.kind === "misroute") {
    const text = action.text.trim();
    if (!text) throw new Error("Explain where the sender should go next.");
    const label = misrouteTargetLabels[action.target];
    const claimed = ensureHandler(item);
    return resolveWithOutcome(
      claimed.item,
      claimed.handler,
      {
        summary: `Redirected to ${label}`,
        work: text,
        limitations:
          "This support request does not fulfill the ask in the other area.",
      },
      `Misrouted to ${label}: ${text}`,
      "misroute",
      { misrouteTarget: action.target, autoClosePaused: false },
    );
  }

  const handler = requireHandler(item);

  if (action.kind === "resolve") {
    if (item.status !== "Handling")
      throw new Error(
        "Review the employee's response before resolving this issue.",
      );
    const { summary, work, limitations } = action.outcome;
    return resolveWithOutcome(
      item,
      handler,
      { summary, work, limitations },
      `Resolved in demo: ${summary.trim()}`,
      item.lastDisposition,
    );
  }

  const text = action.text.trim();
  if (!text) throw new Error("Add a progress note or instructions.");
  if (action.kind !== "update" && item.status !== "Handling")
    throw new Error(
      "Wait for the employee's response before requesting another action.",
    );
  return {
    ...item,
    status: action.kind === "retest" ? "Waiting for retest" : item.status,
    nextActor: action.kind === "update" ? item.nextActor : "Sender",
    nextAction:
      action.kind === "update" && item.nextActor === "Sender"
        ? item.nextAction
        : text,
    conversation: [...item.conversation, { author: handler, text }],
  };
}
