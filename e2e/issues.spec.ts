import { expect, test } from "@playwright/test";

test("issues page filters the list and opens a details page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/issues$/);

  await expect(
    page.getByRole("heading", { level: 1, name: "Issues" }),
  ).toBeVisible();

  await page.getByRole("textbox", { name: "Search issues" }).fill("Export");
  await expect(
    page.getByRole("link", { name: /Export skips the last page/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Invitation email never arrives/ }),
  ).toHaveCount(0);

  await page.getByRole("link", { name: /Export skips the last page/ }).click();
  await expect(page).toHaveURL(/\/issues\/SUP-1038$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Export skips the last page",
    }),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Activity" }).click();
  await expect(page.getByText("Status set to Waiting")).toBeVisible();

  await page.getByRole("main").getByRole("link", { name: "Issues" }).click();
  await expect(page).toHaveURL(/\/issues$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Issues" }),
  ).toBeVisible();
});
