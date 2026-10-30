import { expect, test } from "@playwright/test";

async function openReferences(page: import("@playwright/test").Page) {
  await page
    .getByRole("navigation", { name: "Các mục cài đặt" })
    .getByText("Thông tin tham chiếu trách nhiệm minh họa")
    .click();
}

test("reviewed settings stay project-scoped across navigation and reset on reload", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/settings");
  await expect(page.getByLabel("Mã dự án")).toHaveValue("beacon-portal");
  await expect(
    page.getByLabel("Đơn vị phụ trách trong danh mục"),
  ).toHaveAttribute("readonly", "");
  await openReferences(page);
  await page
    .getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true })
    .fill("Demo Beacon handler");
  await page.getByRole("button", { name: "Xem lại thay đổi" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Beacon Portal · beacon-portal");
  await expect(
    dialog.getByRole("cell", { name: "Minh Pham", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("cell", { name: "Demo Beacon handler", exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Quay lại chỉnh sửa" }).click();
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Demo Beacon handler");
  await page.getByRole("button", { name: "Xem lại thay đổi" }).click();
  await page
    .getByRole("button", { name: "Áp dụng thông tin tham chiếu minh họa" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "chỉ trong phiên minh họa này",
  );
  await page.getByRole("link", { name: "Hỗ trợ", exact: true }).click();
  await page.getByRole("link", { name: "Cài đặt dự án", exact: true }).click();
  await openReferences(page);
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Demo Beacon handler");
  await page.getByRole("combobox", { name: "Chuyển dự án" }).first().click();
  await page.getByRole("option", { name: "Orchid Reports" }).click();
  await expect(page).toHaveURL("/projects/orchid-reports/settings");
  await openReferences(page);
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Minh Pham");
  await page.getByRole("combobox", { name: "Chuyển dự án" }).first().click();
  await page.getByRole("option", { name: "Beacon Portal" }).click();
  await expect(page).toHaveURL("/projects/beacon-portal/settings");
  await openReferences(page);
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Demo Beacon handler");
  await page.reload();
  await openReferences(page);
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Minh Pham");
});

test("unsaved edits require an explicit discard for project and sidebar navigation", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/settings?section=responsibilities");
  await page
    .getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true })
    .fill("Unsaved fictional name");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("combobox", { name: "Chuyển dự án" }).first().click();
  await page.getByRole("option", { name: "Orchid Reports" }).click();
  await expect(page).toHaveURL(/beacon-portal\/settings/);
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Unsaved fictional name");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("link", { name: "Hỗ trợ", exact: true }).click();
  await expect(page).toHaveURL(/beacon-portal\/settings/);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("link", { name: "Hỗ trợ", exact: true }).click();
  await expect(page).toHaveURL("/projects/beacon-portal/support");
  await page.getByRole("link", { name: "Cài đặt dự án", exact: true }).click();
  await openReferences(page);
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Minh Pham");
});

test("keyboard review focuses the dialog and Escape returns to the unchanged draft", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/settings?section=responsibilities");
  await page
    .getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true })
    .fill("Keyboard demo reference");
  await page.getByRole("button", { name: "Xem lại thay đổi" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Áp dụng thông tin tham chiếu minh họa" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Xem lại thay đổi" }),
  ).toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Người xử lý hỗ trợ", exact: true }),
  ).toHaveValue("Keyboard demo reference");
});
