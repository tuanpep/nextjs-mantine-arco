import { expect, test } from "@playwright/test";

test("overview uses one section link and keeps project context in the switcher", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal");
  const main = page.getByRole("main");
  const bugs = main.getByRole("region").first();
  const headingLink = bugs.getByRole("link").first();
  await expect(headingLink).toHaveAttribute(
    "href",
    "/projects/beacon-portal/support/bugs?view=open&sort=severity-desc",
  );
  await headingLink.focus();
  await expect(headingLink).toBeFocused();
  await headingLink.press("Enter");
  await expect(page).toHaveURL(
    "/projects/beacon-portal/support/bugs?view=open&sort=severity-desc",
  );
  await expect(
    page.getByRole("combobox", { name: "Chuyển dự án" }).first(),
  ).toContainText("Beacon Portal");
});

test("mobile overview keeps compact cards within the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/beacon-portal");
  await expect(page.getByRole("main").getByRole("region")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Mở menu điều hướng" }).click();
  await expect(
    page
      .getByRole("navigation", { name: "Điều hướng chính" })
      .getByRole("combobox", { name: "Chuyển dự án" }),
  ).toBeVisible();
});
