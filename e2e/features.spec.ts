import { expect, test } from "@playwright/test";

const base = "/projects/beacon-portal/ideas/features";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "DX_LOCALE", value: "en", domain: "localhost", path: "/" },
  ]);
});

test("search outcomes, preserve queue context, and clear no matches", async ({
  page,
}) => {
  await page.goto(`${base}?view=all&sort=title-desc`);
  await expect(
    page.getByRole("textbox", { name: "Search", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("darker palette");
  await expect(page).toHaveURL(/q=darker/);
  await expect(
    page
      .getByRole("list", { name: "Feature Requests", exact: true })
      .getByRole("link"),
  ).toHaveCount(1);
  const link = page.getByRole("link", {
    name: "Dark charts for long sessions",
    exact: true,
  });
  await expect(link).toBeVisible();
  await link.click();
  await page
    .getByRole("link", { name: "Back to feature requests", exact: true })
    .click();
  await expect(page).toHaveURL(/sort=title-desc/);
  await expect(
    page.getByRole("textbox", { name: "Search", exact: true }),
  ).toHaveValue("darker palette");
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("unmatched-feature");
  await expect(
    page.getByText("No matching feature requests", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .first()
    .click();
  await expect(
    page
      .getByRole("list", { name: "Feature Requests", exact: true })
      .getByRole("link"),
  ).toHaveCount(2);
});

test("create with suggestions, protect draft, decide, and add follow-up", async ({
  page,
}) => {
  await page.goto(`${base}/new`);
  await expect(
    page.getByRole("button", { name: "Create feature request", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Saved views for release teams");
  await expect(
    page.getByRole("region", { name: "Similar requests" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Similar requests" })
      .getByRole("link")
      .first(),
  ).toHaveAttribute("target", "_blank");
  await page
    .getByRole("textbox", { name: "Problem", exact: true })
    .fill("Release teams rebuild filters");
  await page
    .getByRole("textbox", { name: "Desired outcome", exact: true })
    .fill("Reopen a release view");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("link", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Title", exact: true }),
  ).toHaveValue("Saved views for release teams");
  await page
    .getByRole("button", { name: "Create feature request", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Saved views for release teams",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Decision reason", exact: true })
    .fill("Useful for review, no delivery date");
  await page
    .getByRole("button", { name: "Apply decision", exact: true })
    .click();
  await expect(
    page.getByText("Useful for review, no delivery date", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Apply decision", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Note", exact: true })
    .fill("Include release coordinators");
  await page.getByRole("button", { name: "Add note", exact: true }).click();
  await expect(
    page.getByText("Include release coordinators", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByText("Accepted", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to feature requests", exact: true })
    .click();
  await page.getByRole("tab", { name: /All/ }).click();
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("Include release coordinators");
  await expect(
    page.getByRole("link", {
      name: "Saved views for release teams",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("link", {
      name: "Saved views for release teams",
      exact: true,
    }),
  ).toHaveCount(0);
});

test("drawer uses feature validation and selected-project suggestions", async ({
  page,
}) => {
  await page.goto(base);
  await expect(
    page.getByRole("textbox", { name: "Search", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Open request", exact: true })
    .first()
    .click();
  const drawer = page.getByRole("dialog");
  await drawer
    .getByRole("combobox", { name: "Type", exact: true })
    .selectOption("feature");
  await expect(
    drawer.getByRole("button", { name: "Create feature request", exact: true }),
  ).toBeEnabled();
  await drawer
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("x".repeat(161));
  await drawer
    .getByRole("textbox", { name: "Problem", exact: true })
    .fill("A problem");
  await drawer
    .getByRole("textbox", { name: "Desired outcome", exact: true })
    .fill("An outcome");
  await drawer
    .getByRole("button", { name: "Create feature request", exact: true })
    .click();
  await expect(
    drawer.getByText("Use 160 characters or fewer.", { exact: true }),
  ).toBeVisible();
  await drawer
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Saved views for teams");
  await expect(
    drawer.getByRole("region", { name: "Similar requests" }),
  ).toBeVisible();
  await drawer
    .getByRole("button", { name: "Create feature request", exact: true })
    .click();
  await drawer
    .getByRole("link", { name: "Saved views for teams", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Saved views for teams", exact: true }),
  ).toBeVisible();
});
