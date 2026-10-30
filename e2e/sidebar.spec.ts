import { expect, test } from "@playwright/test";

test("root shows only Projects and entering a project reveals its menu once", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Điều hướng chính" });
  await expect(navigation.getByRole("link")).toHaveText(["Dự án"]);
  await expect(navigation.getByRole("button")).toHaveCount(0);
  await expect(navigation.getByText("Dự án hiện tại")).toHaveCount(0);
  await page
    .getByRole("main")
    .getByRole("link", { name: /Beacon Portal/ })
    .click();
  await expect(page).toHaveURL("/projects/beacon-portal");
  await expect(navigation.getByRole("link")).toHaveText([
    "Tổng quan",
    "Hỗ trợ",
    "Phản hồi",
    "Ý tưởng",
    "Kiểm thử nghiệm thu",
    "Cài đặt dự án",
  ]);
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(
    navigation.getByRole("link", { name: "Dự án", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "DX Portal" }).click();
  await expect(navigation.getByRole("link")).toHaveText(["Dự án"]);
});

test("mobile root hides project menus until a project is selected", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Mở điều hướng" }).click();
  const navigation = page.getByRole("navigation", { name: "Điều hướng chính" });
  await expect(navigation.getByRole("link")).toHaveText(["Dự án"]);
  await expect(navigation.getByRole("combobox")).toHaveCount(0);
  await page.getByRole("button", { name: "Đóng điều hướng" }).click();
  await page
    .getByRole("main")
    .getByRole("link", { name: /Beacon Portal/ })
    .click();
  await page.getByRole("button", { name: "Mở điều hướng" }).click();
  await navigation.getByRole("link", { name: "Ý tưởng", exact: true }).click();
  await expect(page).toHaveURL("/projects/beacon-portal/ideas");
  await page.getByRole("button", { name: "Mở điều hướng" }).click();
  await navigation.getByRole("combobox", { name: "Chuyển dự án" }).click();
  await page.getByRole("option", { name: "Orchid Reports" }).click();
  await expect(page).toHaveURL("/projects/orchid-reports/ideas");
});

test("nested project records keep one active destination and no duplicate links", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/SUP112");
  const navigation = page.getByRole("navigation", { name: "Điều hướng chính" });
  await expect(
    navigation.getByRole("link", { name: "Hỗ trợ", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  const destinations = await navigation
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(new Set(destinations).size).toBe(destinations.length);
});
