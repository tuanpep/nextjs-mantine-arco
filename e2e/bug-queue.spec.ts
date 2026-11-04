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

test("find resolved reports and retain the queue through detail navigation", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/support/bugs");
  await expect(
    page.getByRole("tab", { name: "Active (1)", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByText("The export control does not respond.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("avatar");
  await expect(
    page.getByText("No matching records", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Search all reports", exact: true })
    .click();
  await expect(
    page.getByRole("tab", { name: "All (2)", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("link", { name: "Avatar image stays blank", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Back to reports", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Search", exact: true }),
  ).toHaveValue("avatar");
  await expect(
    page.getByRole("tab", { name: "All (2)", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Clear filter", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Search", exact: true }),
  ).toHaveValue("");
  await page.getByRole("combobox", { name: "Status", exact: true }).click();
  await page.getByRole("option", { name: "Resolved", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Export button does nothing", exact: true }),
  ).not.toBeVisible();
  await page.getByRole("tab", { name: "Active (1)", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: "Status", exact: true }),
  ).toHaveValue("All statuses");
  await expect(
    page.getByRole("link", { name: "Export button does nothing", exact: true }),
  ).toBeVisible();
});

test("mobile queue shows hidden-field matches without overflowing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/projects/beacon-portal/support/bugs?q=saved%20view%20menu&view=all&sort=title",
  );
  await expect(
    page.getByText("Message: It also fails from the saved view menu.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Sort", exact: true }),
  ).toHaveValue("Title: A–Z");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("textbox", { name: "Search", exact: true }).focus();
  await expect(
    page.getByRole("textbox", { name: "Search", exact: true }),
  ).toBeFocused();
});

test("new report returns to the effective queue after creation", async ({
  page,
}) => {
  await page.goto(
    "/projects/beacon-portal/support/bugs?view=all&q=avatar&sort=title&page=99",
  );
  await page.getByRole("link", { name: "New bug report" }).click();
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("New queue report");
  await page
    .getByRole("textbox", { name: "What happened" })
    .fill("Something failed");
  await page.getByRole("textbox", { name: "Expected result" }).fill("It works");
  await page
    .getByRole("checkbox", { name: "I don't know how to reproduce this" })
    .check();
  for (const name of ["Who is affected", "How soon"]) {
    await page.getByRole("combobox", { name }).click();
    await page.getByRole("option", { name: "Not sure" }).click();
  }
  await page.getByRole("button", { name: "Review" }).click();
  await page.getByRole("button", { name: "Create bug report" }).click();
  await page.getByRole("link", { name: "Back to reports" }).click();
  await expect(page.getByRole("textbox", { name: "Search" })).toHaveValue(
    "avatar",
  );
  await expect(page.getByRole("tab", { name: /All/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("combobox", { name: "Sort" })).toHaveValue(
    "Title: A–Z",
  );
  expect(new URL(page.url()).searchParams.get("page")).not.toBe("99");
});
