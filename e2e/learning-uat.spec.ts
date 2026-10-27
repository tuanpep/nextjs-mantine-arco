import { expect, test } from "@playwright/test";

test("read a guide and track personal onboarding progress", async ({
  page,
}) => {
  await page.goto("/learning");
  await page.getByLabel("Search guides").fill("acceptance");
  await page
    .getByRole("button", { name: /Run your first acceptance test/ })
    .click();
  await expect(page.getByText("Prepare a safe test")).toBeVisible();
  await page.getByRole("button", { name: "Yes, helpful" }).click();
  await expect(
    page.getByText(/Feedback noted in this demo: helpful/),
  ).toBeVisible();
  await page.getByLabel("Your learning role").selectOption("Tester");
  await page
    .getByRole("checkbox", { name: "Read the first acceptance test guide" })
    .check();
  await expect(
    page.getByText("1 of 4 steps complete for tester"),
  ).toBeVisible();
});

test("validate a defect and require a passing retest before acceptance", async ({
  page,
}) => {
  await page.goto("/uat");
  const accept = page.getByRole("button", { name: "Accept campaign in demo" });
  await expect(accept).toBeDisabled();
  await page.getByRole("button", { name: "Add defect in demo" }).click();
  await expect(page.getByText("Enter a defect summary.")).toBeVisible();
  await page.getByLabel("Result for UAT-01").selectOption("Fail");
  await page
    .getByLabel("Defect summary")
    .fill("Project search does not return Beacon");
  await page
    .getByLabel("Steps and actual behavior")
    .fill("Search for Beacon. Expected its project card; observed no results.");
  await page.getByRole("button", { name: "Add defect in demo" }).click();
  await page.getByRole("button", { name: "Start retest for DEF-1" }).click();
  await expect(page.getByLabel("Result for UAT-01")).toHaveValue("Not run");
  await expect(
    page.getByRole("button", { name: "Resolve DEF-1 after retest" }),
  ).toBeDisabled();
  for (const id of ["UAT-01", "UAT-02", "UAT-03"])
    await page.getByLabel(`Result for ${id}`).selectOption("Pass");
  await expect(accept).toBeDisabled();
  await page
    .getByRole("button", { name: "Resolve DEF-1 after retest" })
    .click();
  await accept.click();
  await expect(
    page.getByText(
      "Campaign accepted in this demo. No real release approval was created.",
    ),
  ).toBeVisible();
  await page.getByLabel("Result for UAT-03").selectOption("Blocked");
  await expect(accept).toBeDisabled();
  await expect(page.getByText(/Not ready: 1 scenarios/)).toBeVisible();
});
