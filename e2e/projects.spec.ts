import { expect, test } from "@playwright/test";

test("find a product, open support and return to the directory", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Home", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "View applications", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Applications", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search applications" })
    .fill("missing");
  await expect(
    page.getByRole("heading", { name: "No matching applications" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("link", { name: "Open application" }).click();
  await expect(
    page.getByRole("heading", { name: "Beacon Portal", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Browse Ideas" }).click();
  await page.getByRole("textbox", { name: "Search ideas" }).fill("missing");
  await expect(
    page.getByRole("heading", { name: "No matching ideas" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Applications", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Applications", exact: true }),
  ).toBeVisible();
});

test("unavailable products reveal no metadata", async ({ page }) => {
  await page.goto("/projects/orchid-reports");
  await expect(
    page.getByRole("heading", { name: "This destination is not available" }),
  ).toBeVisible();
  await expect(page.getByText("Orchid Reports")).toHaveCount(0);
});

test("mobile navigation can be opened and used", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/beacon-portal");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Project ideas", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ideas", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
});

test("home links to an actionable work item", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Help with the monthly report export" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Help with the monthly report export",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Your reply" })).toBeVisible();
});

test("pages share a centered content width without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  for (const route of [
    "/",
    "/projects",
    "/projects/beacon-portal",
    "/projects/beacon-portal/support",
    "/projects/beacon-portal/support/new",
    "/projects/beacon-portal/support/SUP112",
    "/projects/beacon-portal/ideas",
  ]) {
    await page.goto(route);
    const container = page.locator("main > div").first();
    await expect(container).toHaveCSS("max-width", "1280px");
    const bounds = await container.boundingBox();
    expect(bounds?.width).toBe(1280);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/beacon-portal/support/SUP112");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
