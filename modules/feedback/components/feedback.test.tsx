import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, expect, test, vi } from "vitest";

import { render } from "@/test-utils/render";

import { FeedbackCollection } from "./feedback-collection";
import { FeedbackDetails } from "./feedback-details";
import { FeedbackForm } from "./feedback-form";

vi.mock("nextjs-toploader/app", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(cleanup);

test("collection shows Vietnamese labels without changing destination URLs", () => {
  render(
    <NuqsTestingAdapter>
      <FeedbackCollection projectId="beacon-portal" />
    </NuqsTestingAdapter>,
  );
  expect(screen.getByRole("heading", { name: "Phản hồi" })).toBeInTheDocument();
  expect(screen.getByText("Chưa xem xét")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /FB-008/ })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/feedback/FB-008",
  );
  fireEvent.change(screen.getByRole("textbox", { name: "Tìm kiếm phản hồi" }), {
    target: { value: "không tồn tại" },
  });
  expect(screen.getByText("Không có phản hồi phù hợp")).toBeInTheDocument();
});

test("feedback intake validates in Vietnamese", () => {
  render(<FeedbackForm projectId="beacon-portal" />);
  const form = screen
    .getByRole("button", { name: "Gửi phản hồi" })
    .closest("form");
  expect(form).not.toBeNull();
  if (form) fireEvent.submit(form);
  expect(screen.getByText("Nhập tiêu đề ngắn.")).toBeInTheDocument();
  expect(screen.getByText("Mô tả điều bạn quan sát được.")).toBeInTheDocument();
});

test("review records a translated disposition", () => {
  render(<FeedbackDetails projectId="beacon-portal" feedbackId="FB-008" />);
  fireEvent.click(screen.getByRole("button", { name: "Cần làm rõ" }));
  fireEvent.change(
    screen.getByRole("textbox", { name: "Lý do hiển thị cho người gửi" }),
    {
      target: { value: "Vui lòng bổ sung bối cảnh." },
    },
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Ghi nhận kết quả xem xét" }),
  );
  expect(screen.getByRole("status")).toHaveTextContent(
    "Đã ghi nhận kết quả: Cần làm rõ.",
  );
  expect(screen.queryByText("Needs clarification")).not.toBeInTheDocument();
});
