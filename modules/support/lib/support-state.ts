import {
  sender,
  retestResultLabels,
  type Outcome,
  type SupportContext,
  type SupportRequest,
  type TriageDisposition,
} from "./fixtures";
import { misrouteTargetLabels, type MisrouteTarget } from "./intake-fields";
import {
  calculatePriority,
  priorities,
  priorityLabels,
  type Priority,
} from "./priority";
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
    throw new Error("Ứng dụng không xác định.");
  return {
    ...context,
    applicationId,
    responsibleTeam: application?.owner ?? "Nhóm phân loại DX",
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
    nextAction: "Người xử lý phù hợp cần xem xét và tiếp nhận yêu cầu này.",
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
      ? `Kiểm tra lại: ${retestResultLabels[action.result]}${text ? `. ${text}` : ""}`
      : action.kind === "reopen"
        ? `Lý do mở lại: ${text}`
        : text;
  return {
    ...item,
    status: "Handling",
    nextActor: "Handler",
    nextAction: `${item.handler} sẽ xem xét ${action.kind === "reopen" ? "lý do mở lại" : action.kind === "retest" ? "kết quả kiểm tra lại" : "phản hồi của bạn"} và quyết định bước tiếp theo.`,
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
  view: "open" | "closed" | "needs-action" | "all" = "all",
) {
  const search = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesView =
      view === "all" ||
      (view === "closed"
        ? item.status === "Resolved"
        : item.status !== "Resolved" &&
          (view !== "needs-action" || item.nextActor === "Sender"));
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
  if (!item.handler) throw new Error("Hãy phân công người xử lý trước.");
  return item.handler;
}

/** Demo triage may claim an unclaimed ticket in the same action. */
function ensureHandler(
  item: SupportRequest,
  fallback = "Người vận hành DX thử nghiệm",
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
        {
          author: "Người vận hành DX thử nghiệm",
          text: `Đã phân công cho ${fallback}.`,
        },
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
    throw new Error("Ghi nhận kết quả, công việc đã thực hiện và giới hạn.");
  return {
    ...item,
    ...extra,
    status: "Resolved",
    nextActor: "Sender",
    nextAction:
      "Đọc kết quả xử lý. Nếu lỗi tái diễn, hãy giải thích lý do cần mở lại yêu cầu.",
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
    throw new Error("Mở lại yêu cầu này trước khi thay đổi.");
  if (action.kind === "set-priority") {
    if (!prioritiesIncludes(action.priority)) {
      throw new Error("Chọn mức ưu tiên hợp lệ.");
    }
    if (item.priority === action.priority) return item;
    return {
      ...item,
      priority: action.priority,
      conversation: [
        ...item.conversation,
        {
          author: item.handler ?? "Người vận hành DX thử nghiệm",
          text: `Đã đặt mức ưu tiên: ${priorityLabels[action.priority]}.`,
        },
      ],
    };
  }
  if (action.kind === "route") {
    const application = getApplication(action.applicationId);
    if (!application) throw new Error("Chọn ứng dụng đã có.");
    if (item.applicationId !== null)
      throw new Error(
        "Chỉ có thể chuyển yêu cầu chưa xác định ứng dụng từ bước phân loại.",
      );
    if (item.status !== "Unclaimed" || item.handler !== null)
      throw new Error("Xác định ứng dụng trước khi phân công người xử lý.");
    return {
      ...item,
      applicationId: application.id,
      responsibleTeam: application.owner,
      nextAction: `${application.owner} cần xem xét yêu cầu và phân công người xử lý.`,
      conversation: [
        ...item.conversation,
        {
          author: "Người vận hành DX thử nghiệm",
          text: `Đã xác định ứng dụng: ${application.name}. Đã chuyển đến ${application.owner}.`,
        },
      ],
    };
  }
  if (action.kind === "assign") {
    const handler = action.handler.trim();
    if (!handler) throw new Error("Chọn người xử lý.");
    if (item.handler === handler)
      throw new Error("Người xử lý này đã được phân công.");
    return {
      ...item,
      handler,
      status: item.status === "Unclaimed" ? "Handling" : item.status,
      nextActor: item.status === "Unclaimed" ? "Handler" : item.nextActor,
      nextAction:
        item.nextActor === "Sender"
          ? item.nextAction
          : `${handler} sẽ kiểm tra và thông báo bước tiếp theo.`,
      conversation: [
        ...item.conversation,
        {
          author: "Người vận hành DX thử nghiệm",
          text: `Đã phân công cho ${handler}.`,
        },
      ],
    };
  }

  if (action.kind === "needs-info" || action.kind === "clarify") {
    const text = action.text.trim();
    if (!text) throw new Error("Thêm ghi chú tiến độ hoặc hướng dẫn.");
    const claimed = ensureHandler(item);
    if (claimed.item.status !== "Handling")
      throw new Error(
        "Chờ phản hồi của nhân viên trước khi yêu cầu thao tác khác.",
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
    if (!relatedRequestId) throw new Error("Nhập mã yêu cầu hỗ trợ liên quan.");
    if (!text) throw new Error("Giải thích lý do yêu cầu bị trùng.");
    const claimed = ensureHandler(item);
    if (
      claimed.item.status !== "Handling" &&
      claimed.item.status !== "Unclaimed"
    )
      throw new Error("Đánh dấu trùng khi yêu cầu vẫn đang được xử lý.");
    return resolveWithOutcome(
      claimed.item,
      claimed.handler,
      {
        summary: `Trùng với ${relatedRequestId}`,
        work: text,
        limitations:
          "Không có bản sửa riêng cho yêu cầu này. Theo dõi tiến độ ở yêu cầu liên quan.",
      },
      `Đã đánh dấu trùng với ${relatedRequestId}: ${text}`,
      "duplicate",
      { relatedRequestId, autoClosePaused: false },
    );
  }

  if (action.kind === "link-eng") {
    const engTrackerId = action.engTrackerId.trim();
    const text = action.text.trim();
    if (!engTrackerId) throw new Error("Nhập mã công việc kỹ thuật.");
    if (!text) throw new Error("Thêm ghi chú ngắn cho người gửi yêu cầu.");
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
            text: `Đã liên kết công việc kỹ thuật ${engTrackerId}. Đã tạm dừng tự động đóng. ${text}`,
          },
        ],
      },
      "linked-eng",
    );
  }

  if (action.kind === "workaround") {
    const text = action.text.trim();
    if (!text) throw new Error("Mô tả giải pháp tạm thời.");
    const claimed = ensureHandler(item);
    if (action.keepOpen) {
      if (claimed.item.status !== "Handling")
        throw new Error("Chia sẻ giải pháp tạm thời khi đang xử lý yêu cầu.");
      return withDisposition(
        {
          ...claimed.item,
          nextActor: "Sender",
          nextAction: text,
          status: "Waiting for sender",
          conversation: [
            ...claimed.item.conversation,
            { author: claimed.handler, text: `Giải pháp tạm thời: ${text}` },
          ],
        },
        "workaround",
      );
    }
    if (claimed.item.status !== "Handling")
      throw new Error(
        "Xem xét phản hồi của nhân viên trước khi giải quyết yêu cầu này.",
      );
    return resolveWithOutcome(
      claimed.item,
      claimed.handler,
      {
        summary: "Đã cung cấp giải pháp tạm thời",
        work: text,
        limitations:
          "Nguyên nhân gốc có thể vẫn còn. Mở lại nếu giải pháp tạm thời không hiệu quả hoặc lỗi tái diễn.",
      },
      `Đã giải quyết bằng giải pháp tạm thời: ${text}`,
      "workaround",
    );
  }

  if (action.kind === "misroute") {
    const text = action.text.trim();
    if (!text) throw new Error("Giải thích nơi người gửi cần chuyển đến.");
    const label = misrouteTargetLabels[action.target];
    const claimed = ensureHandler(item);
    return resolveWithOutcome(
      claimed.item,
      claimed.handler,
      {
        summary: `Đã chuyển đến ${label}`,
        work: text,
        limitations: "Yêu cầu hỗ trợ này không thay thế yêu cầu tại mục khác.",
      },
      `Chuyển yêu cầu gửi sai nơi đến ${label}: ${text}`,
      "misroute",
      { misrouteTarget: action.target, autoClosePaused: false },
    );
  }

  const handler = requireHandler(item);

  if (action.kind === "resolve") {
    if (item.status !== "Handling")
      throw new Error(
        "Xem xét phản hồi của nhân viên trước khi giải quyết yêu cầu này.",
      );
    const { summary, work, limitations } = action.outcome;
    return resolveWithOutcome(
      item,
      handler,
      { summary, work, limitations },
      `Đã giải quyết trong bản thử nghiệm: ${summary.trim()}`,
      item.lastDisposition,
    );
  }

  const text = action.text.trim();
  if (!text) throw new Error("Thêm ghi chú tiến độ hoặc hướng dẫn.");
  if (action.kind !== "update" && item.status !== "Handling")
    throw new Error(
      "Chờ phản hồi của nhân viên trước khi yêu cầu thao tác khác.",
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
