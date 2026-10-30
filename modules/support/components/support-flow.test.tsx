import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { render } from "@/test-utils/render";
import { evidenceStatusLabels, validateEvidenceFile } from "../lib/attachments";
import { supportStatusLabels, retestResultLabels } from "../lib/fixtures";
import { priorityLabels } from "../lib/priority";

import { SupportDetails } from "./support-details";
import { SupportForm } from "./support-form";
import { SupportProvider } from "./support-provider";

const search = vi.hoisted(() => ({ type: null as string | null }));

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "type" ? search.type : null),
  }),
}));

afterEach(() => {
  cleanup();
  search.type = null;
});

test("internal status, priority and retest values have Vietnamese display labels", () => {
  expect(supportStatusLabels).toEqual({
    Unclaimed: "Chưa tiếp nhận",
    Handling: "Đang xử lý",
    "Waiting for sender": "Chờ người gửi",
    "Waiting for retest": "Chờ kiểm tra lại",
    Resolved: "Đã giải quyết",
  });
  expect(priorityLabels).toEqual({
    Low: "Thấp",
    Medium: "Trung bình",
    High: "Cao",
    Critical: "Khẩn cấp",
  });
  expect(retestResultLabels).toEqual({
    Pass: "Đạt",
    Fail: "Không đạt",
    Unable: "Không thể kiểm tra",
  });
  expect(evidenceStatusLabels).toEqual({
    Selected: "Đã chọn",
    Uploading: "Đang tải lên",
    Scanning: "Đang quét",
    Ready: "Sẵn sàng",
    Rejected: "Bị từ chối",
    Failed: "Thất bại",
  });
});

test("attachment validation returns Vietnamese errors and accepts supported files", () => {
  expect(validateEvidenceFile(new File(["data"], "notes.txt"))).toBe(
    "Chỉ chấp nhận tệp PNG, JPG hoặc PDF.",
  );
  expect(
    validateEvidenceFile(
      new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.pdf"),
    ),
  ).toBe("Mỗi tệp không được vượt quá 10 MB.");
  expect(validateEvidenceFile(new File(["data"], "report.PDF"))).toBeNull();
});

test("a valid application cannot open another application's request", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="orchid-reports" supportId="SUP112" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Không thể truy cập hỗ trợ" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Hỗ trợ xuất báo cáo tháng"),
  ).not.toBeInTheDocument();
});

test("a project route cannot display another project's request", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="orchid-reports" supportId="SUP112" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Không thể truy cập hỗ trợ" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Hỗ trợ xuất báo cáo tháng"),
  ).not.toBeInTheDocument();
});

test("review does not create; explicit confirmation creates an in-memory request", () => {
  search.type = "general";
  render(
    <SupportProvider>
      <SupportForm projectId="beacon-portal" />
    </SupportProvider>,
  );
  fireEvent.change(screen.getByLabelText(/Tóm tắt ngắn gọn/), {
    target: { value: "Help finding a report" },
  });
  fireEvent.change(screen.getByLabelText(/Tình huống/), {
    target: {
      value: "I tried the reports menu but could not find the monthly report.",
    },
  });
  fireEvent.click(screen.getByRole("button", { name: "Xem lại yêu cầu" }));
  expect(
    screen.getByRole("heading", { name: "Xem lại yêu cầu" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Xem yêu cầu" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Quay lại chỉnh sửa" }));
  expect(screen.getByLabelText(/Tóm tắt ngắn gọn/)).toHaveValue(
    "Help finding a report",
  );
  fireEvent.click(screen.getByRole("button", { name: "Xem lại yêu cầu" }));
  fireEvent.click(screen.getByRole("button", { name: "Xác nhận tạo yêu cầu" }));
  expect(
    screen.getByRole("heading", { name: "Đã tạo yêu cầu" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Xem yêu cầu" })).toHaveAttribute(
    "href",
    expect.stringContaining("/projects/beacon-portal/support/SUP-"),
  );
});

test("broken intake shows repro and correlation fields", () => {
  search.type = "broken";
  render(
    <SupportProvider>
      <SupportForm projectId="beacon-portal" />
    </SupportProvider>,
  );
  expect(screen.getByLabelText(/Các bước tái hiện/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Mã tương quan \/ mã lỗi/)).toBeInTheDocument();
  expect(
    screen.getByText(/Báo lỗi cần các bước tái hiện/i),
  ).toBeInTheDocument();
});

test("demo handler triage can mark needs more info", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP116" />
    </SupportProvider>,
  );
  expect(screen.getByText("DEMO-4821")).toBeInTheDocument();
  expect(screen.getByText("Đã tạm dừng tự động đóng")).toBeInTheDocument();
  fireEvent.change(
    screen.getByLabelText(/Bạn còn cần thông tin gì từ người gửi/),
    {
      target: { value: "Which filter values reset after navigation?" },
    },
  );
  fireEvent.click(screen.getByRole("button", { name: "Áp dụng" }));
  expect(screen.getByRole("status")).toHaveTextContent("cần thêm thông tin");
  expect(screen.getByText("Chờ người gửi")).toBeInTheDocument();
});

test("sender reply updates responsibility and removes stale reply controls", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP112" />
    </SupportProvider>,
  );
  fireEvent.change(screen.getByLabelText(/Phản hồi của bạn/), {
    target: { value: "April, with no filter." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Gửi phản hồi" }));
  expect(screen.getByText("April, with no filter.")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Người xử lý sẽ thực hiện bước tiếp theo",
  );
  expect(
    screen.queryByRole("button", { name: "Gửi phản hồi" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", {
      name: /tiếp nhận|phân công|giải quyết|bàn giao/i,
    }),
  ).not.toBeInTheDocument();
});

test("retest pass records a result without resolving the request", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP113" />
    </SupportProvider>,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Xác nhận kiểm tra lại" }),
  );
  expect(screen.getByText("Kiểm tra lại: Đạt")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "Việc này không giải quyết yêu cầu hoặc phê duyệt UAT",
  );
  expect(screen.getByText("Đang xử lý")).toBeInTheDocument();
});

test("sender reopening keeps the official outcome as superseded history", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP114" />
    </SupportProvider>,
  );
  expect(screen.queryByLabelText(/Lý do mở lại/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mở lại yêu cầu" }));
  fireEvent.change(screen.getByLabelText(/Lý do mở lại/), {
    target: { value: "The same totals mismatch returned." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Mở lại" }));
  expect(
    screen.getByText("Kết quả trước đó · đã được thay thế khi mở lại"),
  ).toBeInTheDocument();
  expect(screen.getByText("Đã sửa tổng số báo cáo")).toBeInTheDocument();
  expect(screen.getByText("Đang xử lý")).toBeInTheDocument();
});

test("canceling reopen keeps the resolved state and preserves the unsent reason", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP114" />
    </SupportProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Mở lại yêu cầu" }));
  fireEvent.change(screen.getByLabelText(/Lý do mở lại/), {
    target: { value: "Vẫn gặp lỗi trong môi trường minh họa." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Hủy mở lại" }));
  expect(screen.queryByLabelText(/Lý do mở lại/)).not.toBeInTheDocument();
  expect(
    screen.getByText("Đã giải quyết", { exact: true }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mở lại yêu cầu" }));
  expect(screen.getByLabelText(/Lý do mở lại/)).toHaveValue(
    "Vẫn gặp lỗi trong môi trường minh họa.",
  );
});

test("next-action shortcut focuses the explicit reply before request history", () => {
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="SUP112" />
    </SupportProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Đến phần phản hồi" }));
  expect(
    screen.getByRole("heading", { name: "Phản hồi cho nhóm" }),
  ).toHaveFocus();
  expect(screen.getByRole("link", { name: "Quay lại Hỗ trợ" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support",
  );
});

test("unknown project and unknown request show the same nonenumerating state", () => {
  const { unmount } = render(
    <SupportProvider>
      <SupportDetails projectId="orchid" supportId="SUP112" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Không thể truy cập hỗ trợ" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Beacon Portal")).not.toBeInTheDocument();
  unmount();
  render(
    <SupportProvider>
      <SupportDetails projectId="beacon-portal" supportId="missing" />
    </SupportProvider>,
  );
  expect(
    screen.getByRole("heading", { name: "Không thể truy cập hỗ trợ" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Beacon Portal")).not.toBeInTheDocument();
});
