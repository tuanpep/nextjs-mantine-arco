import { expect, test } from "@playwright/test";

test("review and create a local request, then open its unclaimed detail", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/new");
  await page
    .getByRole("textbox", { name: "Brief summary" })
    .fill("Unable to open the workspace");
  await page
    .getByRole("textbox", { name: "Situation" })
    .fill("I selected my workspace and the page stayed blank.");
  await page.getByRole("button", { name: "Review request" }).click();
  await expect(
    page.getByRole("heading", { name: "Review your request" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to edit" }).click();
  await expect(
    page.getByRole("textbox", { name: "Brief summary" }),
  ).toHaveValue("Unable to open the workspace");
  await page.getByRole("button", { name: "Review request" }).click();
  await page.getByRole("button", { name: "Confirm creation in demo" }).click();
  await expect(
    page.getByRole("heading", { name: "Request created in this demo" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View request" }).click();
  await expect(
    page.getByRole("heading", { name: "Unable to open the workspace" }),
  ).toBeVisible();
  await expect(
    page.getByText("Unclaimed", { exact: true }).first(),
  ).toBeVisible();
});

test("sender clarification reply returns the next action to the handler", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/SUP112");
  await page
    .getByRole("textbox")
    .fill("This happens in the test workspace after signing in.");
  await page.getByRole("button", { name: "Send reply in demo" }).click();
  await expect(
    page.getByText("This happens in the test workspace after signing in.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send reply in demo" }),
  ).toHaveCount(0);
});
