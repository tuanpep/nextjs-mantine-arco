import { expect, test } from "@playwright/test";

test("bug details keep context beside the report on desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects/beacon-portal/support/bugs/BUG-1");
  const panel = page.getByRole("complementary", {
    name: "Chi tiết",
    exact: true,
  });
  await expect(panel.getByText("EXP-4401", { exact: true })).toBeVisible();
  await expect(
    panel.getByRole("button", { name: "Cập nhật", exact: true }),
  ).toBeVisible();
  await expect(
    panel.getByRole("textbox", { name: "Tin nhắn", exact: true }),
  ).toHaveCount(0);
  const discussion = page.getByRole("region", {
    name: "Trao đổi",
    exact: true,
  });
  await discussion
    .getByRole("textbox", { name: "Tin nhắn", exact: true })
    .fill("Still affects exports.");
  await discussion
    .getByRole("button", { name: "Gửi tin nhắn", exact: true })
    .click();
  await expect(
    page.getByText("Still affects exports.", { exact: true }),
  ).toBeVisible();
  const heading = await page
    .getByRole("heading", { name: "Export button does nothing", exact: true })
    .boundingBox();
  const bounds = await panel.boundingBox();
  expect(bounds).not.toBeNull();
  expect(heading).not.toBeNull();
  if (!bounds || !heading) throw new Error("Missing report layout bounds");
  expect(bounds.y).toBeGreaterThan(heading.y);
  await panel
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Checking export logs.");
  await panel.getByRole("button", { name: "Cập nhật", exact: true }).click();
  await expect(
    page.getByText("Đang xử lý", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Checking export logs.", { exact: true }),
  ).toBeVisible();
});

test("mobile details drawer preserves drafts and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/beacon-portal/support/bugs/BUG-1");
  const trigger = page.getByRole("button", { name: "Chi tiết", exact: true });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Chi tiết", exact: true });
  await expect(drawer.getByText("EXP-4401", { exact: true })).toBeVisible();
  await drawer
    .getByRole("textbox", { name: "Ghi chú", exact: true })
    .fill("Mobile draft");
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(
    drawer.getByRole("textbox", { name: "Ghi chú", exact: true }),
  ).toHaveValue("Mobile draft");
  await drawer.getByRole("button", { name: "Cập nhật", exact: true }).click();
  await drawer
    .getByRole("button", { name: "Đóng chi tiết", exact: true })
    .click();
  await expect(page.getByText("Mobile draft", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("overview keeps reviews and resources in the desktop panel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects/beacon-portal");
  const panel = page.getByRole("complementary", {
    name: "Chi tiết",
    exact: true,
  });
  await panel.getByRole("link", { name: "Hướng dẫn", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/beacon-portal\/guides$/);
});
