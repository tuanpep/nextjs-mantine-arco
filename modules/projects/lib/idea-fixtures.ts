export type Idea = {
  id: string;
  title: string;
  problem: string;
  outcome: string;
  suggestedChange: string;
  sponsorCandidate: string;
  votes: number;
  votedByMe: boolean;
  position: "Under review" | "Received";
  next: string;
};

export const seedIdeas: Idea[] = [
  {
    id: "IDE-024",
    title: "Ghi nhớ không gian làm việc gần nhất",
    problem:
      "Sau khi đăng nhập, tôi được đưa đến trang chung thay vì dự án của mình.",
    outcome: "Quay lại không gian làm việc gần nhất sau khi đăng nhập.",
    suggestedChange: "Lưu dự án gần nhất theo tài khoản trong khung ứng dụng.",
    sponsorCandidate: "",
    votes: 12,
    votedByMe: false,
    position: "Under review",
    next: "Lan Vo ghi lại lý do quyết định.",
  },
  {
    id: "IDE-019",
    title: "Giúp tìm liên kết sản phẩm dễ hơn",
    problem:
      "Khó truy cập các liên kết sản phẩm thường dùng từ không gian làm việc.",
    outcome:
      "Nhóm các liên kết sản phẩm thường dùng trong không gian làm việc của dự án.",
    suggestedChange: "",
    sponsorCandidate: "Khoa Dang",
    votes: 3,
    votedByMe: false,
    position: "Received",
    next: "Lan Vo xem xét đề xuất.",
  },
];
