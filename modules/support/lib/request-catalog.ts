export const requestTypes = [
  "broken",
  "question",
  "access",
  "general",
] as const;
export type RequestType = (typeof requestTypes)[number];

export const requestTypeLabels: Record<RequestType, string> = {
  broken: "Something is broken",
  question: "I have a question",
  access: "I need access",
  general: "Something else",
};

export const requestCatalogCards: {
  type: RequestType;
  title: string;
  description: string;
}[] = [
  {
    type: "broken",
    title: "Something is broken",
    description: "A feature failed or looks wrong.",
  },
  {
    type: "question",
    title: "I have a question",
    description: "How do I do something in this project?",
  },
  {
    type: "access",
    title: "I need access",
    description: "Ask for access. Sending does not grant it.",
  },
  {
    type: "general",
    title: "Something else",
    description: "Any other help request in this project.",
  },
];

export function parseRequestType(value: string | null | undefined): RequestType {
  if (value && (requestTypes as readonly string[]).includes(value)) {
    return value as RequestType;
  }
  return "general";
}
