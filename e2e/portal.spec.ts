import { expect, test } from "@playwright/test";

test("navigation keeps only the primary workspace destinations", async ({
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
  for (const title of [
    "Everyday support",
    "Applications & learning",
    "Testing & improvement",
  ]) {
    await expect(navigation.getByText(title, { exact: true })).toHaveCount(0);
  }
});

test("help search recovers and routes to production support", async ({
  page,
}) => {
  await page.goto("/help");
  await page
    .getByRole("textbox", { name: "Find the right help" })
    .fill("not-a-topic");
  await expect(
    page.getByRole("heading", { name: "No matching help topics" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(
    page.getByRole("textbox", { name: "Find the right help" }),
  ).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "No matching help topics" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Report a production issue" }).click();
  await expect(page).toHaveURL("/projects/beacon-portal/support/new");
  await expect(
    page.getByRole("textbox", { name: "Brief summary" }),
  ).toBeVisible();
  await expect(
    page.getByRole("alert").filter({ hasText: "Production support" }),
  ).toBeVisible();
});

test("primary destinations are reachable through mobile navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const name of [
    "Applications",
    "Get help",
    "My service requests",
    "Home",
  ]) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
