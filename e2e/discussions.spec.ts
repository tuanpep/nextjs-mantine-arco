import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "DX_LOCALE", value: "en", domain: "localhost", path: "/" },
  ]);
});

test("search, paginate and return to the same discussion list", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/discussions");
  await expect(
    page.getByRole("status").filter({ hasText: "13 discussions" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  const discussion = page
    .getByRole("list", { name: "Discussions", exact: true })
    .getByRole("link")
    .first();
  const title = await discussion.innerText();
  await discussion.click();
  await expect(
    page.getByRole("heading", { level: 1, name: title }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to discussions", exact: true })
    .click();
  await expect(page).toHaveURL(/page=2/);
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("no-such-discussion");
  await expect(
    page.getByText("No matching discussions", { exact: true }),
  ).toBeVisible();
  await expect(page).not.toHaveURL(/page=2/);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "13 discussions" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /Unanswered/ }).click();
  await expect(page).toHaveURL(/view=unanswered/);
  await expect(
    page
      .getByRole("list", { name: "Discussions", exact: true })
      .getByText(/\d+ replies/),
  ).toHaveCount(0);
});

test("create and reply, protect a draft, and expose session-only behavior", async ({
  page,
}) => {
  await page.goto("/projects/beacon-portal/discussions/new");
  await expect(
    page.getByRole("button", { name: "Start discussion", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Release handover");
  await page
    .getByRole("textbox", { name: "Opening post", exact: true })
    .fill("Who will own the release notes?\nPlease share your plan.");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("link", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Title", exact: true }),
  ).toHaveValue("Release handover");
  await page
    .getByRole("button", { name: "Start discussion", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Release handover", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("No replies yet. Start the conversation.", { exact: true }),
  ).toBeVisible();
  const reply = page.getByRole("textbox", { name: "Reply", exact: true });
  await reply.fill("I can prepare the first draft.");
  await page.getByRole("button", { name: "Post reply", exact: true }).click();
  await expect(
    page.getByText("I can prepare the first draft.", { exact: true }),
  ).toBeVisible();
  await expect(reply).toHaveValue("");
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Reply added to this session." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to discussions", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search", exact: true })
    .fill("I can prepare the first draft.");
  await expect(
    page.getByRole("link", { name: "Release handover", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("No matching discussions", { exact: true }),
  ).toBeVisible();
});

test("mobile Vietnamese list and reply validation", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "DX_LOCALE", value: "vi", domain: "localhost", path: "/" },
  ]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/orchid-reports/discussions");
  await expect(
    page.getByRole("heading", { name: "Thảo luận", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: "2 chủ đề" }),
  ).toBeVisible();
  await page
    .getByRole("list", { name: "Thảo luận", exact: true })
    .getByRole("link")
    .first()
    .click();
  await page
    .getByRole("textbox", { name: "Phản hồi", exact: true })
    .fill("   ");
  await page.getByRole("button", { name: "Gửi phản hồi", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Phản hồi", exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
