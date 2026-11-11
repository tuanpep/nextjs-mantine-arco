import { expect, test } from "@playwright/test";

test("shows Vietnamese welcome by default", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Chào mừng" })).toBeVisible();
});

test("switches to English", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Ngôn ngữ" }).selectOption("en");
  await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
