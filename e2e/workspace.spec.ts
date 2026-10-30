import { expect, test } from "@playwright/test";

test("home opens a project overview", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dự án" })).toBeVisible();
  await page
    .getByRole("main")
    .getByRole("link", { name: /Orchid Reports/ })
    .click();
  await expect(page).toHaveURL("/projects/orchid-reports");
  await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();
  await page.getByRole("link", { name: "Hỗ trợ", exact: true }).first().click();
  await expect(page).toHaveURL("/projects/orchid-reports/support");
});

test("header switcher keeps the current section in another project", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/feedback");
  await page.getByRole("combobox", { name: "Chuyển dự án" }).first().click();
  await page.getByRole("option", { name: "Orchid Reports" }).click();
  await expect(page).toHaveURL("/projects/orchid-reports/feedback");
  await expect(
    page.getByRole("heading", { name: "Phản hồi", exact: true }),
  ).toBeVisible();
});

test("UAT campaign records results without release acceptance", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/uat");
  await expect(
    page.getByRole("heading", { name: "Kiểm thử nghiệm thu", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Accept campaign in demo" }),
  ).toHaveCount(0);
  await page.getByLabel("Kết quả của UAT-01").click();
  await page.getByRole("option", { name: "Không đạt", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "UAT-01", exact: true }),
  ).toContainText("Không đạt");
  await expect(
    page.getByRole("heading", { name: "Tiến độ đợt kiểm thử" }),
  ).toBeVisible();
});

test("settings shows archive blocked", async ({ page }) => {
  await page.goto("/projects/beacon-portal/settings");
  await expect(
    page.getByRole("heading", { name: "Cài đặt", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Lưu trữ dự án này" }).click();
  await expect(
    page.getByRole("button", { name: "Chưa thể lưu trữ" }),
  ).toBeDisabled();
});
