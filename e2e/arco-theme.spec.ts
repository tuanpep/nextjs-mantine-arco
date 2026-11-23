import { expect, test } from "@playwright/test";

import messages from "../messages/vi.json";

test("applies Arco controls and switches schemes with the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/components/button");

  const html = page.locator("html");
  const body = page.locator("body");
  const { primary: primaryLabel, secondary: secondaryLabel } =
    messages.ComponentBook.components;
  const primary = page.getByRole("button", { name: primaryLabel, exact: true });
  const secondary = page.getByRole("button", {
    name: secondaryLabel,
    exact: true,
  });
  const language = page.getByRole("combobox", { name: messages.App.language });
  const toggle = page.getByRole("button", { name: messages.App.darkTheme });

  await expect(html).toHaveAttribute("data-mantine-color-scheme", "light");
  await expect(body).toHaveCSS("font-size", "14px");
  await expect(primary).toHaveCSS("background-color", "rgb(22, 93, 255)");
  await expect(primary).toHaveCSS("height", "32px");
  await expect(primary).toHaveCSS("border-radius", "2px");
  await primary.hover();
  await expect(primary).toHaveCSS("background-color", "rgb(14, 66, 210)");
  await page.mouse.move(0, 0);
  await expect(secondary).toHaveCSS("background-color", "rgb(242, 243, 245)");
  await expect(language).toBeEnabled();
  await expect(language).toHaveCSS("height", "24px");
  await expect(language).toHaveCSS("background-color", "rgb(242, 243, 245)");

  await language.focus();
  await expect(language).toHaveCSS("border-top-color", "rgb(22, 93, 255)");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");

  await expect(html).toHaveAttribute("data-mantine-color-scheme", "dark");
  await expect(body).toHaveCSS("background-color", "rgb(23, 23, 26)");
  await expect(primary).toHaveCSS("background-color", "rgb(60, 126, 255)");
  await expect(primary).toHaveCSS("color", "rgb(0, 0, 0)");
  await expect(
    page.getByRole("button", { name: messages.App.lightTheme }),
  ).toBeFocused();

  await page.reload();
  await expect(html).toHaveAttribute("data-mantine-color-scheme", "dark");
});

test("styles the open select, keyboard highlight, and multiple values", async ({
  page,
}) => {
  await page.goto("/components/select");
  const { components, status } = messages.ComponentBook;
  const select = page.getByRole("combobox", {
    name: components.searchableSelect,
    exact: true,
  });
  const listbox = page.getByRole("listbox", {
    name: components.searchableSelect,
    exact: true,
  });
  const option = listbox.getByRole("option", {
    name: status.published,
    exact: true,
  });

  await select.click();
  await expect(select).toHaveAttribute("aria-expanded", "true");
  const dropdown = listbox.locator("..");
  await expect(dropdown).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(dropdown).toHaveCSS("border-radius", "4px");
  await expect(option).toHaveCSS("min-height", "36px");
  await select.fill("no-matching-options");
  await expect(
    page.getByText(components.nothingFound, { exact: true }),
  ).toBeVisible();
  await select.fill(status.published);
  await select.press("ArrowDown");
  await expect(option).toHaveCSS("background-color", "rgb(242, 243, 245)");
  await select.press("Enter");
  await expect(select).toHaveValue(status.published);
  await select.click();
  await expect(option).toHaveAttribute("aria-selected", "true");
  await expect(option).toHaveCSS("font-weight", "500");
  await select.press("Escape");
  await expect(select).toHaveAttribute("aria-expanded", "false");
  await expect(select).toBeFocused();

  await page.getByRole("button", { name: messages.App.darkTheme }).click();
  await select.click();
  await expect(dropdown).toHaveCSS("background-color", "rgb(55, 55, 57)");
  await select.press("Escape");

  await page.goto("/components/multi-select");
  await expect(
    page.getByRole("combobox", { name: messages.App.language }),
  ).toBeEnabled();
  const multi = page.getByRole("combobox", {
    name: components.searchableMultiSelect,
    exact: true,
  });
  await multi.click();
  await expect(multi).toHaveAttribute("aria-expanded", "true");
  await page
    .getByRole("listbox", {
      name: components.searchableMultiSelect,
      exact: true,
    })
    .getByRole("option", { name: status.review, exact: true })
    .click();
  await multi.press("Escape");
  const pill = page
    .locator(".mantine-Pill-root")
    .filter({ hasText: status.review });
  await expect(pill).toBeVisible();
  await expect(pill).toHaveCSS("border-radius", "2px");
  await expect(pill).toHaveCSS("height", "20px");
});

test("applies Arco active states to tabs and pagination", async ({ page }) => {
  await page.goto("/components/tabs");
  const { analytics } = messages.ComponentBook.components.tab;
  const tab = page.getByRole("tab", { name: analytics });
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(tab).toHaveCSS("color", "rgb(22, 93, 255)");
  await expect(tab).toHaveCSS("font-weight", "500");

  await page.goto("/components/pagination");
  const secondPage = page
    .getByRole("main")
    .getByRole("article", { name: "Pagination", exact: true })
    .getByRole("button", { name: "2", exact: true });
  await secondPage.click();
  await expect(secondPage).toHaveAttribute("aria-current", "page");
  await expect(secondPage).toHaveCSS("background-color", "rgb(232, 243, 255)");
});
