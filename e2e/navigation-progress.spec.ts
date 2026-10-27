import { expect, test } from "@playwright/test";

test("navigation shows progress until the destination responds", async ({
  page,
}) => {
  await page.goto("/");
  const destination = page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Applications", exact: true });

  let releaseNavigation = () => {};
  const navigationReleased = new Promise<void>((resolve) => {
    releaseNavigation = resolve;
  });
  await page.route("**/applications?*", async (route) => {
    await navigationReleased;
    await route.continue();
  });

  try {
    await destination.focus();
    await destination.press("Enter");
    await expect(page.locator("#nprogress .bar")).toBeVisible();
    await expect(page.locator("#nprogress .bar")).toHaveCSS("height", "2px");
    await expect(page.locator("#nprogress .peg")).toHaveCSS("box-shadow", "none");
    await expect(page.locator("#nprogress .spinner")).toHaveCount(0);
  } finally {
    releaseNavigation();
  }

  await expect(page).toHaveURL("/applications");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#nprogress")).toHaveCount(0);
});

test("clicking the current route does not leave a progress bar", async ({
  page,
}) => {
  await page.goto("/applications");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Applications", exact: true })
    .click();

  await expect(page).toHaveURL("/applications");
  await expect(page.locator("#nprogress")).toHaveCount(0);
});
