import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "DX_LOCALE",
      value: "en",
      domain: "localhost",
      path: "/",
      httpOnly: true,
    },
  ]);
});

test("drawer preserves a declined discard and accepts unknown reproduction", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/bugs");
  await page.getByRole("button", { name: "Open request", exact: true }).click();
  const drawer = page.getByRole("dialog");
  await drawer
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Drawer intermittent failure");
  page.once("dialog", (dialog) => dialog.dismiss());
  await drawer.getByRole("button", { name: "Close", exact: true }).click();
  await expect(
    drawer.getByRole("textbox", { name: "Title", exact: true }),
  ).toHaveValue("Drawer intermittent failure");
  await drawer
    .getByRole("textbox", { name: "What happened", exact: true })
    .fill("Saving sometimes fails");
  await drawer
    .getByRole("textbox", { name: "Expected result", exact: true })
    .fill("Changes save");
  const steps = drawer.getByRole("textbox", {
    name: "Steps to reproduce",
    exact: true,
  });
  await steps.fill("Hidden steps");
  const unknown = drawer.getByRole("checkbox", {
    name: "I don't know how to reproduce this",
  });
  await unknown.check();
  await expect(steps).not.toBeVisible();
  await unknown.uncheck();
  await expect(steps).toHaveValue("Hidden steps");
  await unknown.check();
  await drawer
    .getByRole("combobox", { name: "Who is affected" })
    .selectOption("unsure");
  await drawer
    .getByRole("combobox", { name: "How soon" })
    .selectOption("unsure");
  await drawer
    .getByRole("button", { name: "Create bug report", exact: true })
    .click();
  await drawer
    .getByRole("link", { name: "Drawer intermittent failure" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Drawer intermittent failure" }),
  ).toBeVisible();
  await expect(
    page.getByText("I don't know how to reproduce this", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Hidden steps", { exact: true }),
  ).not.toBeVisible();
});

test("full form warns before leaving a draft and allows confirmed discard", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/bugs/new");
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Unsaved report");
  const back = page
    .getByRole("main")
    .getByRole("link", { name: "Bug Reports", exact: true });
  page.once("dialog", (dialog) => dialog.dismiss());
  await back.click();
  await expect(
    page.getByRole("textbox", { name: "Title", exact: true }),
  ).toHaveValue("Unsaved report");
  page.once("dialog", (dialog) => dialog.accept());
  await back.click();
  await expect(page).toHaveURL(/\/support\/bugs$/);
});

test("both entry points suggest related reports and focus an overlong title", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/bugs/new");
  const title = page.getByRole("textbox", { name: "Title", exact: true });
  await title.fill("Export button does nothing");
  const related = page.getByRole("region", { name: "Related reports" });
  await expect(
    related.getByRole("link", { name: /Export button does nothing/ }),
  ).toBeVisible();
  page.once("dialog", (dialog) => dialog.dismiss());
  await related
    .getByRole("link", { name: /Export button does nothing/ })
    .click();
  await expect(title).toHaveValue("Export button does nothing");
  await title.fill("x".repeat(161));
  await page.getByRole("button", { name: "Review" }).click();
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("main")
    .getByRole("link", { name: "Bug Reports", exact: true })
    .click();
  await page.getByRole("button", { name: "Open request", exact: true }).click();
  const drawer = page.getByRole("dialog");
  const drawerTitle = drawer.getByRole("textbox", {
    name: "Title",
    exact: true,
  });
  await drawerTitle.fill("Export button does nothing");
  await expect(
    drawer
      .getByRole("region", { name: "Related reports" })
      .getByRole("link", { name: /Export button does nothing/ }),
  ).toBeVisible();
  await drawerTitle.fill("x".repeat(161));
  await drawer.getByRole("button", { name: "Create bug report" }).click();
  await expect(drawerTitle).toBeFocused();
  await expect(drawerTitle).toHaveAttribute("aria-invalid", "true");
});
