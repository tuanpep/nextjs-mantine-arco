import { expect, test } from "@playwright/test";

test("review and create a local request, then open its unclaimed detail", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/new");
  await page
    .getByRole("textbox", { name: "Tóm tắt ngắn gọn" })
    .fill("Unable to open the workspace");
  await page
    .getByRole("textbox", { name: "Điều gì đã xảy ra", exact: true })
    .fill("I selected my workspace and the page stayed blank.");
  await page
    .getByRole("textbox", { name: "Kết quả mong đợi" })
    .fill("Hiển thị không gian làm việc.");
  await page
    .getByRole("textbox", { name: "Các bước tái hiện" })
    .fill("Đăng nhập, sau đó mở không gian làm việc.");
  await page
    .getByRole("textbox", { name: "Phiên bản hoặc môi trường" })
    .fill("Môi trường kiểm thử, Chrome.");
  await page.getByRole("combobox", { name: "Đối tượng bị ảnh hưởng" }).click();
  await page.getByRole("option", { name: "Chỉ tôi", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Công việc cần được xử lý sớm đến mức nào" })
    .click();
  await page.getByRole("option", { name: "Có thể chờ", exact: true }).click();
  await page.getByRole("button", { name: "Xem lại yêu cầu" }).click();
  await expect(
    page.getByRole("heading", { name: "Xem lại yêu cầu" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Quay lại chỉnh sửa" }).click();
  await expect(
    page.getByRole("textbox", { name: "Tóm tắt ngắn gọn" }),
  ).toHaveValue("Unable to open the workspace");
  await page.getByRole("button", { name: "Xem lại yêu cầu" }).click();
  await page.getByRole("button", { name: "Xác nhận tạo yêu cầu" }).click();
  await expect(
    page.getByRole("heading", { name: "Đã tạo yêu cầu" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Xem yêu cầu" }).click();
  await expect(
    page.getByRole("heading", { name: "Unable to open the workspace" }),
  ).toBeVisible();
  await expect(
    page.getByText("Chưa tiếp nhận", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("link", { name: "Quay lại Hỗ trợ" }).click();
  await expect(
    page.getByRole("heading", { name: "Unable to open the workspace" }),
  ).toBeVisible();
});

test("sender clarification reply returns the next action to the handler", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/SUP112");
  await page.getByRole("button", { name: "Đến phần phản hồi" }).click();
  await expect(
    page.getByRole("heading", { name: "Phản hồi cho nhóm" }),
  ).toBeFocused();
  await page
    .getByRole("textbox", { name: "Phản hồi của bạn" })
    .fill("This happens in the test workspace after signing in.");
  await page.getByRole("button", { name: "Gửi phản hồi", exact: true }).click();
  await expect(
    page.getByText("This happens in the test workspace after signing in.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Gửi phản hồi", exact: true }),
  ).toHaveCount(0);
});

test("resolved discussion requires explicit reopen and cancel preserves the reason", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/beacon-portal/support/SUP114");
  await expect(page.getByRole("textbox", { name: "Lý do mở lại" })).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "Mở lại yêu cầu", exact: true })
    .click();
  const reason = page.getByRole("textbox", { name: "Lý do mở lại" });
  await expect(reason).toBeFocused();
  await reason.fill("Vấn đề vẫn xảy ra trong môi trường minh họa.");
  await page.getByRole("button", { name: "Hủy mở lại" }).click();
  await expect(reason).toHaveCount(0);
  await page
    .getByRole("button", { name: "Mở lại yêu cầu", exact: true })
    .click();
  await expect(reason).toHaveValue(
    "Vấn đề vẫn xảy ra trong môi trường minh họa.",
  );
  await page.getByRole("button", { name: "Mở lại", exact: true }).click();
  await expect(
    page.getByText("Kết quả trước đó · đã được thay thế khi mở lại", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Cập nhật của bạn" }),
  ).toBeVisible();
});
