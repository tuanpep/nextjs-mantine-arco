import { expect, test } from "@playwright/test";

import en from "../messages/en.json";
import vi from "../messages/vi.json";

test("navigates and filters components on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  const book = vi.ComponentBook;
  await expect(page.getByRole("heading", { name: book.title })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: vi.App.skipToContent }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();

  const main = page.getByRole("main");
  await expect(
    main.getByRole("link", { name: "DataTable", exact: true }),
  ).toBeVisible();
  await expect(main.getByRole("article")).toHaveCount(0);
  const nav = page.getByRole("navigation", { name: book.menu });
  await page.getByRole("button", { name: book.toggleMenu }).click();
  await expect(nav).toBeVisible();
  await nav.getByRole("textbox", { name: book.search }).fill("data table");
  await expect(
    nav.getByRole("link", { name: "Tabs", exact: true }),
  ).toHaveCount(0);
  await nav.getByRole("link", { name: "DataTable", exact: true }).click();
  await expect(page).toHaveURL(/\/components\/data-table$/);
  await expect(
    main.getByRole("heading", { name: "DataTable", exact: true }),
  ).toBeVisible();
  await expect(main.getByRole("table")).toBeVisible();
  await expect(nav).toBeHidden();
  expect(
    await page.locator("body").evaluate((body) => body.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("switches to English", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: vi.App.language }).click();
  await page
    .getByRole("listbox", { name: vi.App.language })
    .getByRole("option", { name: "English" })
    .click();
  await expect(
    page.getByRole("heading", { name: en.ComponentBook.title }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("marks the current component in desktop navigation", async ({ page }) => {
  await page.goto("/components/button");
  const nav = page.getByRole("navigation", { name: vi.ComponentBook.menu });
  await expect(
    nav.getByRole("link", { name: "Button", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await nav
    .getByRole("textbox", { name: vi.ComponentBook.search })
    .fill("multi-select");
  await expect(
    nav.getByRole("link", { name: "MultiSelect", exact: true }),
  ).toBeVisible();
  await expect(
    nav.getByRole("link", { name: "Button", exact: true }),
  ).toHaveCount(0);
});

test("old showcase routes no longer exist", async ({ request }) => {
  for (const path of [
    "/showcase",
    "/showcase/components",
    "/showcase/dashboard",
    "/components/not-a-component",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
