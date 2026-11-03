import { expect, test } from "@playwright/test";

test("Vietnamese content covers every project module and survives navigation", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dự án" })).toBeVisible();
  await page
    .getByRole("main")
    .getByRole("link", { name: /Beacon Portal/ })
    .click();
  await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();

  for (const destination of [
    "Báo cáo lỗi",
    "Trợ giúp",
    "Đề xuất tính năng",
    "Phản hồi",
    "Hướng dẫn",
    "Thảo luận",
  ]) {
    await page
      .getByRole("navigation", { name: "Điều hướng chính" })
      .getByRole("link", { name: destination, exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: destination }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.getByRole("main")).not.toContainText(
      /Search this list|New bug report|Feature Requests|Open bug reports/,
    );
  }

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
