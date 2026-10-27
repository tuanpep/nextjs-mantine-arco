import { expect, test } from "@playwright/test";

test("find ideas, validate a demand and inspect its submitted details", async ({
  page,
}) => {
  await page.goto("/improvements");
  await page
    .getByRole("textbox", { name: "Search ideas" })
    .fill("no matching example");
  await expect(
    page.getByRole("heading", { name: "No matching ideas" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("combobox", { name: "Submission type" }).click();
  await page.getByRole("option", { name: "Transformation demand" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Connect employee onboarding across teams",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Save report filters in Beacon Portal" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "New submission", exact: true })
    .click();
  const form = page.getByRole("dialog");
  await form.getByRole("radio", { name: "Transformation demand" }).check();
  await form.getByRole("button", { name: "Submit idea" }).click();
  await expect(
    form.getByText("Describe the pain point", { exact: true }),
  ).toBeVisible();
  await expect(
    form.getByText("Enter a business sponsor for this demand", { exact: true }),
  ).toBeVisible();
  await form
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("One onboarding checklist");
  await form
    .getByRole("textbox", { name: "Pain point" })
    .fill("New starters receive conflicting tasks.");
  await form
    .getByRole("textbox", { name: "Business value" })
    .fill("Reduce missed onboarding tasks by half.");
  await form.getByRole("textbox", { name: "Affected teams" }).fill("HR and IT");
  await form
    .getByRole("textbox", { name: "Business sponsor" })
    .fill("HR director");
  await form.getByRole("button", { name: "Submit idea" }).click();
  const details = page.getByRole("dialog", { name: "Submission details" });
  await expect(
    details.getByRole("heading", { name: "One onboarding checklist" }),
  ).toBeVisible();
  await expect(details.getByText("Submitted", { exact: true })).toBeVisible();
  await expect(details.getByText("HR director", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close details" }).click();
  await expect(
    page.getByRole("heading", { name: "One onboarding checklist" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "One onboarding checklist" }),
  ).toHaveCount(0);
});

test("application enhancements do not require a sponsor", async ({ page }) => {
  await page.goto("/improvements");
  await page
    .getByRole("button", { name: "New submission", exact: true })
    .click();
  const form = page.getByRole("dialog");
  await expect(
    form.getByRole("textbox", { name: "Business sponsor" }),
  ).toHaveCount(0);
  await form
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Remember filters");
  await form
    .getByRole("textbox", { name: "Pain point" })
    .fill("We enter the filters each day.");
  await form
    .getByRole("textbox", { name: "Business value" })
    .fill("Save ten minutes per day.");
  await form.getByRole("textbox", { name: "Affected teams" }).fill("Finance");
  await form.getByRole("button", { name: "Submit idea" }).click();
  await expect(
    page
      .getByRole("dialog", { name: "Submission details" })
      .getByText("Application enhancement", { exact: true }),
  ).toBeVisible();
});

test("read an incident, toggle affected once and manage demo subscription", async ({
  page,
}) => {
  await page.goto("/status");
  await expect(
    page.getByText("Manual demo records, not live monitoring", { exact: true }),
  ).toBeVisible();
  const incident = page.getByRole("region", {
    name: "Beacon Portal report exports delayed",
  });
  await incident.getByRole("button", { name: "Timeline & workaround" }).click();
  await expect(
    incident.getByText("Manual update timeline", { exact: true }),
  ).toBeVisible();
  await expect(
    incident.getByText("Use a smaller date range", { exact: false }),
  ).toBeVisible();
  await expect(
    incident.getByText("12 affected reports", { exact: true }),
  ).toBeVisible();
  await incident
    .getByRole("button", { name: "I'm also affected", exact: true })
    .click();
  await expect(
    incident.getByText("13 affected reports", { exact: true }),
  ).toBeVisible();
  await incident
    .getByRole("button", { name: "Remove my affected report" })
    .click();
  await expect(
    incident.getByText("12 affected reports", { exact: true }),
  ).toBeVisible();
  await incident.getByRole("switch", { name: "Subscribe to INC-204" }).check();
  await expect(
    incident.getByText("Subscribed in this demo only.", { exact: false }),
  ).toBeVisible();
  await incident
    .getByRole("switch", { name: "Subscribe to INC-204" })
    .uncheck();
  await expect(
    incident.getByText("Subscribed in this demo only.", { exact: false }),
  ).toHaveCount(0);
  await page.getByRole("combobox", { name: "Record type" }).click();
  await page.getByRole("option", { name: "Maintenance", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Workspace sign-in maintenance" }),
  ).toBeVisible();
  await expect(incident).toHaveCount(0);
});

test("known issue workaround and both pages work on a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/status");
  await page.getByRole("combobox", { name: "Record type" }).click();
  await page.getByRole("option", { name: "Known issues", exact: true }).click();
  await page.getByRole("button", { name: "Timeline & workaround" }).click();
  await expect(
    page.getByText("In Excel, use Data > From Text/CSV", { exact: false }),
  ).toBeVisible();
  await page.getByRole("switch", { name: "Subscribe to KI-031" }).check();
  await page.reload();
  await expect(
    page.getByRole("switch", { name: "Subscribe to KI-031" }),
  ).not.toBeChecked();
  for (const route of ["/status", "/improvements"]) {
    await page.goto(route);
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        { message: `${route} fits the mobile viewport` },
      )
      .toBe(true);
  }
});
