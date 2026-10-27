import { expect, test } from "@playwright/test";

test("validates a service request and tracks DX review across routes", async ({
  page,
}) => {
  await page.goto("/services");
  await page
    .getByRole("button", { name: "Request application access", exact: true })
    .click();
  await page.getByRole("button", { name: "Submit demo request" }).click();
  await expect(
    page.getByText("Application is required.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: /^Application/ })
    .fill("Service test CRM");
  await page.getByLabel("Work email").fill("you@example.com");
  await page.getByLabel("Access scope").fill("Read-only accounts");
  await page
    .getByLabel("Business justification")
    .fill("Review customer accounts for the quarterly planning process.");
  await page.getByRole("button", { name: "Submit demo request" }).click();
  await expect(page.getByRole("status")).toContainText("waiting for triage");
  await page.getByRole("link", { name: "My requests", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: /^SR-/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Application access · Service test CRM"),
  ).toBeVisible();
  await page.getByRole("link", { name: "DX operations", exact: true }).click();
  await page.getByLabel("DX assignee").selectOption("Minh Tran");
  await page.getByRole("button", { name: "Assign owner" }).click();
  await page.getByRole("button", { name: "Record status update" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Add a reason" }),
  ).toBeVisible();
  await page
    .getByLabel("Decision / progress reason")
    .fill("Application owner review requested.");
  await page.getByRole("button", { name: "Record status update" }).click();
  await page.getByLabel("Next status").selectOption("Approved");
  await page
    .getByLabel("Decision / progress reason")
    .fill("Application owner approved this demo request.");
  await page.getByRole("button", { name: "Record status update" }).click();
  await expect(
    page.getByText("Review approved. Fulfillment has not been confirmed.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page
      .getByLabel("Next status")
      .getByRole("option", { name: "Fulfilled", exact: true }),
  ).toHaveCount(0);
  await page.getByLabel("Next status").selectOption("In progress");
  await page
    .getByLabel("Decision / progress reason")
    .fill("Coordinating demo delivery with the owner.");
  await page.getByRole("button", { name: "Record status update" }).click();
  await page.getByLabel("Next status").selectOption("Fulfilled");
  await page
    .getByLabel("Decision / progress reason")
    .fill("Demo delivery review completed.");
  await page.getByRole("button", { name: "Record status update" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Add simulated fulfillment evidence" }),
  ).toBeVisible();
  await page
    .getByLabel("Simulated fulfillment evidence")
    .fill("Demo verification reference DX-123, walkthrough checked.");
  await page.getByRole("button", { name: "Record status update" }).click();
  await expect(
    page.getByText("This demo request is closed.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Record status update" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "My requests", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "My requests",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page
      .getByText("Assigned to Minh Tran.", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText("Approved: Application owner approved this demo request.", {
        exact: true,
      })
      .filter({ visible: true }),
  ).toBeVisible();
  await page
    .getByLabel("Filter status")
    .filter({ visible: true })
    .selectOption("Fulfilled");
  await expect(
    page
      .getByText(
        "Simulated fulfillment only. No real provisioning or changes occurred. See history for the recorded evidence.",
      )
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText(
        "Fulfilled: Demo delivery review completed. Evidence: Demo verification reference DX-123, walkthrough checked. Simulated fulfillment only. No real provisioning or changes occurred.",
        { exact: true },
      )
      .filter({ visible: true }),
  ).toBeVisible();
});
