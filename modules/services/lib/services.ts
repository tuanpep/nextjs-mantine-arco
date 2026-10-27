export const services = [
  {
    id: "access",
    title: "Application access",
    description: "Request access to a business application.",
    approval: "Line manager and application owner review required.",
    fields: [
      { key: "account", label: "Work email", kind: "email" },
      { key: "scope", label: "Access scope", kind: "text" },
    ],
  },
  {
    id: "role",
    title: "Role change",
    description: "Change an existing application's role or permissions.",
    approval: "Manager and application owner must review the proposed role.",
    fields: [
      { key: "currentRole", label: "Current role", kind: "text" },
      { key: "requestedRole", label: "Requested role", kind: "text" },
    ],
  },
  {
    id: "report",
    title: "Report / export",
    description: "Ask for a report or a scoped data export.",
    approval:
      "Data owner review required. Sensitive exports may need security review.",
    fields: [
      { key: "scope", label: "Report scope and date range", kind: "text" },
      { key: "format", label: "Output format", kind: "text" },
    ],
  },
  {
    id: "training",
    title: "Training",
    description: "Arrange an application walkthrough for your team.",
    approval:
      "DX confirms availability and training scope. Manager review may be needed.",
    fields: [
      {
        key: "audience",
        label: "Audience and number of attendees",
        kind: "text",
      },
      { key: "topics", label: "Training topics", kind: "text" },
    ],
  },
  {
    id: "configuration",
    title: "Configuration change",
    description: "Propose a business application configuration change.",
    approval: "Application owner reviews impact and agrees a change window.",
    fields: [
      { key: "change", label: "Proposed configuration change", kind: "text" },
      { key: "impact", label: "Impact and rollback plan", kind: "text" },
    ],
  },
  {
    id: "correction",
    title: "Data correction",
    description: "Request a reviewed correction to business records.",
    approval:
      "Data owner validates evidence before any correction is scheduled.",
    fields: [
      { key: "record", label: "Record reference", kind: "text" },
      {
        key: "correction",
        label: "Expected correction and evidence",
        kind: "text",
      },
    ],
  },
] satisfies {
  id: string;
  title: string;
  description: string;
  approval: string;
  fields: { key: string; label: string; kind: string }[];
}[];

export type Service = (typeof services)[number];
export type RequestStatus =
  | "Submitted"
  | "In review"
  | "Approved"
  | "In progress"
  | "Fulfilled"
  | "Declined";
export type RequestDraft = {
  serviceId: string;
  application: string;
  justification: string;
  details: Record<string, string>;
};
export type ServiceRequest = RequestDraft & {
  id: string;
  status: RequestStatus;
  assignee: string;
  history: { at: string; actor: string; message: string }[];
};
export type QueueAction =
  | { kind: "assign"; assignee: string }
  | {
      kind: "status";
      status: Exclude<RequestStatus, "Fulfilled">;
      reason: string;
    }
  | { kind: "status"; status: "Fulfilled"; reason: string; evidence: string };

export function validateRequest(draft: RequestDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  const service = services.find((item) => item.id === draft.serviceId);
  if (!service) errors.serviceId = "Choose a service.";
  if (!draft.application.trim())
    errors.application = "Application is required.";
  if (draft.justification.trim().length < 15)
    errors.justification =
      "Explain the business need in at least 15 characters.";
  for (const field of service?.fields ?? []) {
    const value = draft.details[field.key]?.trim() ?? "";
    if (!value) errors[field.key] = `${field.label} is required.`;
    else if (
      field.kind === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
      errors[field.key] = "Enter a valid work email.";
  }
  return errors;
}

export function allowedStatuses(status: RequestStatus): RequestStatus[] {
  switch (status) {
    case "Submitted":
      return ["In review", "Declined"];
    case "In review":
      return ["Approved", "Declined"];
    case "Approved":
      return ["In progress", "Declined"];
    case "In progress":
      return ["Fulfilled", "Declined"];
    case "Fulfilled":
    case "Declined":
      return [];
  }
}

export function updateRequest(
  request: ServiceRequest,
  action: QueueAction,
  at: string,
): ServiceRequest {
  if (request.status === "Declined" || request.status === "Fulfilled")
    throw new Error(
      `${request.status} requests cannot be changed. Submit a new request.`,
    );
  let message: string;
  let next = request;
  if (action.kind === "assign") {
    if (!action.assignee.trim()) throw new Error("Choose a DX assignee.");
    if (action.assignee.trim() === request.assignee)
      throw new Error("This request is already assigned to that person.");
    next = { ...request, assignee: action.assignee.trim() };
    message = `Assigned to ${next.assignee}.`;
  } else {
    if (!allowedStatuses(request.status).includes(action.status))
      throw new Error("This status change is not allowed.");
    if (!request.assignee)
      throw new Error("Assign a DX owner before changing status.");
    if (action.reason.trim().length < 10)
      throw new Error("Add a reason of at least 10 characters.");
    if (action.status === "Fulfilled" && action.evidence.trim().length < 10)
      throw new Error(
        "Add simulated fulfillment evidence of at least 10 characters.",
      );
    next = { ...request, status: action.status };
    message =
      action.status === "Fulfilled"
        ? `Fulfilled: ${action.reason.trim()} Evidence: ${action.evidence.trim()} Simulated fulfillment only. No real provisioning or changes occurred.`
        : `${action.status}: ${action.reason.trim()}`;
  }
  return {
    ...next,
    history: [...request.history, { at, actor: "Demo DX operator", message }],
  };
}

export function seedRequests(): ServiceRequest[] {
  return [
    {
      id: "SR-1001",
      serviceId: "access",
      application: "Salesforce",
      justification: "Review customer accounts for the regional sales team.",
      details: {
        account: "jo.lee@example.com",
        scope: "Read-only customer accounts",
      },
      assignee: "Linh Nguyen",
      status: "In review",
      history: [
        {
          at: "2026-10-25T09:00:00Z",
          actor: "You · Jo Lee demo account",
          message: "Submitted request.",
        },
        {
          at: "2026-10-25T10:00:00Z",
          actor: "Demo DX operator",
          message:
            "Assigned to Linh Nguyen. In review, awaiting application owner.",
        },
      ],
    },
    {
      id: "SR-1002",
      serviceId: "report",
      application: "Power BI",
      justification:
        "Prepare monthly service performance review for operations.",
      details: { scope: "September 2026 service performance", format: "CSV" },
      assignee: "",
      status: "Submitted",
      history: [
        {
          at: "2026-10-25T11:00:00Z",
          actor: "You",
          message: "Submitted request.",
        },
      ],
    },
  ];
}
