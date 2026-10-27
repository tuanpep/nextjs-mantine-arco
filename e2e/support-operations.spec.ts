import { expect, test } from "@playwright/test";

test("new issue can be assigned, retested, resolved and reopened", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/new");
  await page
    .getByRole("textbox", { name: "Brief summary" })
    .fill("Team export is blocked");
  await page
    .getByRole("textbox", { name: "Situation", exact: true })
    .fill("Export fails after choosing April.");
  await page.getByRole("button", { name: "Review request" }).click();
  await page.getByRole("button", { name: "Confirm creation in demo" }).click();
  const detailPath = await page
    .getByRole("link", { name: "View request" })
    .getAttribute("href");
  if (!detailPath) throw new Error("Missing new issue link");
  await page.getByRole("link", { name: "View request" }).click();
  await page
    .getByRole("textbox", { name: "Your update" })
    .fill("The whole team is affected now.");
  await page.getByRole("button", { name: "Add update in demo" }).click();
  await expect(
    page.getByText("The whole team is affected now.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Open DX operations demo" }).click();
  await page
    .getByRole("button", { name: "Production issues", exact: true })
    .click();
  await page
    .getByLabel("Select issue")
    .selectOption(detailPath.split("/").at(-1) ?? "");
  await page.getByLabel("Issue handler").selectOption("Mai Tran");
  await page.getByRole("button", { name: "Assign issue handler" }).click();
  await page.getByLabel("Support action").selectOption("retest");
  await page
    .getByLabel("Progress note or employee instructions")
    .fill("Try exporting April again.");
  await page
    .getByRole("button", { name: "Record support action in demo" })
    .click();
  await expect(
    page.getByText("Waiting for retest", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "View employee conversation and outcome" })
    .click();
  await page
    .getByRole("button", { name: "Confirm retest result in demo" })
    .click();
  await expect(page.getByText("Handling", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Open DX operations demo" }).click();
  await page
    .getByRole("button", { name: "Production issues", exact: true })
    .click();
  await page
    .getByLabel("Select issue")
    .selectOption(detailPath.split("/").at(-1) ?? "");
  await page.getByLabel("Support action").selectOption("resolve");
  await page.getByLabel("Outcome summary").fill("Export fixed");
  await page
    .getByLabel("Work done and verification")
    .fill("Corrected row selection and verified April totals.");
  await page.getByLabel("Limitations").fill("Demo data only.");
  await page
    .getByRole("button", { name: "Record support action in demo" })
    .click();
  await page.getByLabel("Show issues").selectOption("all");
  await page
    .getByLabel("Select issue")
    .selectOption(detailPath.split("/").at(-1) ?? "");
  await page
    .getByRole("link", { name: "View employee conversation and outcome" })
    .click();
  await expect(page.getByText("Export fixed", { exact: true })).toBeVisible();
  await page
    .getByLabel("Reason for reopening")
    .fill("The same export issue returned.");
  await page.getByRole("button", { name: "Confirm reopening in demo" }).click();
  await expect(page.getByText("Handling", { exact: true })).toBeVisible();
});
