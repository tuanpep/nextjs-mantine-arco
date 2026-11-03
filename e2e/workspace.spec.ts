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
  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Báo cáo lỗi", exact: true })
    .click();
  await expect(page).toHaveURL("/projects/orchid-reports/support/bugs");
});

test("header switcher keeps the current section in another project", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/ideas/feedback");
  await page.getByRole("combobox", { name: "Chuyển dự án" }).first().click();
  await page.getByRole("option", { name: "Orchid Reports" }).click();
  await expect(page).toHaveURL("/projects/orchid-reports/ideas/feedback");
  await expect(
    page.getByRole("heading", { name: "Phản hồi", exact: true }),
  ).toBeVisible();
});
