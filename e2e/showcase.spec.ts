import { expect, test } from "@playwright/test";

test("showcase opens a modal from the shared navigation", async ({ page }) => {
  await page.goto("/issues");
  await page.getByRole("link", { name: "Showcase" }).click();

  await expect(page).toHaveURL(/\/showcase$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Showcase" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirm" })).toBeVisible();

  await page.getByRole("button", { name: "Open modal" }).click();
  await expect(page.getByRole("dialog", { name: "Close issue" })).toBeVisible();
  await page.getByRole("button", { name: "Resolve" }).click();
  await expect(page.getByRole("dialog", { name: "Close issue" })).toHaveCount(
    0,
  );
});
