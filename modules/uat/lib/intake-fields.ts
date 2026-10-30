import type { DetailsFieldDef, DetailsReadoutRow } from "@/lib/form-details";

export type UatDefectIntakeKey = "title" | "reproSteps" | "expected" | "actual";

/** Structured “more details” for UAT defects; joined into `details` on save. */
export const uatDefectIntakeFields: DetailsFieldDef<UatDefectIntakeKey>[] = [
  {
    key: "title",
    control: "text",
    label: "Tóm tắt lỗi",
    required: true,
    visible: true,
  },
  {
    key: "reproSteps",
    control: "textarea",
    label: "Các bước tái hiện",
    placeholder:
      "Đánh số các bước, dùng dữ liệu mẫu thay vì thông tin cá nhân.",
    rows: 3,
    required: true,
    visible: true,
  },
  {
    key: "expected",
    control: "textarea",
    label: "Kết quả mong đợi",
    placeholder: "Kết quả lẽ ra phải xảy ra với kịch bản này.",
    rows: 2,
    required: true,
    visible: true,
  },
  {
    key: "actual",
    control: "textarea",
    label: "Kết quả thực tế",
    placeholder: "Mô tả kết quả bạn thực sự quan sát được.",
    rows: 3,
    required: true,
    visible: true,
  },
];

export function composeUatDetails(values: {
  reproSteps: string;
  expected: string;
  actual: string;
}): string {
  return [
    `Steps:\n${values.reproSteps.trim()}`,
    `Expected:\n${values.expected.trim()}`,
    `Actual:\n${values.actual.trim()}`,
  ].join("\n\n");
}

export function parseUatDetails(details: string): {
  reproSteps: string;
  expected: string;
  actual: string;
} | null {
  const match = details.match(
    /^Steps:\n([\s\S]*?)\n\nExpected:\n([\s\S]*?)\n\nActual:\n([\s\S]*)$/,
  );
  if (!match) return null;
  return {
    reproSteps: match[1] ?? "",
    expected: match[2] ?? "",
    actual: match[3] ?? "",
  };
}

export function uatDefectReadoutRows(details: string): DetailsReadoutRow[] {
  const parsed = parseUatDetails(details);
  if (!parsed) {
    return [{ label: "Các bước và hành vi thực tế", value: details }];
  }
  return [
    { label: "Các bước tái hiện", value: parsed.reproSteps },
    { label: "Kết quả mong đợi", value: parsed.expected },
    { label: "Kết quả thực tế", value: parsed.actual },
  ];
}

export function validateUatDefectIntake(values: {
  title: string;
  reproSteps: string;
  expected: string;
  actual: string;
}): Partial<Record<UatDefectIntakeKey, string>> {
  const errors: Partial<Record<UatDefectIntakeKey, string>> = {};
  if (!values.title.trim()) {
    errors.title = "Nhập tóm tắt lỗi.";
  }
  if (!values.reproSteps.trim()) {
    errors.reproSteps = "Liệt kê các bước tái hiện.";
  }
  if (!values.expected.trim()) {
    errors.expected = "Mô tả kết quả mong đợi.";
  }
  if (!values.actual.trim()) {
    errors.actual = "Mô tả kết quả thực tế.";
  }
  return errors;
}
