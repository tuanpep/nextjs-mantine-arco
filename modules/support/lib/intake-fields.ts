import type { DetailsFieldDef, DetailsReadoutRow } from "@/lib/form-details";

import type { SupportContext } from "./fixtures";
import {
  impactScopeLabels,
  impactScopes,
  urgencyLabels,
  urgencies,
} from "./priority";
import { requestTypeLabels, type RequestType } from "./request-catalog";

export type IntakeFieldKey = keyof Omit<SupportContext, "attachments">;

export const misrouteTargets = ["feedback", "ideas", "uat"] as const;
export type MisrouteTarget = (typeof misrouteTargets)[number];

export const misrouteTargetLabels: Record<MisrouteTarget, string> = {
  feedback: "Phản hồi",
  ideas: "Ý tưởng",
  uat: "UAT",
};

export type IntakeTemplate = {
  fields: DetailsFieldDef<IntakeFieldKey>[];
};

/** Type-aware field descriptors for create, review, and detail readout. */
export function intakeTemplate(type: RequestType): IntakeTemplate {
  switch (type) {
    case "broken":
      return {
        fields: intakeFields({
          situationLabel: "Điều gì đã xảy ra",
          situationPlaceholder: "Bạn đang làm gì khi xảy ra lỗi?",
          expectedVisible: true,
          expectedRequired: true,
          reproVisible: true,
          reproRequired: true,
          correlationVisible: true,
          environmentRequired: true,
          impactRequired: true,
        }),
      };
    case "question":
      return {
        fields: intakeFields({
          situationLabel: "Mục tiêu và những cách đã thử",
          situationPlaceholder:
            "Bạn muốn làm gì và đã xem những tài liệu hoặc trình đơn nào?",
          expectedVisible: false,
          expectedRequired: false,
          reproVisible: false,
          reproRequired: false,
          correlationVisible: false,
          environmentRequired: false,
          impactRequired: false,
        }),
      };
    case "access":
      return {
        fields: intakeFields({
          situationLabel: "Quyền truy cập cần cấp và lý do công việc",
          situationPlaceholder:
            "Bạn cần hệ thống hoặc vai trò nào, vì sao? Không dán mật khẩu hoặc mã truy cập.",
          expectedVisible: false,
          expectedRequired: false,
          reproVisible: false,
          reproRequired: false,
          correlationVisible: false,
          environmentRequired: false,
          impactRequired: false,
        }),
      };
    case "general":
      return {
        fields: intakeFields({
          situationLabel: "Tình huống",
          situationPlaceholder: "Mô tả nội dung cần hỗ trợ.",
          expectedVisible: true,
          expectedRequired: false,
          reproVisible: false,
          reproRequired: false,
          correlationVisible: false,
          environmentRequired: false,
          impactRequired: false,
        }),
      };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

type IntakeVisibility = {
  situationLabel: string;
  situationPlaceholder: string;
  expectedVisible: boolean;
  expectedRequired: boolean;
  reproVisible: boolean;
  reproRequired: boolean;
  correlationVisible: boolean;
  environmentRequired: boolean;
  impactRequired: boolean;
};

function intakeFields(
  flags: IntakeVisibility,
): DetailsFieldDef<IntakeFieldKey>[] {
  return [
    {
      key: "summary",
      control: "text",
      label: "Tóm tắt ngắn gọn",
      required: true,
      visible: true,
    },
    {
      key: "situation",
      control: "textarea",
      label: flags.situationLabel,
      placeholder: flags.situationPlaceholder,
      rows: 4,
      required: true,
      visible: true,
    },
    {
      key: "expected",
      control: "textarea",
      label: "Kết quả mong đợi",
      placeholder: "Kết quả đúng phải như thế nào?",
      rows: 2,
      required: flags.expectedRequired,
      visible: flags.expectedVisible,
    },
    {
      key: "reproSteps",
      control: "textarea",
      label: "Các bước tái hiện",
      placeholder: "1. … 2. … 3. …",
      rows: 4,
      required: flags.reproRequired,
      visible: flags.reproVisible,
    },
    {
      key: "correlationId",
      control: "text",
      label: "Mã tương quan / mã lỗi",
      placeholder: "Mã yêu cầu, mã lỗi hoặc mã tác vụ",
      required: false,
      visible: flags.correlationVisible,
    },
    {
      key: "impactScope",
      control: "select",
      label: "Đối tượng bị ảnh hưởng",
      required: flags.impactRequired,
      visible: true,
      clearable: true,
      options: impactScopes.map((value) => ({
        value,
        label: impactScopeLabels[value],
      })),
      section: flags.impactRequired
        ? "Ảnh hưởng và mức độ khẩn cấp"
        : undefined,
      sectionDescription: flags.impactRequired
        ? "Người xử lý dựa vào thông tin này để đặt mức ưu tiên. Bạn không chọn mức ưu tiên."
        : undefined,
    },
    {
      key: "urgency",
      control: "select",
      label: "Công việc cần được xử lý sớm đến mức nào",
      required: flags.impactRequired,
      visible: true,
      clearable: true,
      options: urgencies.map((value) => ({
        value,
        label: urgencyLabels[value],
      })),
    },
    {
      key: "impact",
      control: "textarea",
      label: "Chi tiết ảnh hưởng",
      placeholder:
        "Giải pháp tạm thời, thời hạn hoặc số người bị ảnh hưởng nếu biết.",
      rows: 2,
      required: false,
      visible: true,
    },
    {
      key: "environment",
      control: "text",
      label: "Phiên bản hoặc môi trường",
      placeholder: flags.environmentRequired
        ? "Môi trường chính thức · Chrome 129 · thời điểm bắt đầu"
        : "Không bắt buộc: môi trường chính thức · Chrome 129 · thời điểm xảy ra",
      required: flags.environmentRequired,
      visible: true,
    },
  ];
}

/** Always above the fold when visible — short fields handlers scan first. */
const alwaysPrimaryKeys: IntakeFieldKey[] = [
  "summary",
  "situation",
  "correlationId",
];

/** Required / core fields stay visible; the rest belong behind optional disclosure. */
export function intakeFormSections(type: RequestType): {
  primary: DetailsFieldDef<IntakeFieldKey>[];
  optional: DetailsFieldDef<IntakeFieldKey>[];
} {
  const fields = intakeTemplate(type).fields.filter(
    (field) => field.visible && field.key !== "requestType",
  );
  const primary = fields.filter(
    (field) => field.required || alwaysPrimaryKeys.includes(field.key),
  );
  const optional = fields.filter(
    (field) => !primary.some((item) => item.key === field.key),
  );
  return { primary, optional };
}

export function intakeHint(type: RequestType): string {
  switch (type) {
    case "broken":
      return "Báo lỗi cần các bước tái hiện và thông tin môi trường. Bạn không đặt mức ưu tiên.";
    case "question":
      return "Nêu mục tiêu và những cách bạn đã thử. Bạn không đặt mức ưu tiên.";
    case "access":
      return "Mô tả quyền truy cập và lý do công việc. Gửi yêu cầu không đồng nghĩa với được cấp quyền.";
    case "general":
      return "Mô tả nội dung cần hỗ trợ. Đề xuất sản phẩm, lời khen và lỗi UAT thuộc các mục khác.";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

/** Compatibility shim for callers that still read visibility flags. */
export function intakeCopy(type: RequestType) {
  const template = intakeTemplate(type);
  const byKey = Object.fromEntries(
    template.fields.map((field) => [field.key, field]),
  ) as Record<IntakeFieldKey, DetailsFieldDef<IntakeFieldKey>>;

  return {
    situationLabel: byKey.situation.label,
    situationPlaceholder: byKey.situation.placeholder ?? "",
    expectedVisible: byKey.expected.visible,
    expectedRequired: byKey.expected.required,
    reproVisible: byKey.reproSteps.visible,
    reproRequired: byKey.reproSteps.required,
    correlationVisible: byKey.correlationId.visible,
    environmentRequired: byKey.environment.required,
    impactRequired: byKey.impactScope.required,
  };
}

export function formatIntakeValue(
  key: IntakeFieldKey,
  values: Omit<SupportContext, "attachments">,
): string {
  switch (key) {
    case "impactScope":
      return values.impactScope ? impactScopeLabels[values.impactScope] : "";
    case "urgency":
      return values.urgency ? urgencyLabels[values.urgency] : "";
    case "requestType":
      return requestTypeLabels[values.requestType];
    case "summary":
    case "situation":
    case "expected":
    case "impact":
    case "environment":
    case "reproSteps":
    case "correlationId":
      return values[key];
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

/** Read-only rows for Initial context / review — omits type-hidden fields. */
export function intakeReadoutRows(
  values: Omit<SupportContext, "attachments">,
  options?: { includeSummary?: boolean },
): DetailsReadoutRow[] {
  const template = intakeTemplate(values.requestType);
  return template.fields
    .filter((field) => {
      if (!field.visible) return false;
      if (field.key === "requestType") return false;
      if (field.key === "summary" && !options?.includeSummary) return false;
      return true;
    })
    .map((field) => ({
      label: field.label,
      value: formatIntakeValue(field.key, values),
    }));
}

export function validateIntake(
  values: Omit<SupportContext, "attachments">,
): Partial<Record<IntakeFieldKey, string>> {
  const copy = intakeCopy(values.requestType);
  const errors: Partial<Record<IntakeFieldKey, string>> = {};

  if (!values.summary.trim()) {
    errors.summary = "Nhập tóm tắt ngắn gọn.";
  }
  if (!values.situation.trim()) {
    errors.situation =
      values.requestType === "question"
        ? "Mô tả mục tiêu và những cách bạn đã thử."
        : values.requestType === "access"
          ? "Mô tả quyền truy cập cần cấp và lý do."
          : "Mô tả thao tác bạn muốn thực hiện và điều đã xảy ra.";
  }
  if (copy.expectedRequired && !values.expected.trim()) {
    errors.expected = "Nêu kết quả đúng mà bạn mong đợi.";
  }
  if (copy.reproRequired && !values.reproSteps.trim()) {
    errors.reproSteps =
      "Liệt kê các bước theo thứ tự để người xử lý có thể tái hiện lỗi.";
  }
  if (copy.environmentRequired && !values.environment.trim()) {
    errors.environment =
      "Thêm phiên bản hoặc môi trường, ví dụ môi trường chính thức, trình duyệt, thời điểm bắt đầu.";
  }
  if (copy.impactRequired) {
    if (!values.impactScope) {
      errors.impactScope = "Nêu đối tượng bị ảnh hưởng.";
    }
    if (!values.urgency) {
      errors.urgency = "Nêu mức độ cấp bách của công việc.";
    }
  }
  return errors;
}
