import { expect, test, type Page } from "@playwright/test";

const helpPath = "/projects/beacon-portal/support/help";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: "DX_LOCALE", value: "en", domain: "localhost", path: "/" },
  ]);
});

async function createQuestion(page: Page) {
  await page.goto(`${helpPath}/new`);
  await expect(
    page.getByRole("button", { name: "Save question", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Question", exact: true })
    .fill("How do I deploy?");
  await page
    .getByRole("textbox", { name: "What you already tried", exact: true })
    .fill("I checked the deployment guide.");
  await page
    .getByRole("button", { name: "Save question", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "How do I deploy?", exact: true }),
  ).toBeVisible();
}

test("replies and answers retain or change the question status", async ({
  page,
}) => {
  await createQuestion(page);
  const conversation = page.getByRole("region", { name: "Conversation" });
  const message = page.getByRole("textbox", { name: "Message", exact: true });
  const action = page.getByRole("combobox", { name: "Action", exact: true });

  await expect(page.getByText("Open", { exact: true })).toBeVisible();
  await expect(action).toHaveValue("Reply");
  await message.fill("Which environment are you using?");
  await page.getByRole("button", { name: "Reply", exact: true }).click();
  await expect(
    conversation.getByText("Which environment are you using?", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Open", { exact: true })).toBeVisible();

  await action.click();
  await page.getByRole("option", { name: "Post answer", exact: true }).click();
  await message.fill("Deploy using the release pipeline.");
  await page.getByRole("button", { name: "Post answer", exact: true }).click();
  await expect(
    conversation.getByText("Deploy using the release pipeline.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("Answered", { exact: true })).toBeVisible();

  await action.click();
  await page.getByRole("option", { name: "Reply", exact: true }).click();
  await message.fill("Thank you!");
  await page.getByRole("button", { name: "Reply", exact: true }).click();
  await expect(
    conversation.getByText("Thank you!", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Answered", { exact: true })).toBeVisible();

  await action.click();
  await page
    .getByRole("option", { name: "Reopen question", exact: true })
    .click();
  await message.fill("I have another deployment issue.");
  await page
    .getByRole("button", { name: "Reopen question", exact: true })
    .click();
  await expect(
    conversation.getByText("I have another deployment issue.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Open", { exact: true })).toBeVisible();
});

test("protects question and message drafts and clears session records on reload", async ({
  page,
}) => {
  await page.goto(`${helpPath}/new`);
  await expect(
    page.getByRole("button", { name: "Save question", exact: true }),
  ).toBeEnabled();
  const question = page.getByRole("textbox", { name: "Question", exact: true });
  await question.fill("How do I deploy?");
  await page
    .getByRole("textbox", { name: "What you already tried", exact: true })
    .fill("I checked the guide.");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page
    .getByRole("main")
    .getByRole("link", { name: "Help", exact: true })
    .click();
  await expect(question).toHaveValue("How do I deploy?");
  const questionReload = page.waitForEvent("dialog");
  await page.evaluate(() => window.location.reload());
  await (await questionReload).dismiss();
  await expect(question).toHaveValue("How do I deploy?");
  await page
    .getByRole("button", { name: "Save question", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "How do I deploy?", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Saved in this session only. Reload clears these records. Nothing is sent or notified.",
      { exact: true },
    ),
  ).toBeVisible();

  const message = page.getByRole("textbox", { name: "Message", exact: true });
  await message.fill("A draft reply");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page
    .getByRole("main")
    .getByRole("link", { name: "Help", exact: true })
    .click();
  await expect(message).toHaveValue("A draft reply");
  const messageReload = page.waitForEvent("dialog");
  await page.evaluate(() => window.location.reload());
  await (await messageReload).dismiss();
  await expect(message).toHaveValue("A draft reply");
  await page.getByRole("button", { name: "Reply", exact: true }).click();
  await expect(message).toHaveValue("");
  await page.reload();
  await expect(
    page.getByText("This page is unavailable", { exact: true }),
  ).toBeVisible();
});

test("mobile Vietnamese conversation actions", async ({ page, context }) => {
  await context.addCookies([
    { name: "DX_LOCALE", value: "vi", domain: "localhost", path: "/" },
  ]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${helpPath}/new`);
  await expect(
    page.getByRole("button", { name: "Lưu câu hỏi", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Câu hỏi", exact: true })
    .fill("Làm sao triển khai?");
  await page
    .getByRole("textbox", { name: "Những cách bạn đã thử", exact: true })
    .fill("Đã xem hướng dẫn.");
  await page.getByRole("button", { name: "Lưu câu hỏi", exact: true }).click();
  const message = page.getByRole("textbox", { name: "Tin nhắn", exact: true });
  const action = page.getByRole("combobox", {
    name: "Thao tác",
    exact: true,
  });
  await expect(
    page.getByRole("button", { name: "Trả lời", exact: true }),
  ).toBeVisible();
  await action.click();
  await page
    .getByRole("option", { name: "Gửi câu trả lời", exact: true })
    .click();
  await message.fill("Dùng quy trình phát hành.");
  await page
    .getByRole("button", { name: "Gửi câu trả lời", exact: true })
    .click();
  await action.click();
  await page
    .getByRole("option", { name: "Mở lại câu hỏi", exact: true })
    .click();
  await message.fill("Tôi cần thêm trợ giúp.");
  await page
    .getByRole("button", { name: "Mở lại câu hỏi", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Trao đổi" })
      .getByText("Tôi cần thêm trợ giúp."),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
