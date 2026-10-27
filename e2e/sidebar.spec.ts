import { expect, test } from "@playwright/test";

test("home lists projects; project context shows stable modules", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toHaveAttribute("href", "#main-content");
  await expect(page.locator("#main-content")).toHaveCount(1);
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(
    navigation.getByRole("link", { name: "Home", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    navigation.getByRole("link", { name: "Overview", exact: true }),
  ).toHaveCount(0);
  await expect(
    navigation.getByRole("link", { name: "Support", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("main")
    .getByRole("link", { name: /Beacon Portal/ })
    .click();
  await expect(page).toHaveURL("/projects/beacon-portal");
  await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveText([
    "Home",
    "Overview",
    "Support",
    "Feedback",
    "Ideas",
    "UAT",
    "Settings",
  ]);
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(
    navigation.getByRole("link", { name: "Overview", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("sidebar keeps one active section across project work items", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  const destinations = await navigation
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));

  expect(new Set(destinations).size).toBe(destinations.length);

  await navigation.getByRole("link", { name: "Ideas", exact: true }).click();
  await expect(page).toHaveURL("/projects/beacon-portal/ideas");
  await expect(
    navigation.getByRole("link", { name: "Ideas", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);

  await page.goto("/projects/beacon-portal/support/SUP112");
  await expect(
    navigation.getByRole("link", { name: "Support", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  await navigation.getByRole("link", { name: "Feedback", exact: true }).click();
  await expect(page).toHaveURL("/projects/beacon-portal/feedback");
  await expect(
    page.getByRole("heading", { name: "Feedback", exact: true }),
  ).toBeVisible();
});
