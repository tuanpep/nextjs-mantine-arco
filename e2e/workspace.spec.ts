import { expect, test } from "@playwright/test";

test("header switcher keeps the current section in another project", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/feedback");
  await page
    .getByRole("combobox", { name: "Switch project" })
    .first()
    .selectOption("orchid-reports");
  await expect(page).toHaveURL("/projects/orchid-reports/feedback");
  await expect(
    page.getByRole("heading", { name: "Feedback", exact: true }),
  ).toBeVisible();
});

test("UAT campaign records results without release acceptance", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/uat");
  await expect(
    page.getByRole("heading", { name: "UAT campaigns" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Accept campaign in demo" }),
  ).toHaveCount(0);
  await page
    .getByLabel("Result for UAT-01")
    .selectOption("Fail");
  await expect(page.getByLabel("UAT-01")).toContainText("Fail");
  await expect(page.getByRole("heading", { name: "Campaign progress" })).toBeVisible();
});

test("settings shows archive blocked", async ({ page }) => {
  await page.goto("/projects/beacon-portal/settings");
  await expect(
    page.getByRole("heading", { name: "Project settings" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Archive unavailable" }),
  ).toBeDisabled();
});
