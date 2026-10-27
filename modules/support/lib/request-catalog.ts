export const requestTypes = [
  "broken",
  "question",
  "access",
  "general",
] as const;
export type RequestType = (typeof requestTypes)[number];

export const requestTypeLabels: Record<RequestType, string> = {
  broken: "Report a bug",
  question: "Ask a question",
  access: "Request access",
  general: "Something else",
};

/** Compact labels for collection rows and filters. */
export const requestTypeShortLabels: Record<RequestType, string> = {
  broken: "Bug",
  question: "Question",
  access: "Access",
  general: "Other",
};

export const requestCatalogCards: {
  type: RequestType;
  title: string;
  description: string;
  primary?: boolean;
}[] = [
  {
    type: "broken",
    title: "Report a bug",
    description: "A feature failed or looks wrong. Repro steps help most.",
    primary: true,
  },
  {
    type: "question",
    title: "Ask a question",
    description: "How do I do something in this project?",
  },
  {
    type: "access",
    title: "Request access",
    description: "Ask for access. Sending does not grant it.",
  },
  {
    type: "general",
    title: "Something else",
    description: "Any other help request in this project.",
  },
];

/** Missing or unknown types fall back to bug report — the primary support job. */
export function parseRequestType(
  value: string | null | undefined,
): RequestType {
  if (value && (requestTypes as readonly string[]).includes(value)) {
    return value as RequestType;
  }
  return "broken";
}
