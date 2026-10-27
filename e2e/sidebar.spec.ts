import { expect, test } from "@playwright/test";

test("employee destinations stay separate from application navigation", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(navigation.getByRole("link")).toHaveText([
    "Home",
    "Applications",
    "Get help",
    "Service catalog",
    "My service requests",
    "Learning",
    "UAT & testing",
    "Improvements",
    "Service status",
    "DX operations",
  ]);
  await expect(navigation.getByText("DX team · Demo")).toBeVisible();
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);

  await navigation.getByRole("link", { name: "DX operations" }).click();
  await expect(page).toHaveURL("/operations");
  await expect(
    navigation.getByRole("link", { name: "DX operations" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
});

test("sidebar has unique destinations and one active support link", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  const destinations = await navigation
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

  expect(new Set(destinations).size).toBe(destinations.length);
  await expect(
    navigation.getByRole("region", { name: "Beacon Portal" }).getByRole("link"),
  ).toHaveText(["Overview", "Support", "Project ideas"]);
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(
    navigation.getByRole("link", { name: "Support", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    navigation.getByRole("link", { name: "Production support", exact: true }),
  ).toHaveCount(0);

  await navigation.getByRole("link", { name: "Support", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/projects/beacon-portal/support");

  await page.goto("/projects/beacon-portal/support/SUP112");
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(
    navigation.getByRole("link", { name: "Support", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  await navigation
    .getByRole("link", { name: "Project ideas", exact: true })
    .click();
  await expect(page).toHaveURL("/projects/beacon-portal/ideas");
  await expect(
    navigation.getByRole("link", { name: "Project ideas", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);

  await navigation.getByRole("link", { name: "Get help", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Get help" })).toBeVisible();
  await expect(
    navigation.getByRole("link", { name: "Support", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Report a production issue" }).click();
  await expect(
    page.getByRole("textbox", { name: "Brief summary" }),
  ).toBeVisible();
});
