import { expect, test } from "@playwright/test";

test("Vietnamese default, keyboard switching, persistence, and unchanged URLs", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto("/projects/beacon-portal/support?view=list");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  const navigation = page.getByRole("navigation", { name: "Điều hướng chính" });
  await expect(
    navigation.getByRole("link", { name: "Hỗ trợ", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  const selector = page.getByRole("combobox", { name: "Ngôn ngữ" });
  await selector.focus();
  await expect(selector).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL("/projects/beacon-portal/support?view=list");
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Support", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Language" })).toHaveValue(
    "en",
  );
  await page.getByRole("link", { name: "Ideas", exact: true }).click();
  await expect(page).toHaveURL("/projects/beacon-portal/ideas");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("combobox", { name: "Language" }).selectOption("vi");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(
    page.getByRole("link", { name: "Ý tưởng", exact: true }),
  ).toBeVisible();
});

test("unsupported locale cookies fall back to Vietnamese", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "DX_LOCALE", value: "fr", url: "http://localhost:4202" },
  ]);
  await page.goto("/projects/beacon-portal/support");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.getByRole("combobox", { name: "Ngôn ngữ" })).toHaveValue(
    "vi",
  );
});

test("mobile selector remains accessible and failed changes can be retried", async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/projects/beacon-portal/support");
  const selector = page.getByRole("combobox", { name: "Ngôn ngữ" });
  await expect(selector).toBeVisible();
  await page.route("**/projects/beacon-portal/support", async (route) => {
    if (route.request().method() === "POST") {
      await route.abort();
    } else {
      await route.continue();
    }
  });
  await selector.selectOption("en");
  const error = page.getByRole("alert").filter({
    hasText: "Không thể đổi ngôn ngữ. Vui lòng thử lại.",
  });
  await expect(error).toBeVisible();
  await expect(selector).toBeEnabled();
  await expect(selector).toHaveValue("vi");
  await page.unroute("**/projects/beacon-portal/support");
  await selector.selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(error).toHaveCount(0);
});
