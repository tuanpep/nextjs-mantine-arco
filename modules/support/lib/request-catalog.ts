export const requestTypes = [
  "broken",
  "question",
  "access",
  "general",
] as const;
export type RequestType = (typeof requestTypes)[number];

export const requestTypeLabels: Record<RequestType, string> = {
  broken: "Báo lỗi",
  question: "Đặt câu hỏi",
  access: "Yêu cầu quyền truy cập",
  general: "Yêu cầu khác",
};

/** Compact labels for collection rows and filters. */
export const requestTypeShortLabels: Record<RequestType, string> = {
  broken: "Lỗi",
  question: "Câu hỏi",
  access: "Quyền truy cập",
  general: "Khác",
};

export const requestCatalogCards: {
  type: RequestType;
  title: string;
  description: string;
  primary?: boolean;
}[] = [
  {
    type: "broken",
    title: "Báo lỗi",
    description:
      "Tính năng bị lỗi hoặc hiển thị sai. Hãy cung cấp các bước tái hiện.",
    primary: true,
  },
  {
    type: "question",
    title: "Đặt câu hỏi",
    description: "Hỏi cách thực hiện một thao tác trong dự án này.",
  },
  {
    type: "access",
    title: "Yêu cầu quyền truy cập",
    description:
      "Đề nghị cấp quyền. Gửi yêu cầu không đồng nghĩa với được cấp quyền.",
  },
  {
    type: "general",
    title: "Yêu cầu khác",
    description: "Các yêu cầu hỗ trợ khác trong dự án này.",
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
