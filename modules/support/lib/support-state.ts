import {
  sender,
  type Outcome,
  type SupportContext,
  type SupportRequest,
} from "./fixtures";
import { getApplication } from "@/modules/projects/lib/applications";

export type SenderAction =
  | { kind: "comment"; text: string }
  | { kind: "reply"; text: string }
  | { kind: "retest"; result: "Pass" | "Fail" | "Unable"; text: string }
  | { kind: "reopen"; text: string };

export function createSupportRequest(
  id: string,
  context: SupportContext,
  applicationId: string | null = "beacon-portal",
): SupportRequest {
  const application = applicationId === null ? undefined : getApplication(applicationId);
  if (applicationId !== null && !application) throw new Error("Unknown application.");
  return {
    ...context,
    applicationId,
    responsibleTeam: application?.owner ?? "DX triage",
    summary: context.summary.trim(),
    situation: context.situation.trim(),
    id,
    sender,
    status: "Unclaimed",
    handler: null,
    nextActor: "Responsible team",
    nextAction:
      "An eligible handler needs to review this request and take responsibility.",
    conversation: [],
    outcomes: [],
  };
}

export function applySenderAction(
  item: SupportRequest,
  action: SenderAction,
): SupportRequest {
  if (item.sender !== sender) return item;
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
) {
  const search = query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      `${item.id} ${item.summary}`.toLowerCase().includes(search),
  );
}

export type HandlerAction =
  | { kind: "assign"; handler: string }
  | { kind: "update" | "clarify" | "retest"; text: string }
  | { kind: "resolve"; outcome: Omit<Outcome, "superseded"> };

export function applyHandlerAction(
  item: SupportRequest,
  action: HandlerAction,
): SupportRequest {
  if (item.status === "Resolved")
    throw new Error("Reopen this issue before making changes.");
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
  if (!item.handler) throw new Error("Assign a handler first.");
  if (action.kind === "resolve") {
    if (item.status !== "Handling")
      throw new Error(
        "Review the employee's response before resolving this issue.",
      );
    const { summary, work, limitations } = action.outcome;
    if (!summary.trim() || !work.trim() || !limitations.trim())
      throw new Error("Record the outcome, work done, and limitations.");
    return {
      ...item,
      status: "Resolved",
      nextActor: "Sender",
      nextAction:
        "Read the outcome. If the same issue returns, explain why you need to reopen it.",
      outcomes: [
        ...item.outcomes,
        {
          summary: summary.trim(),
          work: work.trim(),
          limitations: limitations.trim(),
          superseded: false,
        },
      ],
      conversation: [
        ...item.conversation,
        { author: item.handler, text: `Resolved in demo: ${summary.trim()}` },
      ],
    };
  }
  const text = action.text.trim();
  if (!text) throw new Error("Add a progress note or instructions.");
  if (action.kind !== "update" && item.status !== "Handling")
    throw new Error(
      "Wait for the employee's response before requesting another action.",
    );
  return {
    ...item,
    status:
      action.kind === "clarify"
        ? "Waiting for sender"
        : action.kind === "retest"
          ? "Waiting for retest"
          : item.status,
    nextActor: action.kind === "update" ? item.nextActor : "Sender",
    nextAction:
      action.kind === "update" && item.nextActor === "Sender"
        ? item.nextAction
        : text,
    conversation: [...item.conversation, { author: item.handler, text }],
  };
}
