import type { DetailsFieldDef } from "@/lib/form-details";

export type IdeaIntakeKey =
  "title" | "problem" | "outcome" | "suggestedChange" | "sponsorCandidate";

export const ideaRequiredFields: DetailsFieldDef<IdeaIntakeKey>[] = [
  {
    key: "title",
    control: "text",
    label: "Tiêu đề",
    required: true,
    visible: true,
  },
  {
    key: "problem",
    control: "textarea",
    label: "Vấn đề",
    placeholder: "Hiện tại có khó khăn gì và ai đang gặp khó khăn đó?",
    rows: 3,
    required: true,
    visible: true,
  },
  {
    key: "outcome",
    control: "textarea",
    label: "Kết quả mong muốn",
    placeholder: "Kết quả mong đợi nếu ý tưởng này được thực hiện.",
    rows: 2,
    required: true,
    visible: true,
  },
];

export const ideaOptionalFields: DetailsFieldDef<IdeaIntakeKey>[] = [
  {
    key: "suggestedChange",
    control: "textarea",
    label: "Thay đổi đề xuất",
    rows: 2,
    required: false,
    visible: true,
  },
  {
    key: "sponsorCandidate",
    control: "text",
    label: "Người bảo trợ đề xuất",
    placeholder:
      "Nêu tên một người không có nghĩa là họ đồng ý phê duyệt hoặc tài trợ ý tưởng này.",
    required: false,
    visible: true,
  },
];

/** @deprecated Prefer ideaRequiredFields + ideaOptionalFields */
export const ideaIntakeFields: DetailsFieldDef<IdeaIntakeKey>[] = [
  ...ideaRequiredFields,
  ...ideaOptionalFields,
];
