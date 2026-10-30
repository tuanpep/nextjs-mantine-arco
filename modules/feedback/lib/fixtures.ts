export type FeedbackDisposition =
  "Not reviewed" | "Acknowledged" | "Needs clarification" | "Noted";

export const feedbackDispositionLabels: Record<FeedbackDisposition, string> = {
  "Not reviewed": "Chưa xem xét",
  Acknowledged: "Đã tiếp nhận",
  "Needs clarification": "Cần làm rõ",
  Noted: "Đã ghi nhận",
};

export type FeedbackItem = {
  id: string;
  projectId: string;
  title: string;
  observation: string;
  context: string;
  disposition: FeedbackDisposition;
  reason: string;
  nextActor: string;
};

export const feedbackItems: FeedbackItem[] = [
  {
    id: "FB-012",
    projectId: "beacon-portal",
    title: "Không rõ dự án đang thao tác khi chuyển dự án",
    observation: "Tôi chỉ biết biểu mẫu đang điền thuộc dự án nào sau khi gửi.",
    context: "Trình duyệt trên điện thoại, ca sáng",
    disposition: "Acknowledged",
    reason: "Chúng tôi sẽ hiển thị tên dự án trên mọi màn hình làm việc.",
    nextActor: "Người gửi không cần thực hiện thêm thao tác",
  },
  {
    id: "FB-008",
    projectId: "beacon-portal",
    title: "Nhãn hỗ trợ rõ ràng",
    observation:
      "Nhãn người xử lý tiếp theo giúp tôi biết nên chờ hay phản hồi.",
    context: "Máy tính",
    disposition: "Not reviewed",
    reason: "",
    nextActor: "Lan Vo xem xét",
  },
  {
    id: "FB-003",
    projectId: "orchid-reports",
    title: "Thời gian xuất dữ liệu không như dự kiến",
    observation:
      "Tác vụ xuất dữ liệu qua đêm hoàn tất muộn hơn thời gian trong email.",
    context: "Chạy báo cáo hằng tuần",
    disposition: "Needs clarification",
    reason: "Cần mã tác vụ xuất dữ liệu và khoảng thời gian bạn mong đợi.",
    nextActor: "Mai Tran phản hồi",
  },
];
