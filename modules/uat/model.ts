export type Result = "Not run" | "Pass" | "Fail" | "Blocked";

export const resultLabels: Record<Result, string> = {
  "Not run": "Chưa chạy",
  Pass: "Đạt",
  Fail: "Không đạt",
  Blocked: "Bị chặn",
};

export const defectStatusLabels: Record<Defect["status"], string> = {
  Open: "Đang mở",
  Retesting: "Đang kiểm thử lại",
  Resolved: "Đã xử lý",
};

export const severityOptions = [
  { value: "Critical", label: "Nghiêm trọng" },
  { value: "Major", label: "Cao" },
  { value: "Minor", label: "Thấp" },
];
export type Scenario = {
  id: string;
  title: string;
  steps: string[];
  expected: string;
  result: Result;
};
export type Defect = {
  id: number;
  scenarioId: string;
  title: string;
  details: string;
  severity: string;
  status: "Open" | "Retesting" | "Resolved";
};
export type Campaign = {
  scenarios: Scenario[];
  defects: Defect[];
};

export const initialCampaign: Campaign = {
  defects: [],
  scenarios: [
    {
      id: "UAT-01",
      title: "Tìm đúng dự án",
      steps: [
        "Kiểm tra tên dự án trong bộ chuyển đổi ở đầu trang.",
        "Chuyển sang Beacon Portal nếu cần.",
        "Mở mục Hỗ trợ và xác nhận bạn vẫn đang ở Beacon Portal.",
      ],
      expected:
        "Đầu trang hiển thị Beacon Portal và mục Hỗ trợ vẫn thuộc dự án này.",
      result: "Not run",
    },
    {
      id: "UAT-02",
      title: "Gửi yêu cầu hỗ trợ",
      steps: [
        "Mở biểu mẫu tạo yêu cầu hỗ trợ của dự án.",
        "Nhập tóm tắt và tình huống có thể tái hiện bằng dữ liệu mẫu.",
        "Xem lại yêu cầu, xác nhận tạo và mở trang chi tiết.",
      ],
      expected:
        "Trang chi tiết hiển thị tóm tắt và trạng thái ban đầu, không làm mất thông tin đã nhập.",
      result: "Not run",
    },
    {
      id: "UAT-03",
      title: "Ghi nhận kịch bản không đạt",
      steps: [
        "Mở đợt UAT được giao trong dự án này.",
        "Đánh dấu một kịch bản là Không đạt kèm ghi chú ngắn.",
        "Xác nhận đợt kiểm thử vẫn hiển thị kết quả Không đạt và không coi là Đạt.",
      ],
      expected:
        "Kết quả Không đạt vẫn hiển thị và không được coi là phê duyệt phát hành.",
      result: "Not run",
    },
  ],
};

export type CampaignAction =
  | { type: "result"; scenarioId: string; result: Result }
  | {
      type: "defect";
      scenarioId: string;
      title: string;
      details: string;
      severity: string;
    }
  | { type: "retest"; defectId: number }
  | { type: "resolve"; defectId: number }
  | { type: "reset" };

export function campaignReducer(
  state: Campaign,
  action: CampaignAction,
): Campaign {
  switch (action.type) {
    case "result":
      return {
        ...state,
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === action.scenarioId
            ? { ...scenario, result: action.result }
            : scenario,
        ),
      };
    case "defect":
      if (
        !action.title.trim() ||
        !action.details.trim() ||
        !state.scenarios.some((scenario) => scenario.id === action.scenarioId)
      )
        return state;
      return {
        ...state,
        defects: [
          ...state.defects,
          {
            id: state.defects.length + 1,
            scenarioId: action.scenarioId,
            title: action.title.trim(),
            details: action.details.trim(),
            severity: action.severity,
            status: "Open",
          },
        ],
      };
    case "retest": {
      const defect = state.defects.find((item) => item.id === action.defectId);
      if (!defect || defect.status !== "Open") return state;
      return {
        ...state,
        scenarios: state.scenarios.map((scenario) =>
          scenario.id === defect.scenarioId
            ? { ...scenario, result: "Not run" }
            : scenario,
        ),
        defects: state.defects.map((item) =>
          item.id === defect.id ? { ...item, status: "Retesting" } : item,
        ),
      };
    }
    case "resolve": {
      const defect = state.defects.find((item) => item.id === action.defectId);
      if (
        !defect ||
        defect.status !== "Retesting" ||
        !state.scenarios.some(
          (scenario) =>
            scenario.id === defect.scenarioId && scenario.result === "Pass",
        )
      )
        return state;
      return {
        ...state,
        defects: state.defects.map((item) =>
          item.id === defect.id ? { ...item, status: "Resolved" } : item,
        ),
      };
    }
    case "reset":
      return initialCampaign;
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export function isResult(value: string): value is Result {
  return (
    value === "Not run" ||
    value === "Pass" ||
    value === "Fail" ||
    value === "Blocked"
  );
}
