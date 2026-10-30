import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, expect, test, vi } from "vitest";

import { render } from "@/test-utils/render";

import { IdeasForm } from "./ideas-form";
import { IdeasScreen } from "./ideas-screen";

vi.mock("nextjs-toploader/app", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(cleanup);

test("shows Vietnamese idea statuses, voting and empty search results", async () => {
  render(
    <NuqsTestingAdapter hasMemory>
      <IdeasScreen projectId="beacon-portal" />
    </NuqsTestingAdapter>,
  );
  expect(screen.getByText("Đã tiếp nhận")).toBeInTheDocument();
  expect(screen.queryByText("Received")).not.toBeInTheDocument();
  const vote = screen.getAllByRole("button", {
    name: "Ý tưởng này hữu ích với tôi",
  })[0];
  await waitFor(() => expect(vote).toBeEnabled());
  fireEvent.click(vote);
  expect(
    screen.getByRole("button", { name: "Bỏ bình chọn" }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Tìm ý tưởng" }), {
    target: { value: "không khớp ý tưởng nào" },
  });
  expect(
    await screen.findByText("Không có ý tưởng phù hợp"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Xóa tìm kiếm" }),
  ).toBeInTheDocument();
});

test("validates required idea fields in Vietnamese", async () => {
  render(<IdeasForm projectId="beacon-portal" />);
  const submit = screen.getByRole("button", { name: "Gửi ý tưởng" });
  await waitFor(() => expect(submit).toBeEnabled());
  const form = submit.closest("form");
  if (!form) throw new Error("Không tìm thấy biểu mẫu ý tưởng.");
  fireEvent.submit(form);
  expect(await screen.findByText("Nhập tiêu đề ngắn gọn.")).toBeInTheDocument();
  expect(
    screen.getByText("Mô tả vấn đề bằng ngôn ngữ dễ hiểu."),
  ).toBeInTheDocument();
  expect(screen.getByText("Mô tả kết quả mong muốn.")).toBeInTheDocument();
});
