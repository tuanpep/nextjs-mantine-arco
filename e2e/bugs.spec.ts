import { expect, test } from "@playwright/test";

test("create a bug report, revisit it, and start work", async ({ page }) => {
  await page.goto("/projects/beacon-portal/support/bugs/new");
  await page
    .getByRole("textbox", { name: "Tiêu đề" })
    .fill("Workspace stays blank");
  await page
    .getByRole("textbox", { name: "Điều đã xảy ra" })
    .fill("The page stays blank after sign-in.");
  await page
    .getByRole("textbox", { name: "Các bước tái hiện" })
    .fill("Sign in, then open the project.");
  await page
    .getByRole("textbox", { name: "Kết quả mong đợi" })
    .fill("The project overview appears.");
  await page
    .getByRole("textbox", { name: "Phiên bản hoặc môi trường" })
    .fill("Production · Chrome");
  await page.getByRole("combobox", { name: "Đối tượng bị ảnh hưởng" }).click();
  await page.getByRole("option", { name: "Chỉ tôi", exact: true }).click();
  await page.getByRole("combobox", { name: "Mức độ cần xử lý" }).click();
  await page
    .getByRole("option", { name: "Công việc đang bị đình trệ", exact: true })
    .click();
  await page.getByRole("button", { name: "Xem lại" }).click();
  await expect(page.getByText("Cao", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tạo báo cáo" }).click();

  await expect(
    page.getByRole("heading", { name: "Workspace stays blank" }),
  ).toBeVisible();
  await expect(
    page.getByText("Đang mở", { exact: true }).first(),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Báo cáo lỗi", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Workspace stays blank" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Workspace stays blank" }).click();

  await page
    .getByRole("textbox", { name: "Ghi chú" })
    .fill("Reproduced locally.");
  await page.getByRole("button", { name: "Cập nhật" }).click();
  await expect(
    page.getByText("Đang xử lý", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Reproduced locally.")).toBeVisible();
});
