import { expect, test } from "@playwright/test";

const base = "/projects/beacon-portal/ideas/feedback";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "DX_LOCALE", value: "en", domain: "localhost", path: "/" },
  ]);
});

test("create and review feedback, search its note, and lose demo changes on reload", async ({
  page,
}) => {
  await page.goto(`${base}/new`);
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Confusing export action");
  await page
    .getByRole("textbox", { name: "Observation", exact: true })
    .fill("The export action is hard to find.");
  await page
    .getByRole("button", { name: "Save feedback", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Confusing export action", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Review note", exact: true })
    .fill("Check the export action placement");
  await page
    .getByRole("button", { name: "Mark reviewed", exact: true })
    .click();
  await expect(
    page.getByRole("status").getByText("Feedback marked reviewed."),
  ).toBeVisible();
  await expect(
    page.getByText("Check the export action placement", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Mark reviewed", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("link", { name: "Back to feedback", exact: true })
    .click();
  await page.getByRole("tab", { name: /Reviewed/ }).click();
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Check the export action placement");
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .press("Enter");
  const created = page.getByRole("link", {
    name: "Confusing export action",
    exact: true,
  });
  await expect(created).toBeVisible();
  await page.reload();
  await expect(created).toHaveCount(0);
});

test("preserve the filtered queue through detail and search fixture notes", async ({
  page,
}) => {
  await page.goto(`${base}?view=all&sort=title-desc&page=1`);
  const search = page.getByRole("textbox", { name: "Search", exact: true });
  await search.fill("Noted for a future copy pass");
  await search.press("Enter");
  const fixture = page.getByRole("link", {
    name: "The confirmation copy is clear",
    exact: true,
  });
  await expect(fixture).toBeVisible();
  await fixture.click();
  await expect(
    page.getByText(
      "Noted for a future copy pass. This is not a commitment to change it.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Mark reviewed", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("link", { name: "Back to feedback", exact: true })
    .click();
  await expect(page).toHaveURL(/q=Noted/);
  await expect(page).toHaveURL(/view=all/);
  await expect(page).toHaveURL(/sort=title-desc/);
  await expect(fixture).toBeVisible();
});

test("dismiss cancel confirmation to keep an unsaved draft", async ({
  page,
}) => {
  await page.goto(`${base}/new`);
  const title = page.getByRole("textbox", { name: "Title", exact: true });
  await title.fill("Draft feedback");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("link", { name: "Cancel", exact: true }).click();
  await expect(title).toHaveValue("Draft feedback");
});

test("shared intake validates feedback lengths and saves", async ({ page }) => {
  await page.goto(base);
  await page
    .getByRole("button", { name: "Open request", exact: true })
    .first()
    .click();
  const drawer = page.getByRole("dialog");
  await drawer
    .getByRole("combobox", { name: "Type", exact: true })
    .selectOption("feedback");
  const title = drawer.getByRole("textbox", { name: "Title", exact: true });
  const observation = drawer.getByRole("textbox", {
    name: "Observation",
    exact: true,
  });
  await title.fill("x".repeat(161));
  await observation.fill("x".repeat(10001));
  await drawer
    .getByRole("button", { name: "Save feedback", exact: true })
    .click();
  await expect(
    drawer.getByText("Use 160 characters or fewer.", { exact: true }),
  ).toBeVisible();
  await expect(
    drawer.getByText("Use 10,000 characters or fewer.", { exact: true }),
  ).toBeVisible();
  await title.fill("Feedback from shared intake");
  await observation.fill("The action was easy to find.");
  await drawer
    .getByRole("button", { name: "Save feedback", exact: true })
    .click();
  await drawer
    .getByRole("link", { name: "Feedback from shared intake", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Feedback from shared intake",
      exact: true,
    }),
  ).toBeVisible();
});

test("feedback cannot be accessed through another project", async ({
  page,
}) => {
  await page.goto("/projects/orchid-reports/ideas/feedback/FB-1");
  await expect(
    page.getByText("This page is unavailable", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("The export label is easy to miss", { exact: true }),
  ).toHaveCount(0);
});
