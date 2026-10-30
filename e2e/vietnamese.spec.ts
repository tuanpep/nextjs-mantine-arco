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
    "Hỗ trợ",
    "Phản hồi",
    "Ý tưởng",
    "Kiểm thử nghiệm thu",
    "Cài đặt dự án",
  ]) {
    await page
      .getByRole("navigation", { name: "Điều hướng chính" })
      .getByRole("link", { name: destination, exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.getByRole("main")).not.toContainText(
      /Search requests|Search feedback|Search ideas|Review changes|Campaign progress|New request/,
    );
  }

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
