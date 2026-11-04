import { expect, test } from "@playwright/test";

test("session records filter, reopen from history and reset on reload", async ({
  page,
}) => {
  await page.goto("/");
  const records = page.getByRole("region", { name: "Bản ghi trong phiên" });
  await expect(page.getByRole("region", { name: "Đã mở gần đây" })).toHaveCount(
    0,
  );
  await records
    .getByRole("combobox", { name: "Dự án", exact: true })
    .selectOption("orchid-reports");
  await records
    .getByRole("combobox", { name: "Loại", exact: true })
    .selectOption("guide");
  await expect(page).toHaveURL(/recordsKind=guide/);
  const link = records.getByRole("listitem").first().getByRole("link");
  const title = await link.innerText();
  const href = await link.getAttribute("href");
  if (!href) throw new Error("Missing record destination");
  await link.click();
  await expect(page).toHaveURL(href);
  await page.getByRole("link", { name: "DX Portal", exact: true }).click();
  const recent = page.getByRole("region", { name: "Đã mở gần đây" });
  await expect(
    recent.getByRole("link", { name: title, exact: true }),
  ).toHaveAttribute("href", href);
  await recent.getByRole("link", { name: title, exact: true }).click();
  await expect(page).toHaveURL(href);
  await page.getByRole("link", { name: "DX Portal", exact: true }).click();
  const search = records.getByRole("textbox", {
    name: "Tìm bản ghi trong phiên",
  });
  await search.fill("no-result-xyz");
  await search.press("Enter");
  await expect(records.getByText("Không có bản ghi khớp")).toBeVisible();
  await records
    .getByRole("button", { name: "Xóa bộ lọc", exact: true })
    .filter({ hasText: "Xóa bộ lọc" })
    .click();
  await expect(records.getByRole("listitem")).toHaveCount(10);
  await page.reload();
  await expect(page.getByRole("region", { name: "Đã mở gần đây" })).toHaveCount(
    0,
  );
});

test("home filters are URL-backed and usable by keyboard on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/?recordsProject=unknown&recordsKind=unknown&recordsPage=999",
  );
  const records = page.getByRole("region", { name: "Bản ghi trong phiên" });
  const type = records.getByRole("combobox", { name: "Loại", exact: true });
  await expect(type).toHaveValue("all");
  await expect(
    records.getByRole("combobox", { name: "Dự án", exact: true }),
  ).toHaveValue("all");
  await type.focus();
  await expect(type).toBeFocused();
  await type.selectOption("help");
  await expect(page).toHaveURL(/recordsKind=help/);
  await expect(records.getByRole("listitem").first()).toContainText("Trợ giúp");
  await page.goBack();
  await expect(type).toHaveValue("all");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

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
