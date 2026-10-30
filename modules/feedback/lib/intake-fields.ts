import type { DetailsFieldDef, DetailsReadoutRow } from "@/lib/form-details";

export type FeedbackIntakeKey = "title" | "observation" | "context";

export const feedbackIntakeFields: DetailsFieldDef<FeedbackIntakeKey>[] = [
  {
    key: "title",
    control: "text",
    label: "Tiêu đề ngắn",
    required: true,
    visible: true,
  },
  {
    key: "observation",
    control: "textarea",
    label: "Điều bạn quan sát được",
    placeholder: "Mô tả trải nghiệm đủ chi tiết để người xem xét có thể hiểu.",
    rows: 4,
    required: true,
    visible: true,
  },
  {
    key: "context",
    control: "textarea",
    label: "Bối cảnh",
    placeholder:
      "Bạn đang ở đâu, muốn thực hiện việc gì hoặc sự việc xảy ra khi nào.",
    rows: 2,
    required: false,
    visible: true,
  },
];

export function feedbackReadoutRows(values: {
  observation: string;
  context: string;
  nextActor: string;
}): DetailsReadoutRow[] {
  return [
    { label: "Nội dung quan sát", value: values.observation },
    { label: "Bối cảnh", value: values.context },
    { label: "Người xử lý tiếp theo", value: values.nextActor },
  ];
}
