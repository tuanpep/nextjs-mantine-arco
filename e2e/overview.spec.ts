import { expect, test } from "@playwright/test";

test("overview counts stay on the current project", async ({ page }) => {
  await page.goto("/projects/beacon-portal");
  const card = page.getByRole("region", { name: "Báo cáo lỗi đang mở" });
  await expect(card.getByRole("link", { name: "Xem" })).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/bugs?view=open",
  );
  await expect(card).toContainText("1");
  await page.goto("/projects/orchid-reports");
  await expect(
    page.getByRole("region", { name: "Báo cáo lỗi đang mở" }),
  ).toContainText("2");
  await expect(page.getByText("Export button does nothing")).toHaveCount(0);
});

test("mobile overview keeps every module available", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/orchid-reports");
  for (const name of [
    "Báo cáo lỗi đang mở",
    "Câu hỏi đang mở",
    "Đề xuất đang mở",
    "Phản hồi mới",
    "Hướng dẫn",
    "Thảo luận",
  ]) {
    await expect(page.getByRole("region", { name })).toBeVisible();
  }
});
