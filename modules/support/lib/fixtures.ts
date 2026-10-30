import type { EvidenceAttachment } from "./attachments";
import type { MisrouteTarget } from "./intake-fields";
import type { Priority, ImpactScope, Urgency } from "./priority";
import type { RequestType } from "./request-catalog";

export const supportProjectId = "beacon-portal";
export const sender = "Jo Lee";
export const supportStatuses = [
  "Unclaimed",
  "Handling",
  "Waiting for sender",
  "Waiting for retest",
  "Resolved",
] as const;
export type SupportStatus = (typeof supportStatuses)[number];

export const supportStatusLabels: Record<SupportStatus, string> = {
  Unclaimed: "Chưa tiếp nhận",
  Handling: "Đang xử lý",
  "Waiting for sender": "Chờ người gửi",
  "Waiting for retest": "Chờ kiểm tra lại",
  Resolved: "Đã giải quyết",
};

export const nextActorLabels = {
  Sender: "Người gửi",
  Handler: "Người xử lý",
  "Responsible team": "Nhóm phụ trách",
};

export const retestResultLabels = {
  Pass: "Đạt",
  Fail: "Không đạt",
  Unable: "Không thể kiểm tra",
};

export const triageDispositions = [
  "needs-info",
  "duplicate",
  "linked-eng",
  "workaround",
  "misroute",
] as const;
export type TriageDisposition = (typeof triageDispositions)[number];

export const triageDispositionLabels: Record<TriageDisposition, string> = {
  "needs-info": "Cần thêm thông tin",
  duplicate: "Trùng với yêu cầu khác",
  "linked-eng": "Đã liên kết công việc kỹ thuật",
  workaround: "Có giải pháp tạm thời",
  misroute: "Gửi sai nơi, chuyển sang mục khác",
};

export type SupportContext = {
  summary: string;
  situation: string;
  expected: string;
  impact: string;
  environment: string;
  reproSteps: string;
  correlationId: string;
  requestType: RequestType;
  impactScope: ImpactScope | "";
  urgency: Urgency | "";
  attachments: EvidenceAttachment[];
};
export type Outcome = {
  summary: string;
  work: string;
  limitations: string;
  superseded: boolean;
};
export type SupportRequest = SupportContext & {
  applicationId: string | null;
  responsibleTeam: string;
  id: string;
  sender: typeof sender;
  status: SupportStatus;
  handler: string | null;
  nextActor: "Sender" | "Handler" | "Responsible team";
  nextAction: string;
  conversation: { author: string; text: string }[];
  outcomes: Outcome[];
  priority: Priority;
  csat: number | null;
  lastDisposition: TriageDisposition | null;
  relatedRequestId: string | null;
  engTrackerId: string | null;
  autoClosePaused: boolean;
  misrouteTarget: MisrouteTarget | null;
};

const context: SupportContext = {
  summary: "Hỗ trợ xuất báo cáo tháng",
  situation:
    "Tôi mở báo cáo tháng và chọn xuất tệp. Tệp không có dòng cuối cùng.",
  expected: "Tất cả các dòng hiển thị phải có trong tệp xuất.",
  impact: "Tôi cần đối chiếu tổng số trước khi chia sẻ báo cáo.",
  environment: "Beacon Portal bản thử nghiệm, trình duyệt máy tính",
  reproSteps:
    "1. Mở báo cáo tháng\n2. Chọn xuất tệp\n3. Đối chiếu số dòng với bảng trên màn hình",
  correlationId: "",
  requestType: "broken",
  impactScope: "my-team",
  urgency: "this-week",
  attachments: [],
};

const openTriage = {
  lastDisposition: null,
  relatedRequestId: null,
  engTrackerId: null,
  autoClosePaused: false,
  misrouteTarget: null,
} as const;

export const supportFixtures: SupportRequest[] = [
  {
    ...context,
    ...openTriage,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP112",
    sender,
    status: "Waiting for sender",
    handler: "Mai Tran",
    nextActor: "Sender",
    nextAction: "Bạn đã chọn kỳ báo cáo nào và có áp dụng bộ lọc không?",
    conversation: [
      {
        author: "Mai Tran",
        text: "Bạn đã chọn kỳ báo cáo nào và có áp dụng bộ lọc không? Hãy mô tả thiết lập, không chia sẻ dữ liệu báo cáo.",
      },
    ],
    outcomes: [],
    priority: "Medium",
    csat: null,
    lastDisposition: "needs-info",
  },
  {
    ...context,
    ...openTriage,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP113",
    summary: "Kiểm tra lại việc xuất báo cáo",
    sender,
    status: "Waiting for retest",
    handler: "Mai Tran",
    nextActor: "Sender",
    nextAction:
      "Đã sửa việc chọn dòng khi xuất trong bản thử nghiệm. Mở báo cáo tháng trong môi trường thử nghiệm, chọn cùng kỳ, xuất lại và đối chiếu số dòng. Không tải tệp lên.",
    conversation: [
      {
        author: "Mai Tran",
        text: "Đã sửa việc chọn dòng khi xuất trong bản thử nghiệm. Hãy xuất lại cùng kỳ và đối chiếu số dòng.",
      },
    ],
    outcomes: [],
    priority: "Medium",
    csat: null,
  },
  {
    ...context,
    ...openTriage,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP114",
    summary: "Tổng số trong báo cáo đã hiển thị đúng",
    sender,
    status: "Resolved",
    handler: "Mai Tran",
    nextActor: "Sender",
    nextAction:
      "Đọc kết quả xử lý. Nếu lỗi tái diễn, hãy giải thích lý do cần mở lại yêu cầu.",
    conversation: [
      { author: sender, text: "Tổng số trong bản thử nghiệm đã khớp." },
    ],
    outcomes: [
      {
        summary: "Đã sửa tổng số báo cáo",
        work: "Đã cập nhật phép tính báo cáo thử nghiệm và kiểm tra tổng số mẫu.",
        limitations:
          "Chỉ kiểm tra với dữ liệu giả lập. Đây không phải phê duyệt UAT.",
        superseded: false,
      },
    ],
    priority: "Low",
    csat: null,
  },
  {
    ...context,
    ...openTriage,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP115",
    summary: "Tìm hướng dẫn báo cáo ở đâu?",
    situation:
      "Tôi cần tìm báo cáo tháng. Tôi đã kiểm tra trang chủ và tìm kiếm.",
    expected: "",
    reproSteps: "",
    requestType: "question",
    impactScope: "only-me",
    urgency: "can-wait",
    sender,
    status: "Unclaimed",
    handler: null,
    nextActor: "Responsible team",
    nextAction: "Người xử lý phù hợp cần xem xét và tiếp nhận yêu cầu này.",
    conversation: [],
    outcomes: [],
    priority: "Low",
    csat: null,
  },
  {
    ...context,
    ...openTriage,
    applicationId: "beacon-portal",
    responsibleTeam: "Product Services",
    id: "SUP116",
    summary: "Bộ lọc báo cáo bị đặt lại khi chuyển trang",
    sender,
    status: "Handling",
    handler: "Sam Rivera",
    nextActor: "Handler",
    nextAction:
      "Sam Rivera sẽ kiểm tra việc bộ lọc bị đặt lại và thông báo bước tiếp theo.",
    conversation: [
      {
        author: "Sam Rivera",
        text: "Tôi đang kiểm tra hành vi chuyển trang trong bản thử nghiệm.",
      },
    ],
    outcomes: [],
    priority: "High",
    csat: null,
    engTrackerId: "DEMO-4821",
    autoClosePaused: true,
    lastDisposition: "linked-eng",
  },
  {
    ...context,
    ...openTriage,
    applicationId: "orchid-reports",
    responsibleTeam: "Business Analytics",
    id: "SUP201",
    summary: "Chưa nhận được báo cáo theo lịch",
    situation: "Không thấy báo cáo tuần giả lập trong hộp thư thử nghiệm.",
    environment: "Orchid Reports bản thử nghiệm",
    requestType: "broken",
    sender,
    status: "Unclaimed",
    handler: null,
    nextActor: "Responsible team",
    nextAction: "Business Analytics cần kiểm tra việc gửi báo cáo theo lịch.",
    conversation: [],
    outcomes: [],
    priority: "Medium",
    csat: null,
  },
];

export const supportStatusColor: Record<SupportStatus, string> = {
  Unclaimed: "gray",
  Handling: "blue",
  "Waiting for sender": "orange",
  "Waiting for retest": "violet",
  Resolved: "teal",
};
