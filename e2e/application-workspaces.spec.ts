import { expect, test } from "@playwright/test";

test("switching applications changes the support scope and rejects cross-application detail", async ({ page }) => {
  await page.goto("/projects/beacon-portal/support");
  await expect(page.getByRole("link", { name: "Help with the monthly report export", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Scheduled report did not arrive", exact: true })).toHaveCount(0);
  await page.getByRole("combobox", { name: "Switch application" }).selectOption("orchid-reports");
  await expect(page.getByRole("heading", { name: "Orchid Reports", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "View Support", exact: true }).click();
  await expect(page.getByRole("link", { name: "Scheduled report did not arrive", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Help with the monthly report export", exact: true })).toHaveCount(0);
  await page.goto("/projects/orchid-reports/support/SUP112");
  await expect(page.getByRole("heading", { name: "Support unavailable" })).toBeVisible();
});

test("global intake works without knowing the application and appears in My requests", async ({ page }) => {
  await page.goto("/help");
  await page.getByRole("link", { name: "Report a production issue" }).click();
  await expect(page.getByRole("combobox", { name: "Affected application" })).toHaveValue("");
  await page.getByRole("textbox", { name: "Brief summary" }).fill("Unknown reporting tool is blocked");
  await page.getByRole("textbox", { name: "Situation" }).fill("I followed a saved link but do not know which application owns it.");
  await page.getByRole("button", { name: "Review request" }).click();
  await page.getByRole("button", { name: "Confirm creation in demo" }).click();
  await expect(page.getByText(/Responsible team: DX triage/)).toBeVisible();
  await page.getByRole("link", { name: "View request", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Unknown reporting tool is blocked" })).toBeVisible();
  await page.getByRole("link", { name: "My requests", exact: true }).click();
  await page.getByRole("button", { name: "Support requests", exact: true }).click();
  await expect(page.getByRole("link", { name: "Unknown reporting tool is blocked" })).toBeVisible();
});
