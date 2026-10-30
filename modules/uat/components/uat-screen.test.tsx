import { cleanup, fireEvent, screen } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { afterEach, expect, test } from "vitest";

import { render } from "@/test-utils/render";

import { UatScreen } from "./uat-screen";

afterEach(cleanup);

test("UAT presents translated scenarios, results, and defect validation", () => {
  render(
    <NuqsTestingAdapter hasMemory>
      <UatScreen projectId="beacon-portal" />
    </NuqsTestingAdapter>,
  );
  expect(screen.getByText("Tìm đúng dự án")).toBeInTheDocument();
  expect(
    screen.getByRole("combobox", { name: "Kết quả của UAT-01" }),
  ).toHaveValue("Chưa chạy");
  expect(screen.getByText("Chưa ghi nhận lỗi")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Ghi nhận lỗi" }));
  expect(
    screen.getByRole("combobox", { name: "Mức độ nghiêm trọng" }),
  ).toHaveValue("Cao");
  const form = screen.getByRole("button", { name: "Thêm lỗi" }).closest("form");
  expect(form).not.toBeNull();
  if (form) fireEvent.submit(form);
  expect(screen.getByText("Nhập tóm tắt lỗi.")).toBeInTheDocument();
  expect(screen.getByText("Liệt kê các bước tái hiện.")).toBeInTheDocument();
});
