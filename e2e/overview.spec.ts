import { expect, test } from "@playwright/test";

test("overview attention links stay scoped and reply updates its count", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal");
  const card = page.getByRole("region", { name: "Cần bạn phản hồi" });
  await expect(card.getByRole("link")).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support?view=needs-action",
  );
  const before = await card.innerText();
  await page
    .getByRole("region", { name: "Cần bạn thực hiện" })
    .getByRole("link", { name: "Hỗ trợ xuất báo cáo tháng", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Phản hồi của bạn" })
    .fill("Thông tin hư cấu để kiểm tra luồng.");
  await page.getByRole("button", { name: "Gửi phản hồi", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Tổng quan", exact: true })
    .click();
  await expect(card).not.toHaveText(before);
  await expect(
    page
      .getByRole("region", { name: "Cần bạn thực hiện" })
      .getByText("SUP112", { exact: true }),
  ).toHaveCount(0);
  await card.getByRole("link").click();
  await expect(page).toHaveURL(/support\?view=needs-action$/);
  await expect(
    page.getByRole("heading", {
      name: "Hỗ trợ xuất báo cáo tháng",
      exact: true,
    }),
  ).toHaveCount(0);
});

test("mobile overview presents quick actions without another project's work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/orchid-reports");
  await expect(
    page.getByText("Hiện không có yêu cầu hỗ trợ chờ bạn phản hồi."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Tạo yêu cầu hỗ trợ" }),
  ).toHaveAttribute("href", "/projects/orchid-reports/support/new");
  await expect(page.getByRole("region", { name: "Tiến độ UAT" })).toContainText(
    "Chưa có dữ liệu",
  );
});
